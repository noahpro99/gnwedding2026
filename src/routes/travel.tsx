import { createFileRoute } from "@tanstack/react-router";
import { BedDouble, Bus, ExternalLink, MapPin, Plane, Wine } from "lucide-react";
import { useState } from "react";
import { SectionHeader } from "~/components/SectionHeader";
import { requestTransport } from "~/server/rsvp";

export const Route = createFileRoute("/travel")({
  component: Travel,
});

const HOTEL = {
  name: "Home2 Suites by Hilton",
  address: "1321 Rugby Ln, Blacksburg, VA 24060",
  blockCode: "TBD",
  bookingUrl: "https://www.hilton.com/en/brands/home2-suites/",
  mapsUrl: "https://maps.app.goo.gl/1G9qu1cFqdc14EVa8",
  notes:
    "Suites with mini kitchens (plates, pots, pans). A good option if you plan to pick up groceries at the nearby Kroger. Block details coming soon.",
  nights: "Block: night of 10/24 + night of 10/25",
  pricePerNight: 115,
};

const AIRPORTS = [
  {
    code: "ROA",
    name: "Roanoke–Blacksburg Regional",
    driveTime: "~45 min",
    note: "Closest airport to the venue. Smallest of the three.",
  },
  {
    code: "GSO",
    name: "Piedmont Triad (Greensboro)",
    driveTime: "~2 hr drive",
    note: "Mid-size option to the east.",
  },
  {
    code: "CLT",
    name: "Charlotte Douglas",
    driveTime: "~3 hr drive",
    note: "Largest of the three; best selection of flights when ROA is limited.",
  },
];

