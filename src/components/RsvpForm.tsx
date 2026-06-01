import { Check, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { GUESTS, findGuest } from '~/server/guests'
import { submitRsvp } from '~/server/rsvp'

export function RsvpForm({
  inviteId,
  defaultGuestId,
}: {
  inviteId?: string
  defaultGuestId?: string
}) {
  const partiesIndex = useMemo(() => groupByParty(GUESTS), [])
  const [guestId, setGuestId] = useState<string>(defaultGuestId ?? '')
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const guest = guestId ? findGuest(guestId) : undefined
  const maxParty = guest?.maxParty ?? 1

  if (status === 'sent') {
    return (
      <div className="text-center bg-parchment border border-amber rounded-3xl p-10">
        <p className="font-script text-4xl text-burgundy">
          {attending === 'yes' ? 'We look forward to celebrating with you.' : 'Thank you. We will miss you.'}
        </p>
        <p className="mt-4 text-ink/70">
          Your RSVP was received. You can come back here to update it any time.
        </p>
      </div>
    )
  }

  return (
    <form
      className="bg-parchment border border-amber rounded-3xl p-8 space-y-5"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!guestId) {
          setError('Pick your name from the list.')
          return
        }
        if (!attending) {
          setError('Let us know if you can make it.')
          return
        }
        setStatus('submitting')
        setError(null)
        const fd = new FormData(e.currentTarget)
        try {
          await submitRsvp({
            data: {
              guestId,
              inviteId,
              primaryName: guest?.name ?? '',
              email: String(fd.get('email') ?? ''),
              attending: attending === 'yes',
              partySize: Number(fd.get('partySize') ?? 1),
              dietary: String(fd.get('dietary') ?? ''),
              notes: String(fd.get('notes') ?? ''),
              needsTransport: fd.get('needsTransport') === 'on',
            },
          })
          setStatus('sent')
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Something went wrong')
          setStatus('error')
        }
      }}
    >
      <label className="block">
        <span className="block uppercase tracking-widest text-xs text-ink/60 mb-1">
          Your name
        </span>
        <select
          required
          value={guestId}
          onChange={(e) => setGuestId(e.target.value)}
          className="w-full bg-cream border border-amber focus:border-burgundy rounded-lg outline-none px-3 py-2 text-ink"
        >
          <option value="">Select your name…</option>
          {partiesIndex.map(({ party, guests }) => (
            <optgroup key={party} label={party}>
              {guests.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                  {g.maxParty > 1 ? ` (party up to ${g.maxParty})` : ''}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <span className="block mt-1 text-xs text-ink/55">
          If your name is not listed, contact Gwen or Noah directly.
        </span>
      </label>

      <fieldset>
        <legend className="uppercase tracking-widest text-xs text-ink/60 mb-3">
          Will you join us?
        </legend>
        <div className="flex gap-3">
          <Choice value="yes" current={attending} onClick={setAttending}>
            <Check className="w-4 h-4" strokeWidth={2.5} />
            Joyfully accept
          </Choice>
          <Choice value="no" current={attending} onClick={setAttending}>
            <X className="w-4 h-4" strokeWidth={2.5} />
            Regretfully decline
          </Choice>
        </div>
      </fieldset>

      <Field label="Email" name="email" type="email" />

      {attending === 'yes' && (
        <>
          {maxParty > 1 ? (
            <Field
              label={`How many in your party? (up to ${maxParty})`}
              name="partySize"
              type="number"
              min={1}
              max={maxParty}
              defaultValue="1"
            />
          ) : (
            <input type="hidden" name="partySize" value={1} />
          )}
          <Field label="Dietary restrictions or allergies" name="dietary" />
          <TextArea label="Additional notes" name="notes" />
          <label className="flex items-center gap-3 text-sm text-ink/80">
            <input type="checkbox" name="needsTransport" className="accent-burgundy" />
            I would like shuttle transportation from the hotel
          </label>
        </>
      )}

      {error && <p className="text-sm text-oxblood">{error}</p>}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full px-6 py-3 bg-burgundy text-cream uppercase tracking-widest text-sm rounded-full hover:bg-pumpkin transition-colors disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Send RSVP'}
      </button>
    </form>
  )
}

function Choice({
  value,
  current,
  onClick,
  children,
}: {
  value: 'yes' | 'no'
  current: 'yes' | 'no' | null
  onClick: (v: 'yes' | 'no') => void
  children: React.ReactNode
}) {
  const active = current === value
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border uppercase tracking-widest text-xs rounded-full transition-colors ${
        active
          ? 'bg-burgundy text-cream border-burgundy'
          : 'bg-cream text-ink border-amber hover:border-burgundy'
      }`}
    >
      {children}
    </button>
  )
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props
  return (
    <label className="block">
      <span className="block uppercase tracking-widest text-xs text-ink/60 mb-1">
        {label}
      </span>
      <input
        {...rest}
        className="w-full bg-cream border border-amber focus:border-burgundy rounded-lg outline-none px-3 py-2 text-ink"
      />
    </label>
  )
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...rest } = props
  return (
    <label className="block">
      <span className="block uppercase tracking-widest text-xs text-ink/60 mb-1">{label}</span>
      <textarea
        {...rest}
        rows={3}
        className="w-full bg-cream border border-amber focus:border-burgundy rounded-lg outline-none px-3 py-2 text-ink"
      />
    </label>
  )
}

function groupByParty(
  guests: ReadonlyArray<(typeof GUESTS)[number]>,
): Array<{ party: string; guests: typeof guests }> {
  const map = new Map<string, typeof guests>()
  for (const g of guests) {
    const existing = (map.get(g.party) ?? []) as typeof guests
    map.set(g.party, [...existing, g] as typeof guests)
  }
  return Array.from(map.entries()).map(([party, guests]) => ({ party, guests }))
}
