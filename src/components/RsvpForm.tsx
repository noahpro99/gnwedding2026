import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { submitRsvp } from '~/server/rsvp'

export function RsvpForm({
  inviteId,
}: {
  inviteId?: string
  defaultGuestId?: string
}) {
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

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
        const fd = new FormData(e.currentTarget)
        const primaryName = String(fd.get('primaryName') ?? '').trim()
        if (!primaryName) {
          setError('Please enter your name.')
          return
        }
        if (!attending) {
          setError('Let us know if you can make it.')
          return
        }
        setStatus('submitting')
        setError(null)
        const others = String(fd.get('guestNames') ?? '').trim()
        const allNames = [primaryName, ...others.split('\n').map((n) => n.trim()).filter(Boolean)]
        try {
          await submitRsvp({
            data: {
              inviteId,
              primaryName,
              guestNames: allNames,
              email: String(fd.get('email') ?? ''),
              attending: attending === 'yes',
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
      <Field label="Your name" name="primaryName" type="text" placeholder="First and last name" required />

      <label className="block">
        <span className="block uppercase tracking-widest text-xs text-ink/60 mb-1">
          Others in your party
        </span>
        <textarea
          name="guestNames"
          rows={3}
          placeholder="One name per line"
          className="w-full bg-cream border border-amber focus:border-burgundy rounded-lg outline-none px-3 py-2 text-ink"
        />
        <span className="block mt-1 text-xs text-ink/50">Leave blank if you are attending alone.</span>
      </label>

      <fieldset>
        <legend className="uppercase tracking-widest text-xs text-ink/60 mb-3">
          Will you join us?
        </legend>
        <div className="flex gap-3">
          <Choice value="yes" current={attending} onClick={setAttending}>
            <Check className="w-4 h-4" strokeWidth={2.5} />
            Accept
          </Choice>
          <Choice value="no" current={attending} onClick={setAttending}>
            <X className="w-4 h-4" strokeWidth={2.5} />
            Decline
          </Choice>
        </div>
      </fieldset>

      <Field label="Email" name="email" type="email" />

      {attending === 'yes' && (
        <>
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
