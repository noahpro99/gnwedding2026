import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BachelorFormScreen } from "~/components/BachelorFormScreen";
import { getBachelorInvite } from "~/server/bachelor";

export const Route = createFileRoute("/bachelor_/$id")({
  head: () => ({
    links: [{ rel: "preload", as: "image", href: "/images/suit.webp" }],
  }),
  loader: async ({ params }) => {
    const invite = await getBachelorInvite({ data: { id: params.id } });
    if (!invite) throw notFound();
    return { invite };
  },
  component: BachelorInvitePage,
  notFoundComponent: () => (
    <div className="min-h-[100svh] bg-onyx text-ivory flex items-center">
      <section className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-3xl uppercase tracking-[0.2em] text-ivory">Invite not found</h1>
        <p className="mt-4 text-smoke">Double-check the link Noah sent you.</p>
      </section>
    </div>
  ),
});

function primaryName(guestNames: string): string {
  const first = guestNames.split(", ")[0] ?? guestNames;
  return first.replace(/\s*\+\d+$/, "").trim();
}

const SHIRT = { top: 22, bottom: 46, side: 30 };

function SuitCard({ guestNames }: { guestNames: string }) {
  return (
    <>
      <img
        src="/images/suit.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full select-none"
        style={{ objectFit: "cover", zIndex: 10 }}
      />
      <div
        className="absolute flex flex-col items-center text-center text-onyx"
        style={{ top: `${SHIRT.top}%`, bottom: `${SHIRT.bottom}%`, left: `${SHIRT.side}%`, right: `${SHIRT.side}%`, zIndex: 20 }}
      >
        <p style={{ fontSize: "2.4cqw", textTransform: "uppercase", letterSpacing: "0.32em", color: "var(--color-smoke)" }}>
          You are invited to
        </p>
        <h1 style={{ fontSize: "5cqw", lineHeight: 1.16, marginTop: "2.5cqw", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-onyx)" }}>
          Noah's
          <br />
          Bachelor Party
        </h1>
        <div style={{ width: "30%", borderTop: "1px solid color-mix(in srgb, var(--color-onyx) 45%, transparent)", margin: "3.5cqw auto" }} />
        {guestNames.split(", ").map((l, i) => (
          <p key={i} style={{ fontStyle: "italic", fontSize: "3.6cqw", lineHeight: 1.4 }}>
            {l}
          </p>
        ))}
        <p style={{ fontSize: "2.3cqw", marginTop: "4cqw", textTransform: "uppercase", letterSpacing: "0.3em", color: "var(--color-smoke)" }}>
          Tap to open
        </p>
      </div>
    </>
  );
}

type Stage = "incoming" | "closed" | "open" | "out" | "card" | "away" | "form";

function BachelorInvitePage() {
  const { invite } = Route.useLoaderData();
  const [stage, setStage] = useState<Stage>("incoming");

  useEffect(() => {
    const t = setTimeout(() => setStage("closed"), 60);
    return () => clearTimeout(t);
  }, []);

  function advance() {
    if (stage === "closed") setStage("open");
    else if (stage === "open") {
      setStage("out");
      setTimeout(() => setStage("card"), 1000);
    } else if (stage === "card") {
      setStage("away");
      setTimeout(() => setStage("form"), 720);
    }
  }

  const clickable = stage === "closed" || stage === "open" || stage === "card";
  const envGone = stage === "out" || stage === "card" || stage === "away" || stage === "form";
  const cardOut = stage === "out" || stage === "card";

  const wrapT = stage === "incoming" ? "translateY(-135vh)" : "translateY(0)";
  const envT = envGone ? "translateY(128vh)" : "translateY(0)";
  const cardT =
    stage === "away"
      ? "translate(-50%,-50%) translateY(-135vh) scale(1.62)"
      : cardOut
        ? "translate(-50%,-50%) translateY(-3vh) scale(1.62)"
        : "translate(-50%,-50%)";
  const flapOpen = stage !== "incoming" && stage !== "closed";

  const envTransition = "transform 0.95s cubic-bezier(0.5,0,0.75,0), opacity 0.95s ease";
  const paper = "var(--color-ivory)";
  const edge = "rgba(15,15,17,0.16)";

  return (
    <div className="relative bg-onyx" style={{ minHeight: "100svh", overflow: "hidden" }}>
      {(stage === "away" || stage === "form") && (
        <div className="absolute inset-0 overflow-auto animate-fade-in-up" style={{ zIndex: 5 }}>
          <BachelorFormScreen inviteId={invite.id} name={primaryName(invite.guest_names)} />
        </div>
      )}

      {stage !== "form" && (
        <div
          onClick={clickable ? advance : undefined}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            zIndex: 10,
            padding: "6vw",
            cursor: clickable ? "pointer" : "default",
            transform: wrapT,
            transition: "transform 1.5s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="relative" style={{ width: "min(90vw, calc(66svh * 7 / 5))", aspectRatio: "7 / 5", perspective: "1400px" }}>
            {/* envelope back / body */}
            <div
              className="absolute inset-0"
              style={{
                background: paper,
                boxShadow: "0 30px 65px rgba(0,0,0,0.55)",
                transform: envT,
                opacity: envGone ? 0 : 1,
                transition: envTransition,
                zIndex: 1,
              }}
            />

            {/* the card, tucked inside */}
            <div
              className="absolute shadow-card"
              style={{
                width: "42%",
                aspectRatio: "5 / 7",
                left: "50%",
                top: "50%",
                transform: cardT,
                transition: "transform 0.95s cubic-bezier(0.16,1,0.3,1), opacity 0.7s ease",
                opacity: stage === "away" ? 0 : 1,
                containerType: "inline-size",
                border: "1px solid var(--color-silver)",
                zIndex: 2,
                cursor: stage === "card" ? "pointer" : undefined,
              }}
              onClick={stage === "card" ? (e) => { e.stopPropagation(); advance(); } : undefined}
            >
              <SuitCard guestNames={invite.guest_names} />
            </div>

            {/* envelope front (full rect minus the top-flap triangle) */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(160deg,#f6f5f1,#e9e7de)",
                clipPath: "polygon(0% 0%, 50% 46%, 100% 0%, 100% 100%, 0% 100%)",
                transform: envT,
                opacity: envGone ? 0 : 1,
                transition: envTransition,
                zIndex: 3,
              }}
            >
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                {/* flap seat + faint bottom flap seam */}
                <path d="M0 0 L50 46 L100 0" fill="none" stroke={edge} strokeWidth="0.5" />
                <path d="M0 100 L50 82 L100 100" fill="none" stroke={edge} strokeWidth="0.4" opacity="0.6" />
              </svg>
            </div>

            {/* openable flap */}
            <div
              className="absolute"
              style={{
                left: 0,
                right: 0,
                top: 0,
                height: "46%",
                background: "linear-gradient(180deg,#f6f5f1,#e2e0d7)",
                clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
                transform: `${envT} rotateX(${flapOpen ? -178 : 0}deg)`,
                transformOrigin: "top center",
                transition: "transform 0.8s cubic-bezier(0.6,0,0.3,1), opacity 0.95s ease",
                opacity: envGone ? 0 : 1,
                zIndex: flapOpen ? 1 : 5,
                backfaceVisibility: "hidden",
              }}
            >
              <svg viewBox="0 0 100 46" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <path d="M0 0 L50 46 L100 0" fill="none" stroke={edge} strokeWidth="0.7" />
              </svg>
            </div>

            {/* wax seal at the flap tip */}
            <div
              className="absolute left-1/2 flex items-center justify-center"
              style={{
                top: "46%",
                width: "15%",
                aspectRatio: "1 / 1",
                transform: `${envT} translate(-50%,-50%)`,
                borderRadius: "9999px",
                background: "radial-gradient(circle at 38% 34%, #34343a, #131316 70%)",
                boxShadow: "0 2px 5px rgba(0,0,0,0.45)",
                color: "var(--color-ivory)",
                fontStyle: "italic",
                fontSize: "1.5rem",
                opacity: stage === "incoming" || stage === "closed" ? 1 : 0,
                transition: "opacity 0.4s ease",
                zIndex: 6,
                pointerEvents: "none",
              }}
            >
              N
            </div>
          </div>

          <p
            className="absolute left-0 right-0 text-center text-smoke"
            style={{
              bottom: "7%",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.34em",
              opacity: clickable ? 0.8 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            {stage === "closed" ? "Tap to open" : stage === "open" ? "Tap to take out the card" : "Tap the card"}
          </p>
        </div>
      )}
    </div>
  );
}
