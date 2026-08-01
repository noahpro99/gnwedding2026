/**
 * Generate bachelor party invites from the guest CSV and write
 * bachelor-invites.ts. Run with: bun src/server/bachelor-gen.ts [path-to-csv]
 *
 * Anyone with TRUE in the "Bachlor party" column gets a personal invite link
 * at /bachelor/<id>. The groom and bride are skipped (it's their party).
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
const header = rows[0]!.map((h) => h.trim().toLowerCase());
const nameCol = 0;
const roleCol = header.indexOf("role");
const bpCol = header.indexOf("bachlor party");

if (bpCol === -1) throw new Error('Could not find a "Bachlor party" column in the CSV.');

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type Invite = { id: string; guest_names: string };
const invites: Invite[] = [];
const seen = new Set<string>();

for (const r of rows.slice(1)) {
  const name = (r[nameCol] ?? "").trim();
  if (!name) continue;
  if (name.toLowerCase() === "maybe below") break;
  if (name.toLowerCase().startsWith("plus 1")) continue;
  if ((r[bpCol] ?? "").trim().toUpperCase() !== "TRUE") continue;

  const role = (r[roleCol] ?? "").trim().toLowerCase();
  if (role === "groom" || role === "bride") continue;

  const id = slug(name);
  if (!id || seen.has(id)) continue;
  seen.add(id);
  invites.push({ id, guest_names: name });
}

const outPath = join(import.meta.dir, "bachelor-invites.ts");
const ts = `// AUTO-GENERATED — do not edit by hand.
// Regenerate: bun src/server/bachelor-gen.ts
export const BACHELOR_INVITES: Array<{ id: string; guest_names: string }> = [
${invites.map((inv) => `  { id: "${inv.id}", guest_names: "${inv.guest_names}" },`).join("\n")}
];
`;

await Bun.write(outPath, ts);
console.log(`Wrote ${invites.length} bachelor invites to src/server/bachelor-invites.ts\n`);
console.log("ID".padEnd(24), "Name");
console.log("─".repeat(50));
for (const inv of invites) console.log(inv.id.padEnd(24), inv.guest_names);
