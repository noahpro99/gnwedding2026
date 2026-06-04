import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { SectionHeader } from "~/components/SectionHeader";

export const Route = createFileRoute("/wedding-party")({
  component: WeddingParty,
});

type Member = {
  name: string;
  role: string;
  headshot?: string;
  together?: string;
  blurb?: string;
  undisclosed?: boolean;
};
type Side = { title: string; members: Member[] };

const LEAF = "/images/leaf.png";

const PARTY: Side[] = [
  {
    title: "Bridesmaids",
    members: [
      {
        name: "",
        role: "Maid of Honor",
        undisclosed: true,
        headshot: LEAF,
        together: LEAF,
      },
      {
        name: "",
        role: "Bridesmaid",
        undisclosed: true,
        headshot: LEAF,
        together: LEAF,
      },
      {
        name: "",
        role: "Bridesmaid",
        undisclosed: true,
        headshot: LEAF,
        together: LEAF,
      },
      {
        name: "",
        role: "Bridesmaid",
        undisclosed: true,
        headshot: LEAF,
        together: LEAF,
      },
    ],
  },
  {
    title: "Groomsmen",
    members: [
      {
        name: "Elijah Colliver",
        role: "Best Man",
        headshot: "/images/eliajh.webp",
        together: "/images/noah-elijah.webp",
        blurb:
          "Noah and Elijah met in Cub Scouts when Noah's family moved to Blacksburg. Their families clicked right away. They bonded over Magic: The Gathering and more Boy Scout trips than either can count. They both left their pack to join the same Boy Scout troop, where they pushed each other all the way to Eagle Scout. Elijah helped with the proposal and is now in Alaska for graduate school, studying kelp.",
      },
      {
        name: "Seth Provenzano",
        role: "Groomsman",
        headshot: "/images/seth.webp",
        together: "/images/seth-noah.webp",
      },
      {
        name: "",
        role: "Groomsman",
        undisclosed: true,
        headshot: LEAF,
        together: LEAF,
      },
      {
        name: "",
        role: "Groomsman",
        undisclosed: true,
        headshot: LEAF,
        together: LEAF,
      },
    ],
  },
];

function WeddingParty() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <SectionHeader
        eyebrow="Standing With Us"
        title="Wedding Party"
        icon={Users}
      />

      {PARTY.map((side) => (
        <div key={side.title} className="mt-16">
          <p className="text-center text-[11px] uppercase tracking-[0.35em] text-gold mb-8">
            {side.title}
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {side.members.map((m, i) => (
              <MemberCard key={m.name || i} member={m} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="rounded-3xl bg-parchment shadow-card overflow-hidden">
      {/* Both photos side by side, full width — card's overflow-hidden clips all corners */}
      <div className="grid grid-cols-2 gap-px bg-amber/30">
        <div className="aspect-square overflow-hidden bg-parchment">
          {member.headshot ? (
            <img
              src={member.headshot}
              alt={member.undisclosed ? "Undisclosed" : member.name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-amber/35 via-amber/15 to-parchment" />
          )}
        </div>
        <div className="aspect-square overflow-hidden bg-parchment">
          {member.together ? (
            <img
              src={member.together}
              alt={`${member.name} with Noah`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-amber/20 to-parchment" />
          )}
        </div>
      </div>

      {/* Name + role */}
      <div className="px-6 pt-5 pb-4 text-center">
        <h3 className="font-script text-3xl text-burgundy leading-tight">
          {member.undisclosed ? "To be announced" : member.name}
        </h3>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold mt-1">
          {member.role}
        </p>
      </div>

      {member.blurb && (
        <div className="px-6 pb-6 border-t border-amber/40 pt-4">
          <p className="text-sm text-ink/70 leading-relaxed">{member.blurb}</p>
        </div>
      )}
    </div>
  );
}
