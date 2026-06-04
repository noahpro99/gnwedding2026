import { createServerFn } from "@tanstack/react-start";
import { db } from "./db";

export type RsvpPayload = {
  inviteId?: string;
  primaryName: string;
  guestNames: string[];
  email?: string;
  attending: boolean;
  dietary?: string;
  notes?: string;
  needsTransport?: boolean;
};

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): RsvpPayload => {
    if (typeof data !== "object" || data === null) {
      throw new Error("Invalid payload");
    }
    const d = data as Record<string, unknown>;
    const primaryName =
      typeof d.primaryName === "string" ? d.primaryName.trim() : "";
    if (!primaryName) throw new Error("Please enter your name.");
    const rawNames = Array.isArray(d.guestNames) ? d.guestNames : [primaryName];
    const guestNames = rawNames
      .map((n) => (typeof n === "string" ? n.trim() : ""))
      .filter(Boolean);
    if (guestNames.length === 0) guestNames.push(primaryName);
    return {
      inviteId: typeof d.inviteId === "string" ? d.inviteId : undefined,
      primaryName,
      guestNames,
      email: typeof d.email === "string" ? d.email : undefined,
      attending: Boolean(d.attending),
      dietary: typeof d.dietary === "string" ? d.dietary : undefined,
      notes: typeof d.notes === "string" ? d.notes : undefined,
      needsTransport: Boolean(d.needsTransport),
    };
  })
  .handler(async ({ data }) => {
    db.run(
      `INSERT INTO rsvps
        (invite_id, primary_name, guest_names, email, attending, party_size, dietary, notes, needs_transport)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.inviteId ?? null,
        data.primaryName,
        data.guestNames.join("\n"),
        data.email ?? null,
        data.attending ? 1 : 0,
        data.guestNames.length,
        data.dietary ?? null,
        data.notes ?? null,
        data.needsTransport ? 1 : 0,
      ],
    );

    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (webhook) {
      const lines = [
        `**${data.primaryName}** — ${data.attending ? "Attending" : "Not attending"}`,
        data.guestNames.length > 1 ? `Party: ${data.guestNames.join(", ")}` : null,
        data.email ? `Email: ${data.email}` : null,
        data.dietary ? `Dietary: ${data.dietary}` : null,
        data.notes ? `Notes: ${data.notes}` : null,
      ].filter(Boolean).join("\n");

      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: lines }),
      }).catch(() => {});
    }

    return { ok: true as const };
  });

export type TransportPayload = {
  name: string;
  email?: string;
  hotel: string;
  partySize: number;
  notes?: string;
};

export const requestTransport = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): TransportPayload => {
    if (typeof data !== "object" || data === null) throw new Error("Invalid");
    const d = data as Record<string, unknown>;
    const name = typeof d.name === "string" ? d.name.trim() : "";
    const hotel = typeof d.hotel === "string" ? d.hotel.trim() : "";
    if (!name) throw new Error("Name is required");
    if (!hotel) throw new Error("Hotel is required");
    const partySize = Number(d.partySize ?? 1);
    return {
      name,
      email: typeof d.email === "string" ? d.email : undefined,
      hotel,
      partySize: Number.isFinite(partySize) && partySize >= 1 ? partySize : 1,
      notes: typeof d.notes === "string" ? d.notes : undefined,
    };
  })
  .handler(async ({ data }) => {
    db.run(
      `INSERT INTO transport_requests (name, email, hotel, party_size, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.name,
        data.email ?? null,
        data.hotel,
        data.partySize,
        data.notes ?? null,
      ],
    );
    return { ok: true as const };
  });

export const getInvite = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => {
    if (typeof data !== "object" || data === null) throw new Error("Invalid");
    const id = (data as Record<string, unknown>).id;
    if (typeof id !== "string" || !id) throw new Error("Invite id required");
    return { id };
  })
  .handler(async ({ data }) => {
    const row = db
      .query("SELECT id, guest_names, party_size_max FROM invites WHERE id = ?")
      .get(data.id) as {
      id: string;
      guest_names: string;
      party_size_max: number;
    } | null;
    return row;
  });
