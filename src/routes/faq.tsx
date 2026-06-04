import { Link, createFileRoute } from '@tanstack/react-router'
import { HelpCircle } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { SectionHeader } from '~/components/SectionHeader'

export const Route = createFileRoute('/faq')({
  component: Faq,
})

const linkCls =
  'text-burgundy hover:text-pumpkin underline decoration-amber/60 underline-offset-2 hover:decoration-pumpkin transition-colors'

const HOME2_URL = 'https://www.hilton.com/en/brands/home2-suites/'

// Stop click propagation on inline links so clicking a link inside an
// expanded answer doesn't also toggle the card closed.
const stop = (e: React.MouseEvent) => e.stopPropagation()

function FaqLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className={linkCls} onClick={stop}>
      {children}
    </Link>
  )
}

function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkCls}
      onClick={stop}
    >
      {children}
    </a>
  )
}

function ReachOut() {
  return (
    <a href="#contact" className={linkCls} onClick={stop}>
      reach out
    </a>
  )
}

const faqs: Array<{ q: string; a: ReactNode }> = [
  {
    q: 'When and where is the wedding?',
    a: (
      <>
        Sunday, October 25, 2026 at Beliveau Winery in Virginia. See the{' '}
        <FaqLink to="/itinerary">itinerary</FaqLink> for the full weekend
        schedule.
      </>
    ),
  },
  {
    q: 'What is the dress code?',
    a: (
      <>
        Formal. Fall colors if the mood strikes you. The ceremony is planned
        outdoors on grass, so plan your footwear accordingly.
      </>
    ),
  },
  {
    q: 'Where should I stay?',
    a: (
      <>
        Our room block is at{' '}
        <ExtLink href={HOME2_URL}>Home2 Suites by Hilton</ExtLink>. The suites
        have mini kitchens. See the <FaqLink to="/travel">Travel</FaqLink> page
        for details.
      </>
    ),
  },
  {
    q: 'Which airport should I fly into?',
    a: (
      <>
        Roanoke (ROA) is closest, at roughly 45 minutes. Greensboro (GSO) is
        about 2 hours and Charlotte (CLT) about 3 hours; both tend to have more
        flight options. See the <FaqLink to="/travel">Travel</FaqLink> page for
        details.
      </>
    ),
  },
  {
    q: 'Can I bring a plus one?',
    a: (
      <>
        Your invitation lists the names of everyone we have a spot for. If you
        have any questions, please <ReachOut />.
      </>
    ),
  },
  {
    q: 'Are kids welcome?',
    a: (
      <>
        Your invitation will let you know. If you have any questions, please{' '}
        <ReachOut />.
      </>
    ),
  },
  {
    q: 'Will there be parking and a shuttle?',
    a: (
      <>
        Free parking at the venue. If we run a shuttle between the hotel block
        and the venue, request a seat on the{' '}
        <FaqLink to="/travel">Travel</FaqLink> page.
      </>
    ),
  },
  {
    q: 'What if I have a dietary restriction?',
    a: (
      <>
        Note it on your <FaqLink to="/rsvp">RSVP</FaqLink> and we'll pass it
        along to the caterer.
      </>
    ),
  },
]

function Faq() {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set())

  function toggle(i: number) {
    setOpenSet((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeader eyebrow="Questions?" title="FAQ" icon={HelpCircle} />

      <div className="mt-16 space-y-3">
        {faqs.map((f, i) => {
          const open = openSet.has(i)
          return (
            <div
              key={i}
              onClick={() => toggle(i)}
              role="button"
              tabIndex={0}
              aria-expanded={open}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggle(i)
                }
              }}
              className="bg-parchment border border-amber rounded-2xl p-6 cursor-pointer select-none"
            >
              <div className="flex justify-between items-center gap-4">
                <span className="font-script text-2xl text-burgundy">{f.q}</span>
                <span
                  className={`text-gold text-2xl leading-none transition-transform duration-200 shrink-0 ${open ? 'rotate-45' : ''}`}
                  aria-hidden="true"
                >
                  +
                </span>
              </div>
              {open && (
                <div className="mt-4 text-ink/80 leading-relaxed">{f.a}</div>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-16 text-center text-lg text-ink/75">
        More questions?{' '}
        <a href="#contact" className={linkCls}>
          reach out.
        </a>
      </p>
    </section>
  )
}
