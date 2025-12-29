
import Database from 'better-sqlite3';

const dbPath = process.env.DATABASE_URL || 'dev.db';
const db = new Database(dbPath);

// Enable Write-Ahead Logging for concurrency (Disabled for Colab/Drive compatibility)
// db.pragma('journal_mode = WAL');

// Define Schema
const schema = `
CREATE TABLE IF NOT EXISTS User (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  credits INTEGER DEFAULT 50,
  plan TEXT DEFAULT 'free',
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Project (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  userId TEXT NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id)
);

CREATE TABLE IF NOT EXISTS Generation (
  id TEXT PRIMARY KEY,
  userId TEXT,
  projectId TEXT,
  type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  negativePrompt TEXT,
  settings TEXT,
  status TEXT,
  progress INTEGER DEFAULT 0,
  resultUrl TEXT,
  thumbnailUrl TEXT,
  error TEXT,
  cost INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id),
  FOREIGN KEY (projectId) REFERENCES Project(id)
);
`;

db.exec(schema);

export default db;
