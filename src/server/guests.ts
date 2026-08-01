// AUTO-GENERATED from /home/noahpro/repos/gnwedding2026/G+N Wedding - Guests.csv
// Re-generate with: `bun src/server/guests-gen.ts`.
// Keep this file in sync with the official guest list.

export type Guest = {
  id: string
  name: string
  party: string
  side: string
  maxParty: number
  role?: string
}

export const GUESTS: ReadonlyArray<Guest> = []

export function findGuest(id: string): Guest | undefined {
  return GUESTS.find((g) => g.id === id)
}
