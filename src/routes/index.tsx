import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  ChevronDown,
  Gift,
  Heart,
  HelpCircle,
  Mail,
  MapPin,
  Plane,
  Users,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { LeafDivider } from "~/components/LeafDivider";
import { PhotoAlbumButton } from "~/components/PhotoAlbumButton";

export const Route = createFileRoute("/")({
  component: Home,
});

const WEDDING_DATE = "October 25, 2026";
const VENUE = "Beliveau Winery";
const VENUE_LOCATION = "Virginia";

function Home() {
  return (
    <>
      <section className="hero-section relative h-screen min-h-160 w-full overflow-hidden">
        <img
          src="/images/hug-edited.jpg"
          alt="Gwendolyn and Noah"
          className="absolute left-0 right-0 bottom-0 w-full object-cover"
          style={{ top: "-10%", height: "110%" }}
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6 text-cream">
          <p className="uppercase tracking-[0.4em] text-sm md:text-base">
            We're getting married
          </p>
          <h1 className="font-script text-7xl md:text-9xl leading-none mt-4 drop-shadow-lg">
            Gwendolyn &amp; Noah
          </h1>

          <div className="mt-8 flex flex-col items-center gap-3 text-lg md:text-xl tracking-widest">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" strokeWidth={1.5} />
              <span>{WEDDING_DATE}</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 text-sm md:text-base text-cream/90 uppercase tracking-[0.3em]">
              <div className="flex items-center gap-2">
                <Wine className="w-4 h-4" strokeWidth={1.5} />
                <span>{VENUE}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" strokeWidth={1.5} />
                <span>{VENUE_LOCATION}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              to="/rsvp"
              className="inline-flex items-center gap-2 px-8 py-3 bg-burgundy text-cream uppercase tracking-widest text-sm rounded-full hover:bg-pumpkin transition-colors"
            >
              <Mail className="w-4 h-4" strokeWidth={2} />
              <span>RSVP</span>
            </Link>
            <Link
              to="/travel"
              className="inline-flex items-center gap-2 px-8 py-3 border border-cream uppercase tracking-widest text-sm rounded-full hover:bg-cream/10 transition-colors"
            >
              <Plane className="w-4 h-4" strokeWidth={2} />
              <span>Travel</span>
            </Link>
          </div>
        </div>
        <ChevronDown
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-7 h-7 text-cream animate-bounce"
          strokeWidth={1.5}
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <p className="uppercase tracking-[0.3em] text-xs text-gold mb-4">
            Welcome
          </p>
          <h2 className="font-script text-5xl text-burgundy mb-4">
            Glad you are here
          </h2>
          <div className="mb-8">
            <LeafDivider />
          </div>
          <p className="text-ink/80 leading-relaxed text-lg max-w-2xl mx-auto">
            We are getting married on Sunday, October 25 at Beliveau Winery in
            Virginia. This site has everything you need: our story, hotel and
            travel details, the weekend schedule, and the RSVP form.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div
            className="rounded-2xl overflow-hidden border-4 border-amber/70 shadow-card ring-1 ring-amber/20"
            style={{ aspectRatio: "15 / 16" }}
          >
            <img
              src="/images/us.webp"
              alt="Gwendolyn and Noah"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <QuickLink
              to="/our-story"
              icon={Heart}
              title="Our Story"
              body="How we got here."
            />
            <QuickLink
              to="/travel"
              icon={Plane}
              title="Travel"
              body="Hotels, airports, shuttles."
            />
            <QuickLink
              to="/itinerary"
              icon={Calendar}
              title="Itinerary"
              body="The weekend schedule."
            />
            <QuickLink
              to="/wedding-party"
              icon={Users}
              title="Wedding Party"
              body="The people standing with us."
            />
            <QuickLink
              to="/registry"
              icon={Gift}
              title="Registry"
              body="Gift ideas, if you wish."
            />
            <QuickLink
              to="/faq"
              icon={HelpCircle}
              title="FAQ"
              body="Common questions answered."
            />
          </div>
        </div>
      </section>

      <section className="photo-album-section bg-amber/30 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="uppercase tracking-[0.3em] text-xs text-gold mb-4">
            Share the day
          </p>
          <h2 className="font-script text-5xl text-burgundy mb-4">
            Group Photo Album
          </h2>
          <div className="mb-8">
            <LeafDivider />
          </div>
          <p className="text-ink/80 leading-relaxed mb-8">
            Add your photos from the weekend to the shared album.
          </p>
          <PhotoAlbumButton />
        </div>
      </section>
    </>
  );
}

function QuickLink({
  to,
  icon: Icon,
  title,
  body,
}: {
  to: string;
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <Link
      to={to}
      className="group block p-8 bg-parchment border border-amber rounded-2xl hover:border-burgundy transition-colors text-center shadow-card"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-cream border border-amber group-hover:border-burgundy group-hover:bg-burgundy transition-colors">
        <Icon
          className="w-6 h-6 text-burgundy group-hover:text-cream transition-colors"
          strokeWidth={1.5}
        />
      </div>
      <h3 className="font-script text-3xl text-burgundy mb-2 group-hover:text-pumpkin transition-colors">
        {title}
      </h3>
      <p className="text-ink/70 text-sm">{body}</p>
    </Link>
  );
}
