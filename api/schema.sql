CREATE TABLE IF NOT EXISTS daily_entries (
  id TEXT PRIMARY KEY,
  date TEXT UNIQUE NOT NULL,
  calories REAL,
  steps INTEGER,
  alcohol TEXT,
  morning_exercise INTEGER NOT NULL DEFAULT 0,
  gym INTEGER NOT NULL DEFAULT 0,
  journal INTEGER NOT NULL DEFAULT 0,
  cooking INTEGER NOT NULL DEFAULT 0,
  repair INTEGER NOT NULL DEFAULT 0,
  plants INTEGER NOT NULL DEFAULT 0,
  hobby INTEGER NOT NULL DEFAULT 0,
  comment TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS measurements (
  id TEXT PRIMARY KEY,
  date TEXT UNIQUE NOT NULL,
  weight REAL,
  chest REAL,
  waist REAL,
  belly REAL,
  hips REAL,
  thigh REAL,
  biceps REAL,
  comment TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS rewards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cost INTEGER NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  purchased_at TEXT,
  hidden INTEGER NOT NULL DEFAULT 0,
  money_goal REAL
);

CREATE TABLE IF NOT EXISTS bank_deposits (
  id TEXT PRIMARY KEY,
  amount REAL NOT NULL,
  date TEXT NOT NULL,
  comment TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS weekly_settings (
  id TEXT PRIMARY KEY,
  week_start TEXT UNIQUE NOT NULL,
  calories_limit INTEGER NOT NULL,
  steps_goal INTEGER NOT NULL,
  gym_target INTEGER NOT NULL,
  weekly_points_goal INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS app_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  default_calories_limit INTEGER NOT NULL DEFAULT 2500,
  default_steps_goal INTEGER NOT NULL DEFAULT 8000,
  default_gym_target INTEGER NOT NULL DEFAULT 2,
  default_weekly_points_goal INTEGER NOT NULL DEFAULT 500,
  point_settings TEXT NOT NULL
);
