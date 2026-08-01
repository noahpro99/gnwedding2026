import { createServerFn } from "@tanstack/react-start";
import { db } from "./db";
import { DATE_OPTIONS } from "./bachelor-data";

export type DateChoice = "yes" | "maybe" | "no";
export type DateAnswer = { choice: DateChoice; reason?: string };

export type BachelorPayload = {
  inviteId?: string;
  name: string;
  availability: Record<string, DateAnswer>;
  interests?: string[];
  notes?: string;
};

const VALID_DATE_IDS = new Set(DATE_OPTIONS.map((d) => d.id));
const VALID_CHOICES: DateChoice[] = ["yes", "maybe", "no"];

export const submitBachelorAvailability = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): BachelorPayload => {
    if (typeof data !== "object" || data === null) throw new Error("Invalid payload");
    const d = data as Record<string, unknown>;

    const name = typeof d.name === "string" ? d.name.trim() : "";
    if (!name) throw new Error("Please enter your name.");

    const rawAvail =
      typeof d.availability === "object" && d.availability !== null
        ? (d.availability as Record<string, unknown>)
        : {};
    const availability: Record<string, DateAnswer> = {};
    for (const [key, val] of Object.entries(rawAvail)) {
      if (!VALID_DATE_IDS.has(key) || typeof val !== "object" || val === null) continue;
      const v = val as Record<string, unknown>;
      const choice = v.choice as DateChoice;
      if (!VALID_CHOICES.includes(choice)) continue;
      const reason = typeof v.reason === "string" ? v.reason.trim() : "";
      if (choice === "maybe" && !reason) {
        throw new Error("Add a reason for every date you marked Maybe.");
      }
      availability[key] = choice === "maybe" ? { choice, reason } : { choice };
    }
    if (DATE_OPTIONS.some((d) => !availability[d.id])) {
      throw new Error("Mark Yes, No, or Maybe for every date.");
    }

    const interests = Array.isArray(d.interests)
      ? d.interests.filter((i): i is string => typeof i === "string")
      : [];

    return {
      inviteId: typeof d.inviteId === "string" ? d.inviteId : undefined,
      name,
      availability,
      interests,
      notes: typeof d.notes === "string" ? d.notes.trim() : undefined,
    };
  })
  .handler(async ({ data }) => {
    db.run(
      `INSERT INTO bachelor_availability
        (invite_id, name, email, availability, interests, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.inviteId ?? null,
        data.name,
        null,
        JSON.stringify(data.availability),
        data.interests?.length ? data.interests.join(", ") : null,
        data.notes ?? null,
      ],
    );

    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (webhook) {
      const label = (id: string) => DATE_OPTIONS.find((d) => d.id === id)?.label ?? id;
      const mark = { yes: "✅", maybe: "🤔", no: "❌" } as const;
      const availLines = DATE_OPTIONS.filter((d) => data.availability[d.id]).map((d) => {
        const a = data.availability[d.id]!;
        return `${mark[a.choice]} ${label(d.id)}${a.reason ? ` (${a.reason})` : ""}`;
      });

      const lines = [
        `🥃 **Bachelor availability: ${data.name}**`,
        ...availLines,
        data.interests?.length ? `Into: ${data.interests.join(", ")}` : null,
        data.notes ? `Notes: ${data.notes}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: lines }),
      }).catch(() => {});
    }

    return { ok: true as const };
  });

export const getBachelorInvite = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => {
    if (typeof data !== "object" || data === null) throw new Error("Invalid");
    const id = (data as Record<string, unknown>).id;
    if (typeof id !== "string" || !id) throw new Error("Invite id required");
    return { id };
  })
  .handler(async ({ data }) => {
    const row = db
      .query("SELECT id, guest_names FROM bachelor_invites WHERE id = ?")
      .get(data.id) as { id: string; guest_names: string } | null;
    return row;
  });
