import { Database } from 'bun:sqlite'
import { mkdirSync, existsSync } from 'node:fs'
import { dirname } from 'node:path'

const DB_PATH = process.env.DB_PATH ?? './data/wedding.sqlite'

if (!existsSync(dirname(DB_PATH))) {
  mkdirSync(dirname(DB_PATH), { recursive: true })
}

export const db = new Database(DB_PATH, { create: true })

db.run('PRAGMA journal_mode = WAL;')
db.run('PRAGMA foreign_keys = ON;')

db.run(`
  CREATE TABLE IF NOT EXISTS invites (
    id TEXT PRIMARY KEY,
    guest_names TEXT NOT NULL,
    party_size_max INTEGER NOT NULL DEFAULT 2,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

db.run(`
  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invite_id TEXT,
    primary_name TEXT NOT NULL,
    email TEXT,
    attending INTEGER NOT NULL,
    party_size INTEGER NOT NULL DEFAULT 1,
    dietary TEXT,
    notes TEXT,
    needs_transport INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (invite_id) REFERENCES invites(id) ON DELETE SET NULL
  );
`)

db.run(`
  CREATE TABLE IF NOT EXISTS transport_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    hotel TEXT NOT NULL,
    party_size INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

db.run(`
  CREATE TABLE IF NOT EXISTS registry_claims (
    item_key TEXT PRIMARY KEY,
    initials TEXT NOT NULL,
    claimed_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

export type Invite = {
  id: string
  guest_names: string
  party_size_max: number
  created_at: string
}
