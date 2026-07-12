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
// columns: 0=Guest, 1=Party, 2=side, 3=Relation/role, 4=Coming, 7=Role, 10=Cards
const data = rows.slice(1).map(r => ({
  name: (r[0] ?? "").trim(),
  party: (r[1] ?? "").trim(),
  coming: (r[4] ?? "").trim(),
  role: (r[7] ?? "").trim(),
  card: (r[10] ?? "").trim(),
}));

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Group by Card column: "card*" starts a new group, "x" appends to current group,
// "plus 1" with no card value appends to current group, empty non-plus-1 starts own group.
type Group = { named: string[]; plusOnes: number };
const groups: Group[] = [];
let current: Group | null = null;

for (const g of data) {
  if (!g.name) continue;
  if (g.name.toLowerCase() === "maybe below") continue;
  if (g.party === "New") continue;   // skip the couple
  if (g.coming === "FALSE") continue;

  const isPlus1 = g.name.toLowerCase().startsWith("plus 1");
  const cardVal = g.card.toLowerCase();
  const startsGroup = cardVal.startsWith("card") || (!isPlus1 && cardVal === "");

  if (startsGroup) {
    current = { named: [], plusOnes: 0 };
    groups.push(current);
  }

  if (!current) continue;

  if (isPlus1) {
    current.plusOnes++;
  } else {
    current.named.push(g.name);
  }
}

const invites = groups.filter(g => g.named.length > 0).map(p => {
  const id = slug(p.named[0]);
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
  return { id, guestNames, maxParty };
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

console.log("ID".padEnd(28), "Names".padEnd(55), "Max", "URL");
console.log("─".repeat(115));
for (const inv of invites) {
  console.log(
    inv.id.padEnd(28),
    inv.guestNames.padEnd(55),
    String(inv.maxParty).padEnd(4),
    `https://gnwedding2026.com/invite/${inv.id}`,
  );
}
