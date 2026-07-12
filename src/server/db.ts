import { Database } from "bun:sqlite";
import { mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";

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

// Seed all invite records — INSERT OR IGNORE so existing RSVPs are never disturbed.
// Regenerate from CSV: bun src/server/invites-gen.ts
const INVITES: Array<{ id: string; guest_names: string; party_size_max: number }> = [
  { id: "swannell1", guest_names: "Steven Swannell, Brunilda Swannell & Sophie Swannell", party_size_max: 3 },
  { id: "provenzano1", guest_names: "Dan Provenzano, Traci Provenzano, Delia Provenzano & Seth Provenzano", party_size_max: 4 },
  { id: "colliver", guest_names: "Elijah Colliver, Lily Braun, Ethan Colliver, Lauren Colliver, Gideon Colliver, Jonah Colliver, Sarahfina Colliver & Guest", party_size_max: 8 },
  { id: "chapman", guest_names: "Scott Chapman, Meghann Chapman, Cora Chapman, Marianne Chapman, Luther Chapman, Lori Chapman, Olivia Chapman, Daniel Chapman, Oliver Chapman, Lyn Currie & Guest", party_size_max: 11 },
  { id: "swannell", guest_names: "Charles Swannell", party_size_max: 1 },
  { id: "lyons", guest_names: "Nancy Swannell", party_size_max: 1 },
  { id: "rizzi", guest_names: "Mark Rizzi, Rachel Rizzi, Jocelyn Rizzi & Meredith Rizzi", party_size_max: 4 },
  { id: "vidal", guest_names: "Paul Vidal, Sarah Vidal, Natalie Vidal & Noelle Vidal", party_size_max: 4 },
  { id: "simon", guest_names: "Don Simon, Vicki Simon, Julia Simon, Audrey Simon & Thomas Simon", party_size_max: 5 },
  { id: "kreeger", guest_names: "Chris Kreeger & Karen Kreeger", party_size_max: 2 },
  { id: "mohammedian", guest_names: "Shirin Mohammedian & Guest", party_size_max: 2 },
  { id: "provenzano", guest_names: "Joe Provenzano, Linda Provenzano, Gary Provenzano, Pam Provenzano & Scott Provenzano", party_size_max: 5 },
  { id: "kuypers", guest_names: "Nathan Kuypers, Anilse Kuypers, Riley Kuypers, Brooke Kuypers, Lucas Kuypers & Ellie Kuypers", party_size_max: 6 },
  { id: "robles", guest_names: "Joe Robles Jr., Emily Robles & Reina Robles", party_size_max: 3 },
  { id: "andrews", guest_names: "Paul Lipchak & Megan Andrews", party_size_max: 2 },
  { id: "sando", guest_names: "Trisha Sando", party_size_max: 1 },
  { id: "dema", guest_names: "Ingrid Dema, Flora Dema, David Dema, Rei Dema & Guest", party_size_max: 5 },
  { id: "salik", guest_names: "Boaz Salik, Erin Salik, Rivka Salik & Miriam Salik", party_size_max: 4 },
  { id: "smith", guest_names: "Will Smith, Caitlyn Smith, Lucy Smith & Maisy Smith", party_size_max: 4 },
  { id: "o-riordan", guest_names: "Jenna O'Riordan & Guest", party_size_max: 2 },
  { id: "leaper", guest_names: "Heather Leaper & Guest", party_size_max: 2 },
  { id: "okie", guest_names: "Katherine Okie", party_size_max: 1 },
  { id: "hamouda", guest_names: "Sally Hamouda & Guest", party_size_max: 2 },
  { id: "vu", guest_names: "Tu Vu & 3 Guests", party_size_max: 4 },
  { id: "brown", guest_names: "Zachary Brown, Jennifer Brown, Collin Brown, Kaila Brown, Patrick Brown, Valeria Mercado & Guest", party_size_max: 7 },
  { id: "pradhan", guest_names: "Aanish Pradhan", party_size_max: 1 },
  { id: "broughton", guest_names: "Reid Broughton", party_size_max: 1 },
  { id: "sannikov", guest_names: "Mikhail Sannikov & Guest", party_size_max: 2 },
  { id: "sharma", guest_names: "Rituraj Sharma", party_size_max: 1 },
  { id: "randolph", guest_names: "Michael Randolph", party_size_max: 1 },
  { id: "mills", guest_names: "Jacob Mills & Guest", party_size_max: 2 },
  { id: "bond", guest_names: "Arthur Bond", party_size_max: 1 },
  { id: "graf", guest_names: "Noam Graf", party_size_max: 1 },
  { id: "shah", guest_names: "Stuti Shah & Guest", party_size_max: 2 },
  { id: "braak", guest_names: "Jesse Braak", party_size_max: 1 },
  { id: "turbyfill", guest_names: "Gabe Turbyfill", party_size_max: 1 },
  { id: "stock", guest_names: "Patrick Stock", party_size_max: 1 },
  { id: "helsing", guest_names: "Scott Helsing, Lee Ann Helsing, Caleb Helsing, Serina Helsing, Ella Grace Helsing & 2 Guests", party_size_max: 7 },
  { id: "howe", guest_names: "Robert Howe, Karen Howe, Alexander Howe, Elijah Howe, Ella Howe & Lucy Howe", party_size_max: 6 },
  { id: "white", guest_names: "Travis White, Kandi White, Garrett Thompson & Kaelyn Thompson", party_size_max: 4 },
  { id: "davis", guest_names: "Patrick Davis", party_size_max: 1 },
  { id: "backus", guest_names: "Dave Backus, Deborah Backus, Kendall Backus & Guest", party_size_max: 4 },
  { id: "hecox", guest_names: "Frank Hecox & Susie Hecox", party_size_max: 2 },
  { id: "lindsey", guest_names: "Jessica Lindsey", party_size_max: 1 },
  { id: "sizemore", guest_names: "Mason Sizemore", party_size_max: 1 },
  { id: "johnson", guest_names: "Tom Johnson & Linda Johnson", party_size_max: 2 },
  { id: "mountjoy", guest_names: "Danny Mountjoy & Anne Mountjoy", party_size_max: 2 },
  { id: "buck", guest_names: "Shawna Buck", party_size_max: 1 },
];

const insertInvite = db.prepare(
  `INSERT OR IGNORE INTO invites (id, guest_names, party_size_max) VALUES (?, ?, ?)`
);
for (const inv of INVITES) {
  insertInvite.run(inv.id, inv.guest_names, inv.party_size_max);
}

export type Invite = {
  id: string;
  guest_names: string;
  party_size_max: number;
  created_at: string;
};
