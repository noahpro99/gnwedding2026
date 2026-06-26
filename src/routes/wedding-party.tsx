import { createFileRoute } from "@tanstack/react-router";
import { User, Users } from "lucide-react";
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

const PARTY: Side[] = [
  {
    title: "The Couple",
    members: [
      {
        name: "Gwendolyn Swannell",
        role: "Bride",
        headshot: "/images/gwen.webp",
        together: "/images/gwen-2.webp",
        blurb:
          "Gwendolyn was born in Blacksburg and has lived here her whole life. She spends most of her time laughing, making art, and philosophising. After graduating with her degree in cognitive neuroscience in 2024 she pursued a career combining her two favorite things: art and science.",
      },
      {
        name: "Noah Provenzano",
        role: "Groom",
        headshot: "/images/noah.webp",
        together: "/images/noah-2.webp",
        blurb:
          "Noah moved to Blacksburg, VA in December 2011 and was homeschooled through middle and high school. He earned his Eagle Scout and double majored in Computer Science and Physics at Virginia Tech, graduating in 2024. Noah is now a PhD student studying LLM reasoning techniques at VT under Dr. Vu.",
      },
    ],
  },
  {
    title: "Bridesmaids",
    members: [
      {
        name: "Sophie Swannell",
        role: "Maid of Honor",
        headshot: "/images/sophie.webp",
        together: "/images/gwen-sophie.webp",
        blurb:
          "Sophie and Gwendolyn are sisters with a fat juicy 7 year age gap, but that hasn't stopped them from bonding over memes, music, and endless conversation.",
      },
      { name: "Delia Provenzano", role: "Bridesmaid", headshot: "/images/delia.webp", together: "/images/gwen-delia.webp" },
      { name: "Cora Chapman", role: "Bridesmaid" },
      {
        name: "Shirin Mohammedian",
        role: "Bridesmaid",
        blurb:
          "Gwendolyn met Shirin during a summer internship at a science lab while studying at Virginia Tech and they have been friends ever since. Shirin is currently pursuing a PhD in clinical psychology at Binghamton University.",
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
        blurb:
          "Seth is Noah's brother and longest friend. They grew up together in Blacksburg, homeschooled, danced, and both earned their Eagle Scout along the way. From childhood through every season since, they have been there for each other without question. Seth is currently studying business and cybersecurity at Virginia Tech and plans to become a pilot after graduation.",
      },
      {
        name: "Rituraj Sharma",
        role: "Groomsman",
        headshot: "/images/noah-rituraj.webp",
        together: "/images/noah-rituraj2.webp",
        blurb:
          "Noah and Rituraj met at a hackathon at VT and were in the same major. Since then they have participated in many hackathons and projects together, including uncovercardgame.com and InVenture Prize on PBS. They have been roommates and are currently working at the same research lab at VT under Dr. Vu. They play pickleball, poker, and hang out regularly.",
      },
      { name: "", role: "Groomsman", undisclosed: true },
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
      <div className="grid grid-cols-2 gap-px bg-amber/30 border-b border-amber/30">
        <div className="aspect-square overflow-hidden bg-parchment">
          {member.headshot ? (
            <img
              src={member.headshot}
              alt={member.undisclosed ? "Undisclosed" : member.name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-parchment">
              <User className="w-12 h-12 text-amber/50" strokeWidth={1} />
            </div>
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
            <div className="w-full h-full flex items-center justify-center bg-parchment">
              <Users className="w-12 h-12 text-amber/40" strokeWidth={1} />
            </div>
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
