import { Link, createFileRoute } from "@tanstack/react-router";
import { CardFrame } from "~/components/CardFrame";

export const Route = createFileRoute("/save-the-date")({
  head: () => ({
    links: [{ rel: "preload", as: "image", href: "/images/border.png" }],
  }),
  component: SaveTheDate,
});

function SaveTheDate() {
  return (
    <section className="bg-amber/30 py-16 min-h-[calc(100vh-12rem)]">
      <div className="mx-auto px-6">
        <CardFrame>
          <p className="uppercase tracking-[0.4em] text-xs text-gold">
            Save the Date
          </p>
          <h1 className="font-script text-5xl md:text-6xl text-burgundy mt-4">
            Gwendolyn &amp; Noah
          </h1>
          <p className="mt-6 text-ink/80">are getting married</p>
          <p className="mt-6 text-2xl md:text-3xl tracking-widest text-burgundy">
            10 · 25 · 2026
          </p>
          <p className="mt-2 text-sm uppercase tracking-widest text-ink/70">
            Beliveau Farm Winery · Virginia
          </p>
          <p className="mt-8 text-xs text-ink/60">
            Formal invitation to follow
          </p>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              to="/rsvp"
              className="px-6 py-2 bg-burgundy text-cream uppercase tracking-widest text-xs rounded-full hover:bg-pumpkin transition-colors"
            >
              RSVP
            </Link>
            <Link
              to="/travel"
              className="px-6 py-2 border border-burgundy text-burgundy uppercase tracking-widest text-xs rounded-full hover:bg-burgundy hover:text-cream transition-colors"
            >
              Details
            </Link>
          </div>
        </CardFrame>
      </div>
    </section>
  );
}
