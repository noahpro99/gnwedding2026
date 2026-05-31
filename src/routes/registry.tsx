import { createFileRoute } from '@tanstack/react-router'
import { Check, Gift, X } from 'lucide-react'
import { useState } from 'react'
import { SectionHeader } from '~/components/SectionHeader'
import { claimItem, listClaims, unclaimItem } from '~/server/registry'

export const Route = createFileRoute('/registry')({
  loader: async () => ({ claims: await listClaims() }),
  component: Registry,
})

type Item = { name: string; price?: number }
type Section = { title: string; note?: string; items: Item[] }

const REGISTRY: Section[] = [
  {
    title: 'Kitchen',
    items: [
      { name: 'Spatula', price: 14 },
      { name: 'Cheese grater', price: 12 },
      { name: 'Silicone spatula' },
      { name: 'Mixing Pyrex bowls', price: 18 },
      { name: 'Oven mitts', price: 15 },
      { name: 'Tongs', price: 11 },
      { name: 'Panini press', price: 35 },
      { name: 'Cooking pans', price: 45 },
      { name: 'Cookie sheets', price: 23 },
      { name: 'Brownie pan', price: 13 },
      { name: 'Shower water filter' },
      { name: 'Reverse osmosis water filter', price: 219 },
      { name: 'Vitamix blender' },
      { name: 'Le Creuset Dutch oven' },
      { name: 'Metal colander', price: 13 },
      { name: 'Microwave' },
      { name: 'Stainless steel pan set' },
      { name: 'KitchenAid artisan mixer' },
      { name: 'Toaster oven' },
      { name: 'Coffee machine' },
      { name: 'Waffle maker' },
      { name: 'Instant Pot' },
      { name: 'Air fryer' },
      { name: 'Table linen' },
    ],
  },
  {
    title: 'Bath & Linens',
    items: [
      { name: 'Bath towels' },
      { name: 'Hand towels' },
      { name: 'Stone bath mat' },
      { name: 'Comforter (Gwen)' },
      { name: 'Cotton sheet set' },
      { name: 'Dish set' },
      { name: 'Utensil set' },
      { name: 'Knife set' },
      { name: 'Glasses set' },
    ],
  },
  {
    title: 'Household',
    items: [
      { name: 'Air purifier' },
      { name: 'Humidifier' },
      { name: 'Vacuum' },
      { name: 'Broom' },
      { name: 'Mop' },
    ],
  },
  {
    title: 'Maybe',
    note: 'Smaller extras — only if the spirit moves you.',
    items: [
      { name: 'Oil dispenser / sprayer', price: 16 },
      { name: 'Electric kettle' },
    ],
  },
]

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function Registry() {
  const { claims: initialClaims } = Route.useLoaderData()
  const [claims, setClaims] = useState<Record<string, string>>(() =>
    Object.fromEntries(initialClaims.map((c) => [c.item_key, c.initials])),
  )

  const onClaim = (itemKey: string, initials: string) =>
    setClaims((prev) => ({ ...prev, [itemKey]: initials }))
  const onUnclaim = (itemKey: string) =>
    setClaims((prev) => {
      const next = { ...prev }
      delete next[itemKey]
      return next
    })

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <SectionHeader eyebrow="If you'd like to gift" title="Registry" icon={Gift}>
        <p>
          Your presence is the only gift we need — truly. If you'd still like
          to send something, here's what we're building up as we start our home
          together. Claim an item with your initials so no two people pick the
          same thing.
        </p>
      </SectionHeader>

      <div className="mt-16 space-y-14">
        {REGISTRY.map((section) => (
          <div key={section.title}>
            <h2 className="font-script text-4xl text-burgundy text-center">
              {section.title}
            </h2>
            {section.note && (
              <p className="text-center text-sm text-ink/60 mt-2">
                {section.note}
              </p>
            )}
            <ul className="mt-6 space-y-2">
              {section.items.map((it) => {
                const key = `${slug(section.title)}--${slug(it.name)}`
                return (
                  <RegistryRow
                    key={key}
                    itemKey={key}
                    name={it.name}
                    price={it.price}
                    claimedBy={claims[key]}
                    onClaim={onClaim}
                    onUnclaim={onUnclaim}
                  />
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-16 text-center text-sm text-ink/60">
        Made a mistake? Click the initials on your claim to release it.
      </p>
    </section>
  )
}

function RegistryRow({
  itemKey,
  name,
  price,
  claimedBy,
  onClaim,
  onUnclaim,
}: {
  itemKey: string
  name: string
  price?: number
  claimedBy?: string
  onClaim: (key: string, initials: string) => void
  onUnclaim: (key: string) => void
}) {
  const [mode, setMode] = useState<'idle' | 'claiming' | 'releasing'>('idle')
  const [initials, setInitials] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const isClaimed = !!claimedBy

  async function submitClaim(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await claimItem({ data: { itemKey, initials } })
      onClaim(itemKey, res.initials)
      setMode('idle')
      setInitials('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not claim')
    } finally {
      setBusy(false)
    }
  }

  async function submitRelease(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await unclaimItem({ data: { itemKey, initials } })
      onUnclaim(itemKey)
      setMode('idle')
      setInitials('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not release')
    } finally {
      setBusy(false)
    }
  }

  return (
    <li
      className={`px-4 py-3 rounded-xl border transition-colors ${
        isClaimed
          ? 'bg-amber/20 border-amber/60'
          : 'bg-parchment border-amber hover:border-burgundy'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex-1 ${
            isClaimed ? 'line-through text-ink/50' : 'text-ink/85'
          }`}
        >
          {name}
        </span>
        {price && (
          <span className="text-ink/60 font-mono text-sm">${price}</span>
        )}

        {isClaimed ? (
          mode === 'releasing' ? null : (
            <button
              type="button"
              onClick={() => {
                setMode('releasing')
                setError(null)
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-widest rounded-full bg-burgundy text-cream hover:bg-pumpkin transition-colors"
              title="Release this claim with the same initials"
            >
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>Claimed · {claimedBy}</span>
            </button>
          )
        ) : mode === 'claiming' ? null : (
          <button
            type="button"
            onClick={() => {
              setMode('claiming')
              setError(null)
            }}
            className="px-3 py-1 text-xs uppercase tracking-widest rounded-full border border-burgundy text-burgundy hover:bg-burgundy hover:text-cream transition-colors"
          >
            Claim
          </button>
        )}
      </div>

      {mode === 'claiming' && (
        <form
          onSubmit={submitClaim}
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          <label className="text-xs uppercase tracking-widest text-ink/60">
            Your initials
          </label>
          <input
            value={initials}
            onChange={(e) =>
              setInitials(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6))
            }
            placeholder="e.g. AB"
            maxLength={6}
            required
            autoFocus
            className="w-24 bg-cream border border-amber focus:border-burgundy rounded-md outline-none px-2 py-1 text-ink font-mono"
          />
          <button
            type="submit"
            disabled={busy || !initials}
            className="px-3 py-1 text-xs uppercase tracking-widest rounded-full bg-burgundy text-cream hover:bg-pumpkin disabled:opacity-50 transition-colors"
          >
            {busy ? '…' : 'Confirm'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('idle')
              setInitials('')
              setError(null)
            }}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs uppercase tracking-widest text-ink/60 hover:text-burgundy"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Cancel</span>
          </button>
          {error && <p className="text-xs text-oxblood w-full">{error}</p>}
        </form>
      )}

      {mode === 'releasing' && (
        <form
          onSubmit={submitRelease}
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          <label className="text-xs uppercase tracking-widest text-ink/60">
            Confirm initials to release
          </label>
          <input
            value={initials}
            onChange={(e) =>
              setInitials(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6))
            }
            placeholder={claimedBy}
            maxLength={6}
            required
            autoFocus
            className="w-24 bg-cream border border-amber focus:border-burgundy rounded-md outline-none px-2 py-1 text-ink font-mono"
          />
          <button
            type="submit"
            disabled={busy || !initials}
            className="px-3 py-1 text-xs uppercase tracking-widest rounded-full bg-oxblood text-cream hover:bg-burgundy disabled:opacity-50 transition-colors"
          >
            {busy ? '…' : 'Release'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('idle')
              setInitials('')
              setError(null)
            }}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs uppercase tracking-widest text-ink/60 hover:text-burgundy"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Cancel</span>
          </button>
          {error && <p className="text-xs text-oxblood w-full">{error}</p>}
        </form>
      )}
    </li>
  )
}
