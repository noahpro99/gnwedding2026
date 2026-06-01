import { createFileRoute } from '@tanstack/react-router'
import { HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { SectionHeader } from '~/components/SectionHeader'

export const Route = createFileRoute('/faq')({
  component: Faq,
})

const faqs = [
  {
    q: 'When and where is the wedding?',
    a: 'Sunday, October 25, 2026 at Beliveau Winery in Virginia. Itinerary on its own page.',
  },
  {
    q: 'What is the dress code?',
    a: 'Cocktail / semi-formal in fall colors if the mood strikes you. The ceremony may be outdoors on grass, so plan footwear accordingly.',
  },
  {
    q: 'Where should I stay?',
    a: 'We have room blocks at Courtyard by Marriott and Home2 Suites by Hilton. The Home2 suites have mini kitchens. Details on the Travel page.',
  },
  {
    q: 'Which airport should I fly into?',
    a: 'Roanoke (ROA) is closest, at roughly 45 minutes. Greensboro (GSO) is about 2 hours and Charlotte (CLT) about 3 hours; both tend to have more flight options.',
  },
  {
    q: 'Can I bring a plus one?',
    a: 'Your invitation lists the names of everyone we have a spot for. If you have a question, just reach out.',
  },
  {
    q: 'Are kids welcome?',
    a: 'The wedding is adults-only, with the exception of immediate family.',
  },
  {
    q: 'Will there be parking and a shuttle?',
    a: 'Free parking at the venue. If we run a shuttle between the hotel blocks and the venue, request a seat on the Travel page.',
  },
  {
    q: 'What if I have a dietary restriction?',
    a: 'Note it on your RSVP and we will pass it along to the caterer.',
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
              className="bg-parchment border border-amber rounded-2xl p-6 cursor-pointer select-none"
            >
              <div className="flex justify-between items-center">
                <span className="font-script text-2xl text-burgundy">{f.q}</span>
                <span className={`text-gold text-2xl leading-none transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
                  +
                </span>
              </div>
              {open && (
                <p className="mt-4 text-ink/80 leading-relaxed">{f.a}</p>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-12 text-center text-sm text-ink/60">
        More questions?{' '}
        <a href="/#contact" className="text-burgundy hover:text-pumpkin underline underline-offset-2 transition-colors">
          reach out.
        </a>
      </p>
    </section>
  )
}
