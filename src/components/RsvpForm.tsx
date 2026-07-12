import { Check, X } from "lucide-react";
import { useRef, useState } from "react";
import { submitRsvp } from "~/server/rsvp";

export function RsvpForm({
  inviteId,
  plain = false,
  onSent,
}: {
  inviteId?: string;
  defaultGuestId?: string;
  plain?: boolean;
  onSent?: (attending: "yes" | "no") => void;
}) {
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "sent" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const rawNames = String(fd.get("attendingNames") ?? "").trim();
    const nameLines = rawNames.split("\n").map((n) => n.trim()).filter(Boolean);
    const primaryName = nameLines[0] ?? "";
    if (!primaryName) {
      setError("Please enter at least one name.");
      return;
    }
    if (!attending) {
      setError("Let us know if you can make it.");
      return;
    }
    const email = String(fd.get("email") ?? "").trim();
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setStatus("submitting");
    setError(null);
    const guestNames = nameLines;
    try {
      await submitRsvp({
        data: {
          inviteId,
          primaryName,
          guestNames,
          email: String(fd.get("email") ?? ""),
          attending: attending === "yes",
          dietary: String(fd.get("dietary") ?? ""),
          notes: String(fd.get("notes") ?? ""),
          needsTransport: fd.get("needsTransport") === "on",
        },
      });
      setStatus("sent");
      if (plain && onSent && attending) onSent(attending);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "sent") {
    if (plain) return null; // parent animates the card away and shows confirmation
    const msg =
      attending === "yes"
        ? "We look forward to celebrating with you!"
        : "Thank you. We will miss you.";
    return (
      <div className="text-center bg-parchment border border-amber rounded-3xl p-10">
        <p className="font-script text-4xl text-burgundy">{msg}</p>
        <p className="mt-4 text-ink/70">
          Your RSVP was received. You can come back here to update it any time.
        </p>
      </div>
    );
  }

  /* ── Plain / paper style (inside the border card on /rsvp) ── */
  if (plain) {
    return (
      <form id="rsvp-form" className="space-y-3" onSubmit={handleSubmit}>
        <PaperArea label="List attendees here:" name="attendingNames" />

        {/* Accept / Decline */}
        <div className="flex justify-center gap-8 pt-1 pb-1">
          {(["yes", "no"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setAttending(v)}
              className={`text-[9px] md:text-[11px] uppercase tracking-[0.25em] border-b pb-px transition-colors ${
                attending === v
                  ? "border-burgundy text-burgundy"
                  : "border-transparent text-ink/55 hover:text-ink/60"
              }`}
            >
              {v === "yes" ? "Accept" : "Decline"}
            </button>
          ))}
        </div>

        <PaperLine label="Email" name="email" type="email" required />

        {attending === "yes" && (
          <>
            <PaperLine label="Dietary" name="dietary" />
            <PaperArea label="Notes" name="notes" />
            <label className="flex items-center gap-2 pt-0.5 cursor-pointer select-none">
              <span className="relative flex items-center justify-center">
                <input type="checkbox" name="needsTransport" className="peer appearance-none w-3.5 h-3.5 border border-ink/30 rounded-sm bg-transparent checked:bg-burgundy checked:border-burgundy transition-colors cursor-pointer" />
                <svg className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-cream w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5l2.5 2.5 4.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] text-ink/55">
                Interested in hotel shuttle
              </span>
            </label>
          </>
        )}

        {error && <p className="text-[10px] text-oxblood">{error}</p>}
      </form>
    );
  }

  /* ── Card style (used on /invite/$id) ── */
  return (
    <form
      className="bg-parchment border border-amber rounded-3xl p-8 space-y-5"
      onSubmit={handleSubmit}
    >
      <label className="block">
        <span className="block uppercase tracking-widest text-xs text-ink/60 mb-1">
          List attendees here:
        </span>
        <textarea
          name="attendingNames"
          rows={3}
          placeholder="One name per line"
          className="w-full bg-cream border border-amber focus:border-burgundy rounded-lg outline-none px-3 py-2 text-ink"
        />
      </label>
      <fieldset>
        <legend className="uppercase tracking-widest text-xs text-ink/60 mb-3">
          Will you join us?
        </legend>
        <div className="flex gap-3">
          {(["yes", "no"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setAttending(v)}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border uppercase tracking-widest text-xs rounded-full transition-colors ${
                attending === v
                  ? "bg-burgundy text-cream border-burgundy"
                  : "bg-cream text-ink border-amber hover:border-burgundy"
              }`}
            >
              {v === "yes" ? (
                <>
                  <Check className="w-4 h-4" strokeWidth={2.5} /> Accept
                </>
              ) : (
                <>
                  <X className="w-4 h-4" strokeWidth={2.5} /> Decline
                </>
              )}
            </button>
          ))}
        </div>
      </fieldset>
      <Field label="Email" name="email" type="email" required />
      {attending === "yes" && (
        <>
          <Field label="Dietary restrictions or allergies" name="dietary" />
          <label className="block">
            <span className="block uppercase tracking-widest text-xs text-ink/60 mb-1">
              Additional notes
            </span>
            <textarea
              rows={3}
              name="notes"
              className="w-full bg-cream border border-amber focus:border-burgundy rounded-lg outline-none px-3 py-2 text-ink"
            />
          </label>
          <label className="flex items-center gap-3 text-sm text-ink/80 cursor-pointer select-none">
            <span className="relative flex items-center justify-center">
              <input type="checkbox" name="needsTransport" className="peer appearance-none w-4 h-4 border border-amber checked:border-burgundy rounded-sm bg-cream checked:bg-burgundy transition-colors cursor-pointer" />
              <svg className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-cream w-3 h-3" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5l2.5 2.5 4.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            I would like shuttle transportation from the hotel
          </label>
        </>
      )}
      {error && <p className="text-sm text-oxblood">{error}</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full px-6 py-3 bg-burgundy text-cream uppercase tracking-widest text-sm rounded-full hover:bg-pumpkin transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send RSVP"}
      </button>
    </form>
  );
}

/* ── Paper-style field components ── */

function PaperLine(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string },
) {
  const { label, ...rest } = props;
  return (
    <div className="flex items-baseline gap-2 border-b border-ink/20 focus-within:border-ink/50 transition-colors pb-px">
      <span className="shrink-0 text-[9px] md:text-[11px] uppercase tracking-[0.2em] text-ink/55">
        {label}
      </span>
      <input
        {...rest}
        className="flex-1 min-w-0 bg-transparent outline-none text-ink text-sm md:text-base py-0.5"
      />
    </div>
  );
}

function PaperArea({ label, name }: { label: string; name: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  function grow() {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }
  return (
    <div className="border-b border-ink/20 focus-within:border-ink/50 transition-colors pb-px">
      <span className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] text-ink/55 mr-2">
        {label}
      </span>
      <textarea
        ref={ref}
        name={name}
        rows={1}
        onInput={grow}
        className="w-full bg-transparent outline-none text-ink text-sm md:text-base py-0.5 resize-none overflow-hidden leading-snug"
      />
    </div>
  );
}

/* ── Card-style field components (invite page) ── */

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
