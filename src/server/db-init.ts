import { db } from "./db";

const invites = [
  { id: "demo", guest_names: "Friend & Guest", party_size_max: 2 },
  { id: "mikhail-sannikov", guest_names: "Mikhail Sannikov +1", party_size_max: 2 },
  { id: "hiten-tandon", guest_names: "Hiten Tandon", party_size_max: 1 },
  { id: "noam-graf", guest_names: "Noam Graf", party_size_max: 1 },
];

for (const invite of invites) {
  db.run(
    `INSERT OR IGNORE INTO invites (id, guest_names, party_size_max) VALUES (?, ?, ?)`,
    [invite.id, invite.guest_names, invite.party_size_max],
  );
}

console.log("DB ready. Digital invite URLs:");
console.log("  /invite/mikhail-sannikov");
console.log("  /invite/hiten-tandon");
console.log("  /invite/noam-graf");
