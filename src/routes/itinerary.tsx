import { createFileRoute } from '@tanstack/react-router'
import { siApple, siGooglecalendar } from 'simple-icons'

export const Route = createFileRoute('/itinerary')({
  component: Itinerary,
})

const CALENDAR_EMBED_SRC =
  'https://calendar.google.com/calendar/embed?src=8c9da5b0ab48578ed31aaa66f7584b368339ac73e165e58c9d1f7c01fe05c26c%40group.calendar.google.com&ctz=America%2FNew_York&mode=AGENDA&dates=20261020/20261027'

const GOOGLE_CAL_URL =
  'https://calendar.google.com/calendar/u/0?cid=OGM5ZGE1YjBhYjQ4NTc4ZWQzMWFhYTY2Zjc1ODRiMzY4MzM5YWM3M2UxNjVlNThjOWQxZjdjMDFmZTA1YzI2Y0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'

const APPLE_CAL_URL =
  'https://calendar.google.com/calendar/ical/8c9da5b0ab48578ed31aaa66f7584b368339ac73e165e58c9d1f7c01fe05c26c%40group.calendar.google.com/public/basic.ics'

function SiButton({
  href,
  icon,
  label,
}: {
  href: string
  icon: { path: string }
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 px-8 py-3 bg-burgundy text-cream uppercase tracking-widest text-sm rounded-full hover:bg-pumpkin transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d={icon.path} />
      </svg>
      {label}
    </a>
  )
}

function Itinerary() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <SiButton href={GOOGLE_CAL_URL} icon={siGooglecalendar} label="Add to Google Calendar" />
        <SiButton href={APPLE_CAL_URL} icon={siApple} label="Add to Apple Calendar" />
      </div>

      <p className="text-center text-xs text-ink/50 uppercase tracking-widest mb-4">
        Updates here reflect automatically if the schedule changes.
      </p>

      <div className="bg-parchment border border-amber rounded-3xl p-2 overflow-hidden">
        <iframe
          title="Wedding itinerary"
          src={CALENDAR_EMBED_SRC}
          className="w-full h-[800px] border-0 rounded-2xl"
        />
      </div>
    </section>
  )
}
