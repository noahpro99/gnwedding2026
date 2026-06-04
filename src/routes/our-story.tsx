import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SectionHeader } from "~/components/SectionHeader";

export const Route = createFileRoute("/our-story")({
  component: OurStory,
});

const milestones = [
  {
    date: "Valentine's Day, 2020",
    title: "How we met",
    body: "Gwendolyn and Noah met for the first time in American Heritage Girls as Noah's sister Delia and Gwendolyn were in the same troop. They briefly met, but Gwendolyn was interested in Noah then. Years later, Noah came across one of Gwendolyn's drawings online and left a comment thinking it was incredible, but he didn't know it was her. Years later in 2020 they friended each other by chance online recommendation through mutuals. After a few long video chats Noah asked Gwendolyn to accompany him to swing dance on Valentines Day. They clicked immediately as both were drawn to conversations about human nature and technology. After a few more dates they became a couple. They have been together as they have grown since then.",
  },
  {
    date: "Summer 20XX",
    title: "First trip together",
    body: "A short anecdote about an early shared adventure.",
  },
  {
    date: "Winter 20XX",
    title: "The proposal",
    body: "Where it happened and how it unfolded.",
  },
];

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
  );
}
