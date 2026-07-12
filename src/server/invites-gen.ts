/**
 * Generate invite records from the guest CSV and write db-init.ts.
 * Run with: bun src/server/invites-gen.ts [path-to-csv]
 */
import { join } from "node:path";

const csvPath =
  process.argv[2] ?? join(import.meta.dir, "../../G+N Wedding - Guests.csv");

const text = await Bun.file(csvPath).text();

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else field += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { row.push(field); field = ""; }
      else if (ch === '\n') { row.push(field); field = ""; rows.push(row); row = []; }
      else if (ch !== '\r') field += ch;
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const rows = parseCSV(text);
// columns: 0=Guest, 1=Party, 2=side, 3=Relation/role, 4=Coming, 7=Role
const data = rows.slice(1).map(r => ({
  name: (r[0] ?? "").trim(),
  party: (r[1] ?? "").trim(),
  coming: (r[4] ?? "").trim(),
  role: (r[7] ?? "").trim(),
}));

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Group by Party, skip the couple and no-party rows
const parties = new Map<string, { name: string; named: string[]; plusOnes: number }>();

let lastPartyKey: string | null = null;
for (const g of data) {
  if (!g.name) continue;
  if (g.name.toLowerCase() === "maybe below") continue;
  if (g.party === "New") continue;
  if (g.coming === "FALSE") continue;

  const isPlus1 = g.name.toLowerCase().startsWith("plus 1");

  // No-party plus-ones attach to the last seen party
  const key = g.party || (isPlus1 ? lastPartyKey : null);
  if (!key) continue;

  if (!parties.has(key)) parties.set(key, { name: key, named: [], plusOnes: 0 });
  const p = parties.get(key)!;
  if (isPlus1) {
    p.plusOnes++;
  } else {
    p.named.push(g.name);
    lastPartyKey = key;
  }
}

const invites = Array.from(parties.values()).map(p => {
  const id = slug(p.name);
  const maxParty = p.named.length + p.plusOnes;
  let guestNames: string;
  if (p.plusOnes > 0) {
    guestNames = p.named.join(", ") + (p.plusOnes === 1 ? " & Guest" : ` & ${p.plusOnes} Guests`);
  } else if (p.named.length === 1) {
    guestNames = p.named[0];
  } else if (p.named.length === 2) {
    guestNames = p.named[0] + " & " + p.named[1];
  } else {
    guestNames = p.named.slice(0, -1).join(", ") + " & " + p.named[p.named.length - 1];
  }
  return { id, guestNames, maxParty, party: p.name };
});

// Write db-init.ts
const ts = `import { db } from "./db";

const invites = ${JSON.stringify(
  invites.map(({ id, guestNames, maxParty }) => ({
    id,
    guest_names: guestNames,
    party_size_max: maxParty,
  })),
  null,
  2,
)};

for (const invite of invites) {
  db.run(
    \`INSERT OR IGNORE INTO invites (id, guest_names, party_size_max) VALUES (?, ?, ?)\`,
    [invite.id, invite.guest_names, invite.party_size_max],
  );
}

console.log("Inserted", invites.length, "invites.");
`;

await Bun.write("src/server/db-init.ts", ts);
console.log(`Wrote ${invites.length} invite groups to db-init.ts\n`);

console.log("Party".padEnd(16), "Names".padEnd(50), "Max", "URL");
console.log("─".repeat(110));
for (const inv of invites) {
  console.log(
    inv.party.padEnd(16),
    inv.guestNames.padEnd(50),
    String(inv.maxParty).padEnd(4),
    `https://gnwedding2026.com/invite/${inv.id}`,
  );
}
