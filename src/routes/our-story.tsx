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
    body: "Gwendolyn and Noah met for the first time in American Heritage Girls as Noah's sister Delia and Gwendolyn were in the same troop. They briefly met, but Gwendolyn was interested in Noah then. Years passed, and Noah came across one of Gwendolyn's drawings online and left a comment thinking it was incredible, but didn't know it was her. Years after that, in 2020, they friended each other by chance through mutual online recommendations. After a few long video chats Noah asked Gwendolyn on a date swing dancing on Valentine's Day. They clicked immediately as both were drawn to conversations about human nature and technology. After a few more dates they became a couple. They have stood by each other ever since.",
    image: "/images/us-early.webp",
    imageAlt: "Gwendolyn and Noah early in their relationship",
  },
  {
    date: "Christmas 2020",
    title: "First Christmas",
    body: "Their first Christmas together, just months into dating.",
    image: "/images/us-christmas.webp",
    imageAlt: "Gwendolyn and Noah at Christmas 2020",
  },
  {
    date: "Summer 2022",
    title: "First big trip together",
    body: "Noah and Gwendolyn's first trip together: Broadway, museums, and a lot of good food.",
    image: "/images/new-york.webp",
    imageAlt: "Gwendolyn and Noah in New York City",
  },
  {
    date: "May 18th, 2026",
    title: "The proposal",
    body: "Early on in the relationship, Noah and Gwendolyn went on a sunrise hike at Dragon's Tooth in the Blue Ridge Mountains. The hike was right during when covid was starting and Gwendolyn was feeling anxious finishing high school. That hike was an escape for both of them at the time becoming one of their special places. On May 18th they went back to the same spot and Noah proposed to Gwendolyn at sunrise. The best man Elijah was there to capture the moment hidden with a camera. Gwendolyn said yes and they celebrated with a long nap afterwards.",
    image: "/images/proposal.webp",
    imageAlt: "The proposal at Dragon's Tooth",
  },
];

function OurStory() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader eyebrow="The Beginning" title="Our Story" icon={Heart} />

      <div className="mt-20 space-y-24">
        {milestones.map((m, i) => (
          <article
            key={m.title}
            className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
          >
            <div className={i % 2 === 1 ? "md:order-last" : ""}>
              <img
                src={m.image}
                alt={m.imageAlt}
                className="w-full rounded-2xl shadow-card object-cover aspect-[4/5]"
              />
            </div>
            <div>
              <p className="uppercase tracking-[0.25em] text-xs text-gold mb-3">
                {m.date}
              </p>
              <h3 className="font-script text-4xl text-burgundy mb-4">
                {m.title}
              </h3>
              <p className="text-ink/80 leading-relaxed">{m.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
