import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RsvpForm } from "~/components/RsvpForm";

export const Route = createFileRoute("/rsvp")({
  component: Rsvp,
});

function Rsvp() {
  const [phase, setPhase] = useState<"idle" | "flying" | "gone">("idle");
  const [attendingResult, setAttendingResult] = useState<"yes" | "no" | null>(
    null,
  );

  function handleSent(att: "yes" | "no") {
    setAttendingResult(att);
    setPhase("flying");
  }

  const confirmMsg =
    attendingResult === "yes"
      ? "We look forward to celebrating with you!"
      : "Thank you. We will miss you.";

  return (
    <div className="mx-auto max-w-5xl px-2 md:px-4 py-8">
      <div className="flex justify-center">
        {/* Card + mailbox container — flex-col on mobile, block+relative on desktop */}
        <div
          className="flex flex-col items-center md:block md:relative"
          style={{ width: "min(440px, 92vw)" }}
        >
          {phase === "gone" ? (
            /* Confirmation text — same footprint as the card */
            <div
              className="w-full flex items-center justify-center animate-fade-in-up"
              style={{ aspectRatio: "2 / 3" }}
            >
              <p className="font-script text-3xl text-burgundy text-center leading-snug italic px-8">
                {confirmMsg}
              </p>
            </div>
          ) : (
            /* Paper card */
            <div
              className={`w-full relative bg-parchment shadow-card rounded-sm ${phase === "flying" ? "animate-fly-up" : "animate-fall-in"}`}
              style={{ aspectRatio: "2 / 3" }}
              onAnimationEnd={() => {
                if (phase === "flying") setPhase("gone");
              }}
            >
              <img
                src="/images/border.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                style={{
                  objectFit: "fill",
                  zIndex: 10,
                  mixBlendMode: "multiply",
                }}
              />
              <div
                className="absolute inset-0 overflow-y-auto"
                style={{ zIndex: 20, padding: "21%" }}
              >
                <p className="text-center text-[10px] uppercase tracking-[0.55em] text-gold mb-5">
                  RSVP
                </p>
                <RsvpForm plain onSent={handleSent} />
              </div>
            </div>
          )}

          {/* Mailbox — below card on mobile, right of card on desktop */}
          <button
            type="submit"
            form="rsvp-form"
            className="group mt-6 flex flex-col items-center gap-2 cursor-pointer md:absolute md:bottom-8 md:left-full md:ml-5 md:mt-0 transition-opacity duration-300"
            style={{
              opacity: phase !== "idle" ? 0 : undefined,
              pointerEvents: phase !== "idle" ? "none" : undefined,
            }}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector(
                "img",
              ) as HTMLImageElement | null;
              if (!img) return;
              img.style.animation = "none";
              void img.offsetWidth;
              img.style.animation =
                "mailbox-hop 0.55s cubic-bezier(0.36,0.07,0.19,0.97)";
            }}
          >
            <img
              src="/images/mailbox.png"
              alt="Send RSVP"
              className="select-none"
              style={{
                mixBlendMode: "multiply",
                width: "clamp(5rem, 10vw, 10rem)",
                maxWidth: "none",
              }}
            />
            <span className="text-[11px] uppercase tracking-[0.35em] text-ink/40 group-hover:text-burgundy group-hover:-translate-y-0.5 transition-all">
              Send
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
