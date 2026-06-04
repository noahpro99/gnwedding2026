import { createServerFn } from "@tanstack/react-start";
import { db } from "./db";

export type Claim = { item_key: string; initials: string };

export const listClaims = createServerFn({ method: "GET" }).handler(
  async () => {
    return db
      .query("SELECT item_key, initials FROM registry_claims")
      .all() as Array<Claim>;
  },
);

export const claimItem = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (typeof data !== "object" || data === null) throw new Error("Invalid");
    const d = data as Record<string, unknown>;
    const itemKey = typeof d.itemKey === "string" ? d.itemKey.trim() : "";
    const initials =
      typeof d.initials === "string"
        ? d.initials.trim().toUpperCase().slice(0, 6)
        : "";
    if (!itemKey) throw new Error("Item is required");
    if (!initials) throw new Error("Initials are required");
    if (!/^[A-Z]{1,6}$/.test(initials)) {
      throw new Error("Initials must be 1–6 letters");
    }
    return { itemKey, initials };
  })
  .handler(async ({ data }) => {
    try {
      db.run(`INSERT INTO registry_claims (item_key, initials) VALUES (?, ?)`, [
        data.itemKey,
        data.initials,
      ]);
    } catch (err) {
      if (String(err).includes("UNIQUE")) {
        throw new Error("That gift has already been claimed.");
      }
      throw err;
    }
    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `**Registry claim:** ${data.itemKey} claimed by ${data.initials}`,
        }),
      }).catch(() => {});
    }

    return {
      ok: true as const,
      itemKey: data.itemKey,
      initials: data.initials,
    };
  });

export const unclaimItem = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (typeof data !== "object" || data === null) throw new Error("Invalid");
    const d = data as Record<string, unknown>;
    const itemKey = typeof d.itemKey === "string" ? d.itemKey.trim() : "";
    const initials =
      typeof d.initials === "string" ? d.initials.trim().toUpperCase() : "";
    if (!itemKey || !initials) throw new Error("Item and initials required");
    return { itemKey, initials };
  })
  .handler(async ({ data }) => {
    const row = db
      .query("SELECT initials FROM registry_claims WHERE item_key = ?")
      .get(data.itemKey) as { initials: string } | null;
    if (!row) return { ok: true as const };
    if (row.initials !== data.initials) {
      throw new Error("Initials do not match the original claim.");
    }
    db.run("DELETE FROM registry_claims WHERE item_key = ?", [data.itemKey]);
    return { ok: true as const };
  });
