import { Database } from "bun:sqlite";
import { mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import { INVITES } from "./invites-data";

const DB_PATH = process.env.DB_PATH ?? "./data/wedding.sqlite";

if (!existsSync(dirname(DB_PATH))) {
  mkdirSync(dirname(DB_PATH), { recursive: true });
}

export const db = new Database(DB_PATH, { create: true });

db.run("PRAGMA journal_mode = WAL;");
db.run("PRAGMA foreign_keys = ON;");

db.run(`
  CREATE TABLE IF NOT EXISTS invites (
    id TEXT PRIMARY KEY,
    guest_names TEXT NOT NULL,
    party_size_max INTEGER NOT NULL DEFAULT 2,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

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
`);

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
`);

try {
  db.run(`ALTER TABLE rsvps ADD COLUMN guest_names TEXT;`);
} catch {}

try {
  db.run(`ALTER TABLE notifications ADD COLUMN push_sent INTEGER NOT NULL DEFAULT 0;`);
} catch {}

try {
  db.run(`ALTER TABLE notifications ADD COLUMN email_sent INTEGER NOT NULL DEFAULT 0;`);
} catch {}

db.run(`
  CREATE TABLE IF NOT EXISTS registry_claims (
    item_key TEXT PRIMARY KEY,
    initials TEXT NOT NULL,
    claimed_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS push_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT UNIQUE NOT NULL,
    auth TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Invite records loaded from invites-data.ts (auto-generated).
// To update: edit the CSV then run: bun src/server/invites-gen.ts

const upsertInvite = db.prepare(`
  INSERT INTO invites (id, guest_names, party_size_max) VALUES (?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    guest_names = excluded.guest_names,
    party_size_max = excluded.party_size_max
`);
for (const inv of INVITES) {
  upsertInvite.run(inv.id, inv.guest_names, inv.party_size_max);
}

export type Invite = {
  id: string;
  guest_names: string;
  party_size_max: number;
  created_at: string;
};
