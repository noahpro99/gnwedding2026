import { createServerFn } from '@tanstack/react-start'
import { db } from './db'
import { findGuest } from './guests'

export type RsvpPayload = {
  guestId: string
  inviteId?: string
  primaryName: string
  email?: string
  attending: boolean
  partySize: number
  dietary?: string
  notes?: string
  needsTransport?: boolean
}

export const submitRsvp = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown): RsvpPayload => {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid payload')
    }
    const d = data as Record<string, unknown>
    const guestId = typeof d.guestId === 'string' ? d.guestId.trim() : ''
    if (!guestId) throw new Error('Please pick your name from the list.')
    const guest = findGuest(guestId)
    if (!guest) throw new Error('We could not find that name on our list.')
    const partySize = Number(d.partySize ?? 1)
    if (!Number.isFinite(partySize) || partySize < 1) {
      throw new Error('Party size must be at least 1')
    }
    if (partySize > guest.maxParty) {
      throw new Error(
        `Your invite covers up to ${guest.maxParty} guest${guest.maxParty === 1 ? '' : 's'}.`,
      )
    }
    return {
      guestId,
      inviteId: typeof d.inviteId === 'string' ? d.inviteId : undefined,
      primaryName: guest.name,
      email: typeof d.email === 'string' ? d.email : undefined,
      attending: Boolean(d.attending),
      partySize,
      dietary: typeof d.dietary === 'string' ? d.dietary : undefined,
      notes: typeof d.notes === 'string' ? d.notes : undefined,
      needsTransport: Boolean(d.needsTransport),
    }
  })
  .handler(async ({ data }) => {
    db.run(
      `INSERT INTO rsvps
        (invite_id, primary_name, email, attending, party_size, dietary, notes, needs_transport)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.inviteId ?? null,
        data.primaryName,
        data.email ?? null,
        data.attending ? 1 : 0,
        data.partySize,
        data.dietary ?? null,
        data.notes ?? null,
        data.needsTransport ? 1 : 0,
      ],
    )
    return { ok: true as const }
  })

export type TransportPayload = {
  name: string
  email?: string
  hotel: string
  partySize: number
  notes?: string
}

export const requestTransport = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown): TransportPayload => {
    if (typeof data !== 'object' || data === null) throw new Error('Invalid')
    const d = data as Record<string, unknown>
    const name = typeof d.name === 'string' ? d.name.trim() : ''
    const hotel = typeof d.hotel === 'string' ? d.hotel.trim() : ''
    if (!name) throw new Error('Name is required')
    if (!hotel) throw new Error('Hotel is required')
    const partySize = Number(d.partySize ?? 1)
    return {
      name,
      email: typeof d.email === 'string' ? d.email : undefined,
      hotel,
      partySize: Number.isFinite(partySize) && partySize >= 1 ? partySize : 1,
      notes: typeof d.notes === 'string' ? d.notes : undefined,
    }
  })
  .handler(async ({ data }) => {
    db.run(
      `INSERT INTO transport_requests (name, email, hotel, party_size, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [data.name, data.email ?? null, data.hotel, data.partySize, data.notes ?? null],
    )
    return { ok: true as const }
  })

export const getInvite = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => {
    if (typeof data !== 'object' || data === null) throw new Error('Invalid')
    const id = (data as Record<string, unknown>).id
    if (typeof id !== 'string' || !id) throw new Error('Invite id required')
    return { id }
  })
  .handler(async ({ data }) => {
    const row = db
      .query('SELECT id, guest_names, party_size_max FROM invites WHERE id = ?')
      .get(data.id) as
      | { id: string; guest_names: string; party_size_max: number }
      | null
    return row
  })
