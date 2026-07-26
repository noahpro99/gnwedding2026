import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { submitRsvp } from "~/server/rsvp";

type GuestRow = { id: string; name: string; attending: "yes" | "no" | null };

let _uid = 0;
const uid = () => String(_uid++);

function makeRow(name = ""): GuestRow {
  return { id: uid(), name, attending: null };
}

type Prefill = { inviteId?: string; guests?: { name: string }[]; partyMax?: number };

function readPrefill(): Prefill | null {
  try {
    const raw = localStorage.getItem("rsvp-prefill");
    return raw ? (JSON.parse(raw) as Prefill) : null;
  } catch {
    return null;
  }
}

export function RsvpForm({
  inviteId: inviteIdProp,
  initialGuests,
  partyMax: partyMaxProp,
  plain = false,
  onSent,
}: {
  inviteId?: string;
  initialGuests?: { name: string }[];
  partyMax?: number;
  plain?: boolean;
  onSent?: (attending: "yes" | "no") => void;
}) {
  const [{ inviteId, partyMax, guests: initialRows }] = useState(() => {
    const prefill = !initialGuests?.length ? readPrefill() : null;
    return {
      inviteId: inviteIdProp ?? prefill?.inviteId,
      partyMax: partyMaxProp ?? prefill?.partyMax ?? 10,
      guests: initialGuests?.length
        ? initialGuests
        : (prefill?.guests?.length ? prefill.guests : [{ name: "" }]),
    };
  });

  const [guests, setGuests] = useState<GuestRow[]>(() =>
    initialRows.map((g) => makeRow(g.name)),
  );
  const [email, setEmail] = useState("");
  const [dietary, setDietary] = useState("");
  const [notes, setNotes] = useState("");
  const [needsTransport, setNeedsTransport] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const someYes = guests.some((g) => g.attending === "yes");

  function setGuestName(id: string, name: string) {
    setGuests((gs) => gs.map((g) => (g.id === id ? { ...g, name } : g)));
  }
  function setGuestDecision(id: string, v: "yes" | "no") {
    setGuests((gs) => gs.map((g) => (g.id === id ? { ...g, attending: v } : g)));
  }
  function removeGuest(id: string) {
    setGuests((gs) => (gs.length > 1 ? gs.filter((g) => g.id !== id) : gs));
  }
  function addGuest() {
    if (guests.length < partyMax) setGuests((gs) => [...gs, makeRow()]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid = guests.filter((g) => g.name.trim());
    if (!valid.length) {
      setError("Please enter at least one name.");
      return;
    }
    if (valid.some((g) => g.attending === null)) {
      setError("Please select accept or decline for each person.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setStatus("submitting");
    setError(null);
    const anyAttending = valid.some((g) => g.attending === "yes");
    try {
      await submitRsvp({
        data: {
          inviteId,
          email: email.trim(),
          guests: valid.map((g) => ({
            name: g.name.trim(),
            attending: g.attending === "yes",
          })),
          dietary: dietary || undefined,
          notes: notes || undefined,
          needsTransport,
        },
      });
      setStatus("sent");
      if (plain && onSent) onSent(anyAttending ? "yes" : "no");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "sent") {
    if (plain) return null;
    const msg = someYes
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
        <div className="space-y-3">
          {guests.map((g) => (
            <PaperGuestRow
              key={g.id}
              guest={g}
              showDelete={guests.length > 1}
              onName={(n) => setGuestName(g.id, n)}
              onDecision={(v) => setGuestDecision(g.id, v)}
              onDelete={() => removeGuest(g.id)}
            />
          ))}
        </div>

        {guests.length < partyMax && (
          <button
            type="button"
            onClick={addGuest}
            className="flex items-center gap-1 text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-ink/40 hover:text-ink/60 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add guest
          </button>
        )}

        <PaperLine
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {someYes && (
          <>
            <PaperLine
              label="Dietary"
              name="dietary"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
            />
            <PaperArea label="Notes" value={notes} onChange={setNotes} />
            <label className="flex items-center gap-2 pt-0.5 cursor-pointer select-none">
              <span className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={needsTransport}
                  onChange={(e) => setNeedsTransport(e.target.checked)}
                  className="peer appearance-none w-3.5 h-3.5 border border-ink/30 rounded-sm bg-transparent checked:bg-burgundy checked:border-burgundy transition-colors cursor-pointer"
                />
                <svg
                  className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-cream w-2.5 h-2.5"
                  viewBox="0 0 10 10"
                  fill="none"
                >
                  <path
                    d="M1.5 5l2.5 2.5 4.5-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
      <p className="uppercase tracking-widest text-xs text-ink/60">
        Will you join us?
      </p>

      <div className="space-y-2">
        {guests.map((g) => (
          <CardGuestRow
            key={g.id}
            guest={g}
            showDelete={guests.length > 1}
            onName={(n) => setGuestName(g.id, n)}
            onDecision={(v) => setGuestDecision(g.id, v)}
            onDelete={() => removeGuest(g.id)}
          />
        ))}
      </div>

      {guests.length < partyMax && (
        <button
          type="button"
          onClick={addGuest}
          className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink/40 hover:text-ink/70 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add guest
        </button>
      )}

      <Field
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {someYes && (
        <>
          <Field
            label="Dietary restrictions or allergies"
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
          />
          <label className="block">
            <span className="block uppercase tracking-widest text-xs text-ink/60 mb-1">
              Additional notes
            </span>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-cream border border-amber focus:border-burgundy rounded-lg outline-none px-3 py-2 text-ink"
            />
          </label>
          <label className="flex items-center gap-3 text-sm text-ink/80 cursor-pointer select-none">
            <span className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={needsTransport}
                onChange={(e) => setNeedsTransport(e.target.checked)}
                className="peer appearance-none w-4 h-4 border border-amber checked:border-burgundy rounded-sm bg-cream checked:bg-burgundy transition-colors cursor-pointer"
              />
              <svg
                className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-cream w-3 h-3"
                viewBox="0 0 10 10"
                fill="none"
              >
                <path
                  d="M1.5 5l2.5 2.5 4.5-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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

/* ── Paper guest row ── */
function PaperGuestRow({
  guest,
  showDelete,
  onName,
  onDecision,
  onDelete,
}: {
  guest: GuestRow;
  showDelete: boolean;
  onName: (n: string) => void;
  onDecision: (v: "yes" | "no") => void;
  onDelete: () => void;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-1 border-b border-ink/20 focus-within:border-ink/50 transition-colors pb-px">
        <input
          value={guest.name}
          onChange={(e) => onName(e.target.value)}
          placeholder="Name"
          className="flex-1 min-w-0 bg-transparent outline-none text-ink text-sm md:text-base py-0.5"
        />
        {showDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="shrink-0 text-ink/25 hover:text-ink/50 transition-colors pb-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="flex gap-4 pt-0.5">
        {(["yes", "no"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onDecision(v)}
            className={`text-[9px] md:text-[10px] uppercase tracking-[0.25em] border-b pb-px transition-colors ${
              guest.attending === v
                ? "border-burgundy text-burgundy"
                : "border-transparent text-ink/40 hover:text-ink/60"
            }`}
          >
            {v === "yes" ? "Accept" : "Decline"}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Card guest row ── */
function CardGuestRow({
  guest,
  showDelete,
  onName,
  onDecision,
  onDelete,
}: {
  guest: GuestRow;
  showDelete: boolean;
  onName: (n: string) => void;
  onDecision: (v: "yes" | "no") => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        value={guest.name}
        onChange={(e) => onName(e.target.value)}
        placeholder="Name"
        className="flex-1 min-w-0 bg-cream border border-amber focus:border-burgundy rounded-lg outline-none px-3 py-2 text-ink text-sm"
      />
      {(["yes", "no"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onDecision(v)}
          className={`shrink-0 px-3 py-2 text-xs uppercase tracking-wider rounded-full border transition-colors ${
            guest.attending === v
              ? v === "yes"
                ? "bg-burgundy text-cream border-burgundy"
                : "bg-ink/20 text-ink border-ink/20"
              : "bg-cream text-ink/50 border-amber hover:border-ink/40"
          }`}
        >
          {v === "yes" ? "Accept" : "Decline"}
        </button>
      ))}
      {showDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="shrink-0 text-ink/30 hover:text-ink/60 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      ) : (
        <div className="w-6 shrink-0" />
      )}
    </div>
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

function PaperArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
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
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          grow();
        }}
        rows={1}
        onInput={grow}
        className="w-full bg-transparent outline-none text-ink text-sm md:text-base py-0.5 resize-none overflow-hidden leading-snug"
      />
    </div>
  );
}

/* ── Card-style field component ── */

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
