import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDirectory = path.resolve(__dirname, '../data');
fs.mkdirSync(dataDirectory, { recursive: true });

const configuredFile = process.env.SQLITE_FILE || 'medivoxa.sqlite';
const databasePath = path.isAbsolute(configuredFile)
  ? configuredFile
  : path.join(dataDirectory, configuredFile);

export const db = new Database(databasePath);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

const schemaPath = path.resolve(__dirname, '../schema.sql');
db.exec(fs.readFileSync(schemaPath, 'utf8'));

// Keeps the existing API's { rows, rowCount } response shape while using SQLite.
export async function query(sql, params = []) {
  let sqliteSql = sql
    .replace(/::date\b/gi, '')
    .replace(/CURRENT_DATE/gi, "date('now')")
    .replace(/\$(\d+)/g, '?');

  const statement = db.prepare(sqliteSql);
  const normalizedParams = params.map((value) => value === undefined ? null : value);

  if (/\bRETURNING\b/i.test(sqliteSql)) {
    const rows = statement.all(...normalizedParams);
    return { rows, rowCount: rows.length };
  }

  if (/^\s*(SELECT|PRAGMA|WITH)\b/i.test(sqliteSql)) {
    const rows = statement.all(...normalizedParams);
    return { rows, rowCount: rows.length };
  }

  const result = statement.run(...normalizedParams);
  return { rows: [], rowCount: result.changes, lastInsertRowid: result.lastInsertRowid };
}

export default db;
