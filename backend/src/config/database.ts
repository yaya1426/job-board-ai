import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const dbPath = process.env.DATABASE_PATH || './database.sqlite';
const db = new sqlite3.Database(dbPath);

// Promisify database methods
const runAsync = promisify(db.run.bind(db));
const getAsync = promisify(db.get.bind(db));
const allAsync = promisify(db.all.bind(db));
const execAsync = promisify(db.exec.bind(db));

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database schema
export const initDatabase = async () => {
  try {
    // Users table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('applicant', 'hr')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Jobs table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT NOT NULL,
        location TEXT NOT NULL,
        salary_range TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'closed')),
        created_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    // Applications table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER NOT NULL,
        applicant_id INTEGER,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        resume_path TEXT NOT NULL,
        openai_file_id TEXT,
        ai_score INTEGER,
        ai_feedback TEXT,
        status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'evaluating', 'rejected', 'under_review', 'accepted')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        evaluated_at DATETIME,
        FOREIGN KEY (job_id) REFERENCES jobs(id),
        FOREIGN KEY (applicant_id) REFERENCES users(id)
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

export { db, runAsync, getAsync, allAsync, execAsync };
export default db;
