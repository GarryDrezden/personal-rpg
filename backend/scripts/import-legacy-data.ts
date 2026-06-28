/**
 * Import legacy SQLite data (PHP api) into MySQL user_data for a given login.
 *
 * Usage: npm run import:legacy -- --login USER_LOGIN [--sqlite path/to/personal-rpg.sqlite]
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { prisma } from '../src/lib/prisma.js';
import { upsertUserData } from '../src/services/authService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

function parseArgs() {
  const args = process.argv.slice(2);
  let login = '';
  let sqlitePath = path.join(projectRoot, 'data', 'personal-rpg.sqlite');
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--login' && args[i + 1]) login = args[++i];
    if (args[i] === '--sqlite' && args[i + 1]) sqlitePath = path.resolve(args[++i]);
  }
  if (!login) {
    console.error('Usage: npm run import:legacy -- --login USER_LOGIN [--sqlite path]');
    process.exit(1);
  }
  return { login, sqlitePath };
}

async function main() {
  const { login, sqlitePath } = parseArgs();
  if (!fs.existsSync(sqlitePath)) {
    console.error(`SQLite file not found: ${sqlitePath}`);
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { login } });
  if (!user) {
    console.error(`User not found: ${login}`);
    process.exit(1);
  }

  const db = new Database(sqlitePath, { readonly: true });
  const report: Record<string, number | string> = { login, userId: user.id, sqlitePath };

  try {
    const dailyEntries = db.prepare('SELECT * FROM daily_entries ORDER BY date').all();
    await upsertUserData(user.id, 'dailyEntries', dailyEntries);
    report.dailyEntries = dailyEntries.length;

    const measurements = db.prepare('SELECT * FROM measurements ORDER BY date').all();
    await upsertUserData(user.id, 'measurements', measurements);
    report.measurements = measurements.length;

    const rewards = db.prepare('SELECT * FROM rewards').all();
    await upsertUserData(user.id, 'rewards', rewards);
    report.rewards = rewards.length;

    let bankDeposits: unknown[] = [];
    try {
      bankDeposits = db.prepare('SELECT * FROM bank_deposits').all();
    } catch {
      /* table may not exist in older schemas */
    }
    await upsertUserData(user.id, 'bankDeposits', bankDeposits);
    report.bankDeposits = bankDeposits.length;

    const settingsRow = db.prepare('SELECT value FROM app_settings WHERE key = ?').get('main') as
      | { value: string }
      | undefined;
    if (settingsRow?.value) {
      await upsertUserData(user.id, 'customSettingsBackup', JSON.parse(settingsRow.value));
      report.customSettingsBackup = 'imported';
    }

    await upsertUserData(user.id, 'legacyImport', {
      source: 'sqlite',
      importedAt: new Date().toISOString(),
      sqlitePath,
    });
    report.legacyImport = 'done';
  } finally {
    db.close();
  }

  console.log('Import report:');
  console.log(JSON.stringify(report, null, 2));
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
