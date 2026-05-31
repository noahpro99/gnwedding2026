import { createFileRoute } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import { RsvpForm } from '~/components/RsvpForm'
import { SectionHeader } from '~/components/SectionHeader'

export const Route = createFileRoute('/rsvp')({
  component: Rsvp,
})

function Rsvp() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <SectionHeader eyebrow="Please respond" title="RSVP" icon={Mail}>
        <p>
          Kindly respond by <strong>September 1, 2026</strong>.
        </p>
      </SectionHeader>

      <div className="mt-12">
        <RsvpForm />
      </div>
    </section>
  )
}
