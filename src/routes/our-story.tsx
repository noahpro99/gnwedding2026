import { createFileRoute } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { SectionHeader } from '~/components/SectionHeader'

export const Route = createFileRoute('/our-story')({
  component: OurStory,
})

const milestones = [
  {
    date: 'Spring 20XX',
    title: 'How we met',
    body: 'Replace this with the story of how the two of you crossed paths.',
  },
  {
    date: 'Summer 20XX',
    title: 'First trip together',
    body: 'A short anecdote about an early shared adventure.',
  },
  {
    date: 'Winter 20XX',
    title: 'The proposal',
    body: 'Where it happened and how it unfolded.',
  },
]

function OurStory() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeader eyebrow="The Beginning" title="Our Story" icon={Heart} />

      <div className="mt-16 space-y-12">
        {milestones.map((m) => (
          <article key={m.title} className="border-l-2 border-gold pl-8">
            <p className="uppercase tracking-[0.25em] text-xs text-gold mb-2">
              {m.date}
            </p>
            <h3 className="font-script text-3xl text-burgundy mb-3">
              {m.title}
            </h3>
            <p className="text-ink/80 leading-relaxed">{m.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
