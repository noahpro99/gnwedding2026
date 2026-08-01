import { useState } from "react";
import { DATE_OPTIONS } from "~/server/bachelor-data";
import { submitBachelorAvailability, type DateChoice } from "~/server/bachelor";

type Prefill = { inviteId?: string; name?: string };

function readPrefill(): Prefill | null {
  try {
    const raw = localStorage.getItem("bachelor-prefill");
    return raw ? (JSON.parse(raw) as Prefill) : null;
  } catch {
    return null;
  }
}

const CHOICES: DateChoice[] = ["yes", "maybe", "no"];
const CHOICE_LABEL: Record<DateChoice, string> = { yes: "Yes", maybe: "Maybe", no: "No" };

export function BachelorForm({
  inviteId: inviteIdProp,
  name: nameProp,
}: {
  inviteId?: string;
  name?: string;
}) {
  const [{ inviteId, initialName }] = useState(() => {
    const prefill = nameProp ? null : readPrefill();
    return {
      inviteId: inviteIdProp ?? prefill?.inviteId,
      initialName: nameProp ?? prefill?.name ?? "",
    };
  });

  const [name, setName] = useState(initialName);
  const [availability, setAvailability] = useState<Record<string, DateChoice>>({});
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function setChoice(id: string, choice: DateChoice) {
    setAvailability((a) => ({ ...a, [id]: choice }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Enter your name.");
    const answered = Object.keys(availability);
    if (DATE_OPTIONS.some((d) => !availability[d.id]))
      return setError("Pick Yes, No, or Maybe for every date.");
    const missingReason = answered.some(
      (id) => availability[id] === "maybe" && !reasons[id]?.trim(),
    );
    if (missingReason) return setError("Add a reason for every Maybe.");

    setStatus("submitting");
    setError(null);
    try {
      await submitBachelorAvailability({
        data: {
          inviteId,
          name: name.trim(),
          availability: Object.fromEntries(
            answered.map((id) => [
              id,
              availability[id] === "maybe"
                ? { choice: "maybe" as const, reason: reasons[id]?.trim() }
                : { choice: availability[id]! },
            ]),
          ),
          notes: notes.trim() || undefined,
        },
      });
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-silver/40 bg-tux px-8 py-12 text-center">
        <p className="text-3xl uppercase tracking-[0.2em] text-ivory">You're in</p>
        <p className="mt-3 text-sm text-smoke">We'll lock a date and send the plan.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-silver/25 bg-tux p-6 md:p-8 space-y-8">
      <label className="block">
        <span className="block uppercase tracking-[0.25em] text-xs text-silver mb-2">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-ivory text-onyx outline-none px-3 py-2 border border-silver/40 focus:border-ivory"
        />
      </label>

      <div>
        <p className="uppercase tracking-[0.25em] text-xs text-silver mb-3">Which dates work?</p>
        <div className="space-y-2.5">
          {DATE_OPTIONS.map((d) => (
            <div key={d.id} className="border border-smoke/30 bg-onyx px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-ivory leading-tight">{d.label}</p>
                  <p className="text-[11px] text-smoke leading-tight">{d.detail}</p>
                </div>
                <div className="flex shrink-0 gap-0">
                  {CHOICES.map((c) => {
                    const active = availability[d.id] === c;
                    const activeCls =
                      c === "yes"
                        ? "bg-ivory text-onyx border-ivory"
                        : c === "maybe"
                          ? "bg-silver text-onyx border-silver"
                          : "bg-smoke text-ivory border-smoke";
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setChoice(d.id, c)}
                        className={`px-3 py-1.5 text-[11px] uppercase tracking-wider border -ml-px first:ml-0 transition-colors ${
                          active ? activeCls : "text-smoke border-smoke/40 hover:border-silver hover:text-silver"
                        }`}
                      >
                        {CHOICE_LABEL[c]}
                      </button>
                    );
                  })}
                </div>
              </div>
              {availability[d.id] === "maybe" && (
                <input
                  value={reasons[d.id] ?? ""}
                  onChange={(e) => setReasons((r) => ({ ...r, [d.id]: e.target.value }))}
                  placeholder="What's the catch?"
                  className="mt-2.5 w-full bg-ivory text-onyx placeholder:text-onyx/40 outline-none px-3 py-1.5 text-sm border border-silver/40 focus:border-ivory"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Anything else?"
        className="w-full bg-ivory text-onyx placeholder:text-onyx/40 outline-none px-3 py-2 border border-silver/40 focus:border-ivory"
      />

      {error && <p className="text-sm text-silver">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full px-6 py-3 bg-ivory text-onyx uppercase tracking-[0.25em] text-sm border border-ivory hover:bg-transparent hover:text-ivory transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? "Sending" : "Send availability"}
      </button>
    </form>
  );
}
