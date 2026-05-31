import { createFileRoute } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { SectionHeader } from '~/components/SectionHeader'

export const Route = createFileRoute('/wedding-party')({
  component: WeddingParty,
})

type Member = { name: string; role: string; blurb?: string }
type Side = { title: string; members: Member[] }

const PARTY: Side[] = [
  {
    title: "Gwendolyn's Side",
    members: [
      { name: 'Sophie Swannell', role: 'Maid of Honor' },
      { name: 'Cora Chapman', role: 'Bridesmaid' },
      { name: 'Delia Provenzano', role: 'Bridesmaid' },
      { name: 'Shirin Mohammedian', role: 'Bridesmaid' },
    ],
  },
  {
    title: "Noah's Side",
    members: [
      { name: 'Elijah Colliver', role: 'Best Man' },
      { name: 'Seth Provenzano', role: 'Groomsman' },
      { name: 'Aanish Pradhan', role: 'Groomsman' },
      { name: 'Rituraj Sharma', role: 'Groomsman' },
    ],
  },
]

const OFFICIANT: Member = { name: 'Dan Provenzano', role: 'Officiant' }
const MC: Member = { name: 'Will Smith', role: 'MC' }

function WeddingParty() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader
        eyebrow="Standing With Us"
        title="Wedding Party"
        icon={Users}
      />

      <div className="mt-16 grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <MemberCard member={OFFICIANT} highlight />
        <MemberCard member={MC} highlight />
      </div>

      {PARTY.map((side) => (
        <div key={side.title} className="mt-16">
          <h2 className="font-script text-3xl text-burgundy text-center mb-8">
            {side.title}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {side.members.map((m) => (
              <MemberCard key={m.name} member={m} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function MemberCard({
  member,
  highlight = false,
}: {
  member: Member
  highlight?: boolean
}) {
  return (
    <div
      className={`text-center p-6 rounded-2xl border ${
        highlight
          ? 'bg-amber/30 border-burgundy'
          : 'bg-parchment border-amber'
      }`}
    >
      <div className="w-24 h-24 mx-auto rounded-full bg-amber/60 mb-4" />
      <h3 className="font-script text-2xl text-burgundy">{member.name}</h3>
      <p className="text-xs uppercase tracking-widest text-gold mt-1">
        {member.role}
      </p>
      {member.blurb && (
        <p className="text-sm text-ink/70 mt-3">{member.blurb}</p>
      )}
    </div>
  )
}
