<?php

class Database
{
    private PDO $pdo;
    private string $dbPath;

    public function __construct()
    {
        $dataDir = dirname(__DIR__) . '/data';
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0755, true);
        }
        $this->dbPath = $dataDir . '/personal-rpg.sqlite';
        $this->pdo = new PDO('sqlite:' . $this->dbPath);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $this->migrate();
        $this->seedIfEmpty();
    }

    public function getPdo(): PDO
    {
        return $this->pdo;
    }

    public function getDbPath(): string
    {
        return $this->dbPath;
    }

    private function migrate(): void
    {
        $schema = file_get_contents(__DIR__ . '/schema.sql');
        $this->pdo->exec($schema);
        $this->migrateColumns();
        $this->migrateBank();
    }

    private function migrateBank(): void
    {
        $hasBank = $this->pdo->query(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='bank_deposits'",
        )->fetch();
        if ($hasBank) {
            return;
        }

        $this->pdo->exec(
            'CREATE TABLE bank_deposits (
               id TEXT PRIMARY KEY,
               amount REAL NOT NULL,
               date TEXT NOT NULL,
               comment TEXT NOT NULL DEFAULT \'\'
             )',
        );

        $hasOld = $this->pdo->query(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='reward_savings'",
        )->fetch();
        if ($hasOld) {
            $this->pdo->exec(
                'INSERT INTO bank_deposits (id, amount, date, comment)
                 SELECT id, amount, date, comment FROM reward_savings',
            );
            $this->pdo->exec('DROP TABLE reward_savings');
        }
    }

    private function migrateColumns(): void
    {
        $cols = array_column(
            $this->pdo->query('PRAGMA table_info(rewards)')->fetchAll(),
            'name',
        );
        if (!in_array('money_goal', $cols, true)) {
            $this->pdo->exec('ALTER TABLE rewards ADD COLUMN money_goal REAL');
        }

        $appCols = array_column(
            $this->pdo->query('PRAGMA table_info(app_settings)')->fetchAll(),
            'name',
        );
        if (!in_array('gender', $appCols, true)) {
            $this->pdo->exec("ALTER TABLE app_settings ADD COLUMN gender TEXT NOT NULL DEFAULT 'male'");
        }
        if (!in_array('weight_goal', $appCols, true)) {
            $this->pdo->exec('ALTER TABLE app_settings ADD COLUMN weight_goal REAL NOT NULL DEFAULT 100');
        }
        if (!in_array('coin_settings', $appCols, true)) {
            $this->pdo->exec('ALTER TABLE app_settings ADD COLUMN coin_settings TEXT');
        }
        if (!in_array('avatar_settings', $appCols, true)) {
            $this->pdo->exec('ALTER TABLE app_settings ADD COLUMN avatar_settings TEXT');
        }
    }

    private function seedIfEmpty(): void
    {
        $initialized = (int) $this->pdo->query('SELECT COUNT(*) FROM app_settings')->fetchColumn();
        if ($initialized > 0) {
            return;
        }

        $seed = json_decode(file_get_contents(__DIR__ . '/seed.json'), true);
        $defs = $seed['defaults'] ?? [];
        $defaultPoints = [
            'caloriesOk' => 40, 'stepsOk' => 35, 'noAlcohol' => 35,
            'alcoholModerate' => -20, 'alcoholHeavy' => -60,
            'morningExercise' => 20, 'gym' => 25, 'journal' => 20,
            'cooking' => 10, 'repair' => 10, 'plants' => 10, 'hobby' => 10,
            'gymWeeklyBonus' => 50, 'noAlcoholWeekBonus' => 70,
            'caloriesWeekBonus' => 70, 'measurementsMondayBonus' => 30,
        ];

        $calLimit = (int) ($defs['caloriesLimit'] ?? 2650);
        $stepsGoal = (int) ($defs['stepsGoal'] ?? 11500);
        $gymTarget = (int) ($defs['gymTarget'] ?? 2);
        $weekGoal = (int) ($defs['weeklyPointsGoal'] ?? 500);

        $stmt = $this->pdo->prepare(
            'INSERT INTO app_settings (id, default_calories_limit, default_steps_goal, default_gym_target, default_weekly_points_goal, point_settings, gender, weight_goal)
             VALUES (1, :cl, :sg, :gt, :wg, :ps, :gender, :weight_goal)'
        );
        $stmt->execute([
            'cl' => $calLimit,
            'sg' => $stepsGoal,
            'gt' => $gymTarget,
            'wg' => $weekGoal,
            'ps' => json_encode($defaultPoints),
            'gender' => 'male',
            'weight_goal' => 100,
        ]);

        if (!empty($defs['weekStart'])) {
            $this->pdo->prepare(
                'INSERT INTO weekly_settings (id, week_start, calories_limit, steps_goal, gym_target, weekly_points_goal)
                 VALUES (:id, :ws, :cl, :sg, :gt, :wg)'
            )->execute([
                'id' => $this->uuid(),
                'ws' => $defs['weekStart'],
                'cl' => $calLimit,
                'sg' => $stepsGoal,
                'gt' => $gymTarget,
                'wg' => $weekGoal,
            ]);
        }

        foreach ($seed['measurements'] ?? [] as $m) {
            $this->pdo->prepare(
                'INSERT INTO measurements (id, date, weight, chest, waist, belly, hips, thigh, biceps, comment)
                 VALUES (:id, :date, :weight, :chest, :waist, :belly, :hips, :thigh, :biceps, :comment)'
            )->execute([
                'id' => $this->uuid(),
                'date' => $m['date'],
                'weight' => $m['weight'],
                'chest' => $m['chest'],
                'waist' => $m['waist'],
                'belly' => $m['belly'],
                'hips' => $m['hips'],
                'thigh' => $m['thigh'],
                'biceps' => $m['biceps'],
                'comment' => $m['comment'] ?? '',
            ]);
        }

        foreach ($seed['dailyEntries'] ?? [] as $d) {
            $this->insertDaily($d);
        }

        foreach ($seed['rewards'] as $r) {
            $this->pdo->prepare(
                'INSERT INTO rewards (id, title, description, cost, category, purchased_at, hidden)
                 VALUES (:id, :title, :description, :cost, :category, NULL, 0)'
            )->execute([
                'id' => $this->uuid(),
                'title' => $r['title'],
                'description' => $r['description'],
                'cost' => $r['cost'],
                'category' => $r['category'],
            ]);
        }
    }

    public function insertDaily(array $d): void
    {
        $this->pdo->prepare(
            'INSERT OR REPLACE INTO daily_entries
             (id, date, calories, steps, alcohol, morning_exercise, gym, journal, cooking, repair, plants, hobby, comment)
             VALUES (
               COALESCE((SELECT id FROM daily_entries WHERE date = :date), :new_id),
               :date, :calories, :steps, :alcohol,
               :morning_exercise, :gym, :journal, :cooking, :repair, :plants, :hobby, :comment
             )'
        )->execute([
            'new_id' => $this->uuid(),
            'date' => $d['date'],
            'calories' => $d['calories'] ?? null,
            'steps' => $d['steps'] ?? null,
            'alcohol' => $d['alcohol'] ?? null,
            'morning_exercise' => !empty($d['morningExercise']) ? 1 : 0,
            'gym' => !empty($d['gym']) ? 1 : 0,
            'journal' => !empty($d['journal']) ? 1 : 0,
            'cooking' => !empty($d['cooking']) ? 1 : 0,
            'repair' => !empty($d['repair']) ? 1 : 0,
            'plants' => !empty($d['plants']) ? 1 : 0,
            'hobby' => !empty($d['hobby']) ? 1 : 0,
            'comment' => $d['comment'] ?? '',
        ]);
    }

    public function uuid(): string
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
