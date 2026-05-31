import { createFileRoute } from '@tanstack/react-router'
import { CalendarDays } from 'lucide-react'
import { SectionHeader } from '~/components/SectionHeader'

export const Route = createFileRoute('/itinerary')({
  component: Itinerary,
})

const CALENDAR_EMBED_SRC =
  'https://calendar.google.com/calendar/embed?src=8c9da5b0ab48578ed31aaa66f7584b368339ac73e165e58c9d1f7c01fe05c26c%40group.calendar.google.com&ctz=America%2FNew_York&mode=WEEK&dates=20261020/20261027'

function Itinerary() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader eyebrow="Weekend Plan" title="Itinerary" icon={CalendarDays}>
        <p>
          The full schedule lives below. Click any event for the time, location,
          and any dress notes.
        </p>
      </SectionHeader>

      <div className="mt-12 bg-parchment border border-amber rounded-3xl p-2 overflow-hidden shadow-lg shadow-walnut/10">
        <iframe
          title="Wedding itinerary"
          src={CALENDAR_EMBED_SRC}
          className="w-full h-[800px] border-0 rounded-2xl"
        />
      </div>
    </section>
  )
}
