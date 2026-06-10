import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SectionHeader } from "~/components/SectionHeader";

export const Route = createFileRoute("/our-story")({
  component: OurStory,
});

const [howWeMet, proposal] = [
  {
    date: "Valentine's Day, 2020",
    title: "How we met",
    body: "Gwendolyn and Noah met for the first time in American Heritage Girls as Noah's sister Delia and Gwendolyn were in the same troop. They briefly met, but Gwendolyn was interested in Noah then. Years passed, and Noah came across one of Gwendolyn's drawings online and left a comment thinking it was incredible, but didn't know it was her. Years after that, in 2020, they friended each other by chance through mutual online recommendations. After a few long video chats Noah asked Gwendolyn on a date swing dancing on Valentine's Day. They clicked immediately as both were drawn to conversations about human nature and technology. After a few more dates they became a couple. They have stood by each other ever since.",
    image: "/images/us-early.webp",
    imageAlt: "Gwendolyn and Noah early in their relationship",
  },
  {
    date: "May 18th, 2026",
    title: "The proposal",
    body: "Early on in the relationship, Noah and Gwendolyn went on a sunrise hike at Dragon's Tooth in the Blue Ridge Mountains. The hike was right during when covid was starting and Gwendolyn was feeling anxious finishing high school. That hike was an escape for both of them at the time becoming one of their special places. On May 18th they went back to the same spot and Noah proposed to Gwendolyn at sunrise. The best man Elijah was there to capture the moment hidden with a camera. Gwendolyn said yes and they celebrated with a long nap afterwards.",
    image: "/images/proposal.webp",
    imageAlt: "The proposal at Dragon's Tooth",
  },
];

const photos = [
  { src: "/images/us-christmas.webp", alt: "Gwendolyn and Noah at Christmas", caption: "Christmas 2020" },
  { src: "/images/new-york.webp", alt: "Gwendolyn and Noah in New York City", caption: "New York 2022" },
];

function OurStory() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader eyebrow="The Beginning" title="Our Story" icon={Heart} />

      <div className="mt-20 space-y-24">
        <article className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <img
              src={howWeMet!.image}
              alt={howWeMet!.imageAlt}
              className="w-full rounded-2xl shadow-card object-cover aspect-[4/5]"
            />
          </div>
          <div>
            <p className="uppercase tracking-[0.25em] text-xs text-gold mb-3">{howWeMet!.date}</p>
            <h3 className="font-script text-4xl text-burgundy mb-4">{howWeMet!.title}</h3>
            <p className="text-ink/80 leading-relaxed">{howWeMet!.body}</p>
          </div>
        </article>

        <div className="grid grid-cols-2 gap-4 md:gap-8">
          {photos.map((p) => (
            <figure key={p.caption}>
              <img
                src={p.src}
                alt={p.alt}
                className="w-full rounded-2xl shadow-card object-cover aspect-[4/5]"
              />
              <figcaption className="mt-3 text-center uppercase tracking-[0.25em] text-xs text-gold">
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <article className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="md:order-last">
            <img
              src={proposal!.image}
              alt={proposal!.imageAlt}
              className="w-full rounded-2xl shadow-card object-cover aspect-[4/5]"
            />
          </div>
          <div>
            <p className="uppercase tracking-[0.25em] text-xs text-gold mb-3">{proposal!.date}</p>
            <h3 className="font-script text-4xl text-burgundy mb-4">{proposal!.title}</h3>
            <p className="text-ink/80 leading-relaxed">{proposal!.body}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