function Travel() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <SectionHeader eyebrow="Getting There" title="Travel" icon={Plane}>
        <p>
          The wedding is on <strong>Sunday, October 25, 2026</strong> at
          Beliveau Farm Winery in Virginia, with the ceremony at{" "}
          <strong>3:00 PM</strong>. We've blocked rooms at the hotel below for
          the nights of <strong>October 24</strong> and{" "}
          <strong>October 25</strong> so you can arrive early and stay over.
        </p>
      </SectionHeader>

      <h2 className="mt-20 mb-6 font-script text-4xl text-burgundy text-center flex items-center justify-center gap-3">
        <Wine className="w-7 h-7" strokeWidth={1.5} />
        <span>Venue</span>
      </h2>

      <a
        href="https://maps.app.goo.gl/qvABiP4svqpQy4Jk9"
        target="_blank"
        rel="noopener noreferrer"
        className="group grid md:grid-cols-2 rounded-2xl overflow-hidden border border-amber hover:border-burgundy transition-colors shadow-card"
      >
        <img
          src="/images/venue.webp"
          alt="Beliveau Farm Winery"
          className="w-full h-64 md:h-72 object-cover"
        />
        <div className="bg-parchment flex flex-col items-center justify-center gap-3 p-8 text-center">
          <p className="font-script text-3xl text-burgundy">Beliveau Farm Winery</p>
          <p className="inline-flex items-center gap-1.5 text-sm text-ink/70">
            <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
            3899 Eakin Farm Rd, Blacksburg, VA 24060
          </p>
          <p className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-burgundy underline decoration-burgundy/40 underline-offset-2 mt-1">
            <ExternalLink className="w-3 h-3" strokeWidth={2} />
            Open in Google Maps
          </p>
        </div>
      </a>

      <h2 className="mt-20 mb-2 font-script text-4xl text-burgundy text-center flex items-center justify-center gap-3">
        <BedDouble className="w-7 h-7" strokeWidth={1.5} />
        <span>Hotel</span>
      </h2>
      <p className="text-center text-ink/70 mb-8 max-w-xl mx-auto">
        Feel free to stay anywhere. We blocked a room group here for guaranteed availability at a set rate.
      </p>

      <div className="rounded-2xl overflow-hidden border border-amber shadow-card grid md:grid-cols-2">
        <img
          src="/images/hotel.webp"
          alt={HOTEL.name}
          className="w-full h-64 md:h-full object-cover"
        />
        <div className="bg-parchment flex flex-col gap-3 p-8">
          <p className="font-script text-3xl text-burgundy">{HOTEL.name}</p>
          <a
            href={HOTEL.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-ink/70 hover:text-burgundy transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
            {HOTEL.address}
            <ExternalLink className="w-3 h-3 shrink-0" strokeWidth={2} />
          </a>
          <p className="text-ink/80 text-sm mt-1">{HOTEL.notes}</p>
          <p className="text-sm">
            <span className="text-ink/60">{HOTEL.nights}</span>
            {HOTEL.pricePerNight && (
              <>
                <span className="text-ink/60"> · </span>
                <span className="text-ink/80">${HOTEL.pricePerNight}/night</span>
              </>
            )}
          </p>
          <p className="text-sm">
            <span className="text-ink/60">Block code: </span>
            <span className="font-mono">{HOTEL.blockCode}</span>
          </p>
          <span className="inline-block mt-2 px-6 py-2 bg-ink/20 text-ink/40 uppercase tracking-widest text-xs rounded-full self-start cursor-not-allowed">
            Block booking coming soon
          </span>
        </div>
      </div>

      <h2 className="mt-20 mb-2 font-script text-4xl text-burgundy text-center flex items-center justify-center gap-3">
        <Plane className="w-7 h-7" strokeWidth={1.5} />
        <span>Airports</span>
      </h2>
      <p className="text-center text-ink/70 mb-8 max-w-xl mx-auto">
        Three options, depending on your departure city.
      </p>

      <div className="grid sm:grid-cols-3 gap-4">
        {AIRPORTS.map((a) => (
          <div
            key={a.code}
            className="p-6 bg-parchment border border-amber rounded-2xl text-center"
          >
            <p className="font-mono text-2xl text-burgundy">{a.code}</p>
            <p className="font-script text-2xl text-burgundy mt-1">{a.name}</p>
            <p className="text-xs uppercase tracking-widest text-gold mt-2">
              {a.driveTime}
            </p>
            <p className="text-sm text-ink/70 mt-3">{a.note}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-20 mb-2 font-script text-4xl text-burgundy text-center flex items-center justify-center gap-3">
        <Bus className="w-7 h-7" strokeWidth={1.5} />
        <span>Shuttle</span>
      </h2>
      <p className="text-center text-ink/70 mb-2 max-w-xl mx-auto">
        We're considering a shuttle between the hotel block and the venue. If
        enough guests are interested, we'll arrange it.
      </p>
      <p className="text-center text-ink/50 text-sm mb-10 max-w-xl mx-auto">
        This is an indication of interest only, not a confirmed booking. We'll
        follow up once we know if there's enough demand.
      </p>
      <TransportForm />
    </section>
  );
}

function TransportForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "sent" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="max-w-xl mx-auto bg-parchment border border-amber rounded-3xl p-8 space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("submitting");
        setError(null);
        const fd = new FormData(e.currentTarget);
        try {
          await requestTransport({
            data: {
              name: String(fd.get("name") ?? ""),
              email: String(fd.get("email") ?? ""),
              hotel: HOTEL.name,
              partySize: Number(fd.get("partySize") ?? 1),
              notes: String(fd.get("notes") ?? ""),
            },
          });
          setStatus("sent");
          (e.target as HTMLFormElement).reset();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setStatus("error");
        }
      }}
    >
      {status === "sent" ? (
        <div className="py-4 text-center">
          <p className="text-burgundy font-script text-2xl">
            Thank you. We've noted your interest.
          </p>
          <p className="text-ink/60 text-sm mt-2">
            We'll be in touch once we confirm whether a shuttle is running.
          </p>
        </div>
      ) : (
        <>
          <Field label="Name" name="name" required />
          <Field label="Email" name="email" type="email" />
          <Field
            label="How many seats?"
            name="partySize"
            type="number"
            defaultValue="1"
            min={1}
            max={10}
          />
          <TextArea label="Anything else?" name="notes" />

          {error && <p className="text-sm text-oxblood">{error}</p>}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full px-6 py-3 bg-burgundy text-cream uppercase tracking-widest text-sm rounded-full hover:bg-pumpkin transition-colors disabled:opacity-50"
          >
            {status === "submitting" ? "Sending…" : "Indicate Shuttle Interest"}
          </button>
        </>
      )}
    </form>
  );
}

function Field(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string },
) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="block uppercase tracking-widest text-xs text-ink/60 mb-1">
        {label}
      </span>
      <input
        {...rest}
        className="w-full bg-cream border border-amber focus:border-burgundy rounded-lg outline-none px-3 py-2 text-ink"
      />
    </label>
  );
}

function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string },
) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="block uppercase tracking-widest text-xs text-ink/60 mb-1">
        {label}
      </span>
      <textarea
        {...rest}
        rows={3}
        className="w-full bg-cream border border-amber focus:border-burgundy rounded-lg outline-none px-3 py-2 text-ink"
      />
    </label>
  );
}
