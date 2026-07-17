/**
 * Generate invite records from the guest CSV.
 * Run with: bun src/server/invites-gen.ts [path-to-csv]
 *
 * Plus-one rows ("plus 1" name) attach to the immediately preceding named
 * person in the sheet, so "+1" appears inline with that specific name.
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
const data = rows.slice(1).map(r => ({
  name:   (r[0]  ?? "").trim(),
  party:  (r[1]  ?? "").trim(),
  coming: (r[4]  ?? "").trim(),
  card:   (r[10] ?? "").trim(),
}));

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type Member = { name: string; plusOnes: number };
type Group  = { id: string; members: Member[] };

const groups: Group[] = [];
let current: Group | null = null;
let lastMember: Member | null = null;  // the most recent named person in current group

for (const g of data) {
  if (!g.name) continue;
  if (g.name.toLowerCase() === "maybe below") break;  // stop here
  if (g.party === "New") continue;    // skip the couple
  if (g.coming === "FALSE") continue; // definitely not coming

  const isPlus1  = g.name.toLowerCase().startsWith("plus 1");
  const cardVal  = g.card.toLowerCase();
  const isCard   = cardVal.startsWith("card");
  const isX      = cardVal === "x" || cardVal.startsWith("x,");

  if (isCard) {
    // Start a new invite group
    current = { id: slug(g.name), members: [] };
    groups.push(current);
    const member: Member = { name: g.name, plusOnes: 0 };
    current.members.push(member);
    lastMember = member;
  } else if (isX && current) {
    if (isPlus1) {
      // Attach to the last named person, not the group
      if (lastMember) lastMember.plusOnes++;
    } else {
      const member: Member = { name: g.name, plusOnes: 0 };
      current.members.push(member);
      lastMember = member;
    }
  }
  // rows with empty card column and no card/x: not part of any group
}

const invites = groups
  .filter(g => g.members.length > 0)
  .map(g => {
    const guestNames = g.members
      .map(m => m.plusOnes === 0 ? m.name : `${m.name} +${m.plusOnes}`)
      .join(", ");
    const partySize = g.members.reduce((s, m) => s + 1 + m.plusOnes, 0);
    return { id: g.id, guest_names: guestNames, party_size_max: partySize };
  });

// Print TypeScript literal ready to paste into db.ts
console.log("const INVITES: Array<{ id: string; guest_names: string; party_size_max: number }> = [");
for (const inv of invites) {
  console.log(`  { id: "${inv.id}", guest_names: "${inv.guest_names}", party_size_max: ${inv.party_size_max} },`);
}
console.log("];\n");

// Human-readable table
console.log("ID".padEnd(28), "Names".padEnd(70), "Max");
console.log("─".repeat(102));
for (const inv of invites) {
  console.log(
    inv.id.padEnd(28),
    inv.guest_names.padEnd(70),
    inv.party_size_max,
  );
}
console.log(`\nTotal: ${invites.length} groups`);
