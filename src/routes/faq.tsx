import { createFileRoute } from '@tanstack/react-router'
import { HelpCircle } from 'lucide-react'
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
    a: 'Roanoke (ROA) is closest at roughly 45 minutes. Greensboro (GSO) is around 2 hours and Charlotte (CLT) around 3 hours — those two usually have better flight options.',
  },
  {
    q: 'Can I bring a plus one?',
    a: 'Your invitation lists the names of everyone we have a spot for. If you have a question, just reach out.',
  },
  {
    q: 'Are kids welcome?',
    a: 'We love your kids — but we have chosen to keep our wedding an adults-only event with the exception of immediate family.',
  },
  {
    q: 'Will there be parking and a shuttle?',
    a: 'Free parking at the venue. If we run a shuttle between the hotel blocks and the venue, request a seat on the Travel page.',
  },
  {
    q: 'I have a dietary restriction — what do I do?',
    a: 'Note it on your RSVP and we will pass it along to the caterer.',
  },
]

function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeader eyebrow="Questions?" title="FAQ" icon={HelpCircle} />

      <div className="mt-16 space-y-3">
        {faqs.map((f, i) => (
          <details
            key={i}
            className="bg-parchment border border-amber rounded-2xl p-6 group"
          >
            <summary className="cursor-pointer font-script text-2xl text-burgundy flex justify-between items-center list-none">
              {f.q}
              <span className="text-gold transition-transform group-open:rotate-45 text-2xl leading-none">
                +
              </span>
            </summary>
            <p className="mt-4 text-ink/80 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
