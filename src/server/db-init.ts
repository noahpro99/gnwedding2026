import { db } from "./db";

const sample = db.query("SELECT COUNT(*) as n FROM invites").get() as {
  n: number;
};
if (sample.n === 0) {
  db.run(
    `INSERT INTO invites (id, guest_names, party_size_max) VALUES (?, ?, ?)`,
    ["demo", "Friend & Guest", 2],
  );
  console.log("Inserted demo invite. URL: /invite/demo");
}

console.log("DB ready.");
