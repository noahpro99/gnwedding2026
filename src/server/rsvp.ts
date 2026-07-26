import { createServerFn } from "@tanstack/react-start";
import { db } from "./db";

export type GuestEntry = { name: string; attending: boolean };

export type RsvpPayload = {
  inviteId?: string;
  email?: string;
  guests: GuestEntry[];
  dietary?: string;
  notes?: string;
  needsTransport?: boolean;
};

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): RsvpPayload => {
    if (typeof data !== "object" || data === null) throw new Error("Invalid payload");
    const d = data as Record<string, unknown>;
    const rawGuests = Array.isArray(d.guests) ? d.guests : [];
    const guests: GuestEntry[] = rawGuests
      .map((g: unknown) => {
        if (typeof g !== "object" || g === null) return null;
        const gg = g as Record<string, unknown>;
        const name = typeof gg.name === "string" ? gg.name.trim() : "";
        return name ? { name, attending: Boolean(gg.attending) } : null;
      })
      .filter((g): g is GuestEntry => g !== null);
    if (!guests.length) throw new Error("Please enter at least one name.");
    return {
      inviteId: typeof d.inviteId === "string" ? d.inviteId : undefined,
      email: typeof d.email === "string" ? d.email.trim() : undefined,
      guests,
      dietary: typeof d.dietary === "string" ? d.dietary : undefined,
      notes: typeof d.notes === "string" ? d.notes : undefined,
      needsTransport: Boolean(d.needsTransport),
    };
  })
  .handler(async ({ data }) => {
    const attending = data.guests.some(g => g.attending);
    const primaryName = (data.guests.find(g => g.attending) ?? data.guests[0]!).name;
    const guestNames = data.guests.map(g => g.name);

    db.run(
      `INSERT INTO rsvps
        (invite_id, primary_name, guest_names, email, attending, party_size, dietary, notes, needs_transport)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.inviteId ?? null,
        primaryName,
        guestNames.join("\n"),
        data.email ?? null,
        attending ? 1 : 0,
        guestNames.length,
        data.dietary ?? null,
        data.notes ?? null,
        data.needsTransport ? 1 : 0,
      ],
    );

    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (webhook) {
      const yes = data.guests.filter(g => g.attending).map(g => g.name);
      const no  = data.guests.filter(g => !g.attending).map(g => g.name);
      const lines = [
        yes.length ? `✅ **Attending:** ${yes.join(", ")}` : null,
        no.length  ? `❌ **Not attending:** ${no.join(", ")}` : null,
        data.email ? `Email: ${data.email}` : null,
        data.dietary ? `Dietary: ${data.dietary}` : null,
        data.notes ? `Notes: ${data.notes}` : null,
        data.needsTransport ? `🚌 Interested in hotel shuttle` : null,
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
      [data.name, data.email ?? null, data.hotel, data.partySize, data.notes ?? null],
    );

    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (webhook) {
      const lines = [
        `🚌 **Shuttle Request — ${data.name}**`,
        `Hotel: ${data.hotel}`,
        `Party size: ${data.partySize}`,
        data.email ? `Email: ${data.email}` : null,
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
      .get(data.id) as { id: string; guest_names: string; party_size_max: number } | null;
    return row;
  });
