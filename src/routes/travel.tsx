import { createFileRoute } from '@tanstack/react-router'
import { BedDouble, Bus, MapPin, Plane } from 'lucide-react'
import { useState } from 'react'
import { SectionHeader } from '~/components/SectionHeader'
import { requestTransport } from '~/server/rsvp'

export const Route = createFileRoute('/travel')({
  component: Travel,
})

const HOTELS = [
  {
    name: 'Courtyard by Marriott',
    address: 'Roanoke, VA',
    blockCode: 'TBD',
    bookingUrl: 'https://www.marriott.com/',
    notes: 'Room block held for the nights of Saturday Oct 24 and Sunday Oct 25.',
    nights: 'Block: night of 10/24 + night of 10/25',
    pricePerNight: null,
  },
  {
    name: 'Home2 Suites by Hilton',
    address: 'Roanoke area, VA',
    blockCode: 'TBD',
    bookingUrl: 'https://www.hilton.com/en/brands/home2-suites/',
    notes:
      'Suites with mini kitchens (plates, pots, pans). A good option if you plan to pick up groceries at the nearby Kroger. Block details coming soon.',
    nights: 'Block: night of 10/24 + night of 10/25',
    pricePerNight: 115,
  },
]

const AIRPORTS = [
  {
    code: 'ROA',
    name: 'Roanoke–Blacksburg Regional',
    driveTime: '~45 min',
    note: 'Closest airport to the venue. Smallest of the three.',
  },
  {
    code: 'GSO',
    name: 'Piedmont Triad (Greensboro)',
    driveTime: '~2 hr drive',
    note: 'Mid-size option to the east.',
  },
  {
    code: 'CLT',
    name: 'Charlotte Douglas',
    driveTime: '~3 hr drive',
    note: 'Largest of the three; best selection of flights when ROA is limited.',
  },
]

function Travel() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <SectionHeader eyebrow="Getting There" title="Travel" icon={Plane}>
        <p>
          The wedding is on <strong>Sunday, October 25, 2026</strong> at
          Beliveau Winery in Virginia, with the ceremony at <strong>3:00 PM</strong>.
          We've blocked the hotels below for the nights of{' '}
          <strong>October 24</strong> and <strong>October 25</strong> so you can
          arrive early and stay over.
        </p>
      </SectionHeader>

      <h2 className="mt-20 mb-2 font-script text-4xl text-burgundy text-center flex items-center justify-center gap-3">
        <BedDouble className="w-7 h-7" strokeWidth={1.5} />
        <span>Hotels</span>
      </h2>
      <p className="text-center text-ink/70 mb-8 max-w-xl mx-auto">
        Both options have rooms held for the nights of Oct 24 and Oct 25.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {HOTELS.map((h) => (
          <div
            key={h.name}
            className="p-8 bg-parchment border border-amber rounded-2xl"
          >
            <h3 className="font-script text-3xl text-burgundy">{h.name}</h3>
            <p className="text-sm text-ink/70 mt-1 inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />
              {h.address}
            </p>
            <p className="mt-4 text-ink/80">{h.notes}</p>
            <p className="mt-4 text-sm">
              <span className="text-ink/60">{h.nights}</span>
              {h.pricePerNight && (
                <>
                  <span className="text-ink/60"> · </span>
                  <span className="text-ink/80">${h.pricePerNight}/night</span>
                </>
              )}
            </p>
            <p className="mt-2 text-sm">
              <span className="text-ink/60">Block code: </span>
              <span className="font-mono">{h.blockCode}</span>
            </p>
            <a
              href={h.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 px-6 py-2 bg-burgundy text-cream uppercase tracking-widest text-xs rounded-full hover:bg-pumpkin transition-colors"
            >
              Book
            </a>
          </div>
        ))}
      </div>

      <h2 className="mt-20 mb-2 font-script text-4xl text-burgundy text-center flex items-center justify-center gap-3">
        <Plane className="w-7 h-7" strokeWidth={1.5} />
        <span>Airports</span>
      </h2>
      <p className="text-center text-ink/70 mb-8 max-w-xl mx-auto">
        Three options, depending on your departure city.
      </p>

      <div className="grid sm:grid-cols-3 gap-4">
        {AIRPORTS.map((a) => (
          <div
            key={a.code}
            className="p-6 bg-parchment border border-amber rounded-2xl text-center"
          >
            <p className="font-mono text-2xl text-burgundy">{a.code}</p>
            <p className="font-script text-2xl text-burgundy mt-1">{a.name}</p>
            <p className="text-xs uppercase tracking-widest text-gold mt-2">
              {a.driveTime}
            </p>
            <p className="text-sm text-ink/70 mt-3">{a.note}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-20 mb-2 font-script text-4xl text-burgundy text-center flex items-center justify-center gap-3">
        <Bus className="w-7 h-7" strokeWidth={1.5} />
        <span>Transportation</span>
      </h2>
      <p className="text-center text-ink/70 mb-10 max-w-xl mx-auto">
        If we arrange shuttle service between the hotel blocks and the venue,
        use this form to request a seat.
      </p>
      <TransportForm />
    </section>
  )
}

function TransportForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  return (
    <form
      className="max-w-xl mx-auto bg-parchment border border-amber rounded-3xl p-8 space-y-4"
      onSubmit={async (e) => {
        e.preventDefault()
        setStatus('submitting')
        setError(null)
        const fd = new FormData(e.currentTarget)
        try {
          await requestTransport({
            data: {
              name: String(fd.get('name') ?? ''),
              email: String(fd.get('email') ?? ''),
              hotel: String(fd.get('hotel') ?? ''),
              partySize: Number(fd.get('partySize') ?? 1),
              notes: String(fd.get('notes') ?? ''),
            },
          })
          setStatus('sent')
          ;(e.target as HTMLFormElement).reset()
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Something went wrong')
          setStatus('error')
        }
      }}
    >
      {status === 'sent' ? (
        <p className="text-center text-burgundy font-script text-2xl py-8">
          Thank you. We will reserve your seat.
        </p>
      ) : (
        <>
          <Field label="Name" name="name" required />
          <Field label="Email" name="email" type="email" />
          <SelectField label="Which hotel?" name="hotel" required options={HOTELS.map((h) => h.name)} />
          <Field label="How many seats?" name="partySize" type="number" defaultValue="1" min={1} max={10} />
          <TextArea label="Anything else?" name="notes" />

          {error && <p className="text-sm text-oxblood">{error}</p>}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full px-6 py-3 bg-burgundy text-cream uppercase tracking-widest text-sm rounded-full hover:bg-pumpkin transition-colors disabled:opacity-50"
          >
            {status === 'submitting' ? 'Sending…' : 'Request Transport'}
          </button>
        </>
      )}
    </form>
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

function SelectField({
  label,
  options,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="block uppercase tracking-widest text-xs text-ink/60 mb-1">{label}</span>
      <select
        {...rest}
        className="w-full bg-cream border border-amber focus:border-burgundy rounded-lg outline-none px-3 py-2 text-ink"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
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
