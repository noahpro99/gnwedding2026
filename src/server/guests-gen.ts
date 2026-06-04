/**
 * Regenerate `src/server/guests.ts` from the source spreadsheet.
 *
 * Run with: `bun src/server/guests-gen.ts [path-to-csv]`
 * Defaults to ~/Downloads/G+N Wedding - Guests.csv.
 *
 * Skips the couple themselves and the trailing total rows. Dedupes by
 * appending (2), (3), … when the same display name appears more than once.
 */
import { homedir } from "node:os";
import { join } from "node:path";

const csvPath =
  process.argv[2] ?? join(homedir(), "Downloads", "G+N Wedding - Guests.csv");

const text = await Bun.file(csvPath).text();
const lines = text.split("\n").filter((l) => l.trim());
const rows = lines.slice(1).map((l) => {
  const parts = l.split(",");
  return {
    name: (parts[0] ?? "").trim(),
    party: (parts[1] ?? "").trim(),
    count: Number(parts[2]),
    side: (parts[3] ?? "").trim(),
    role: (parts[8] ?? "").trim(),
  };
});

const SKIP_NAMES = new Set([
  "Gwendolyn Swannell",
  "Noah Provenzano",
  "Maybe below",
  "",
]);

let guests = rows.filter(
  (r) =>
    r.name &&
    !SKIP_NAMES.has(r.name) &&
    Number.isFinite(r.count) &&
    r.count >= 1,
);

const seen = new Map<string, number>();
guests = guests.map((g) => {
  const n = seen.get(g.name) ?? 0;
  seen.set(g.name, n + 1);
  return {
    ...g,
    name: n === 0 ? g.name : `${g.name} (${n + 1})`,
  };
});

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const out = guests.map((g) => ({
  id: slug(g.name),
  name: g.name,
  party: g.party,
  side: g.side,
  maxParty: g.count,
  ...(g.role ? { role: g.role } : {}),
}));

const ts = `// AUTO-GENERATED from ${csvPath}
// Re-generate with: \`bun src/server/guests-gen.ts\`.
// Keep this file in sync with the official guest list.

export type Guest = {
  id: string
  name: string
  party: string
  side: string
  maxParty: number
  role?: string
}

export const GUESTS: ReadonlyArray<Guest> = ${JSON.stringify(out, null, 2)}

export function findGuest(id: string): Guest | undefined {
  return GUESTS.find((g) => g.id === id)
}
`;

await Bun.write("src/server/guests.ts", ts);
console.log(`Wrote ${out.length} guests to src/server/guests.ts`);
