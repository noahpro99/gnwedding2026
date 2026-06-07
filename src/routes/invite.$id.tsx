import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CardFrame } from "~/components/CardFrame";
import { RsvpForm } from "~/components/RsvpForm";
import { getInvite } from "~/server/rsvp";

export const Route = createFileRoute("/invite/$id")({
  loader: async ({ params }) => {
    const invite = await getInvite({ data: { id: params.id } });
    if (!invite) throw notFound();
    return { invite };
  },
  component: InvitePage,
  notFoundComponent: () => (
    <section className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="font-script text-5xl text-burgundy">Invite not found</h1>
      <p className="mt-4 text-ink/70">
        Double-check the link you were given, or head{" "}
        <a href="/" className="underline">
          home
        </a>
        .
      </p>
    </section>
  ),
});

function InvitePage() {
  const { invite } = Route.useLoaderData();
  const [showRsvp, setShowRsvp] = useState(false);

  if (showRsvp) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-20">
        <p className="text-center uppercase tracking-[0.3em] text-xs text-gold mb-3">
          {invite.guest_names}
        </p>
        <h1 className="text-center font-script text-5xl text-burgundy mb-12">
          RSVP
        </h1>
        <RsvpForm inviteId={invite.id} />
      </section>
    );
  }

  return (
    <section className="bg-amber/30 py-16 min-h-[calc(100vh-12rem)]">
      <div className="mx-auto px-6">
        <CardFrame>
          <p className="uppercase tracking-[0.4em] text-xs text-gold">
            Together with their families
          </p>
          <h1 className="font-script text-5xl md:text-6xl text-burgundy mt-6">
            Gwendolyn &amp; Noah
          </h1>
          <p className="mt-6 text-ink/80 text-sm md:text-base">
            request the honor of your presence
            <br />
            at the celebration of their marriage
          </p>

          <div className="my-8 mx-auto w-24 border-t border-gold" />

          <p className="text-2xl md:text-3xl tracking-widest text-burgundy">
            Sunday, October 25, 2026
          </p>
          <p className="mt-2 text-sm uppercase tracking-widest text-ink/70">
            Beliveau Farm Winery · Virginia
          </p>

          <p className="mt-8 text-xs uppercase tracking-widest text-ink/60">
            With love, for {invite.guest_names}
          </p>

          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setShowRsvp(true)}
              className="px-8 py-3 bg-burgundy text-cream uppercase tracking-widest text-xs rounded-full hover:bg-pumpkin transition-colors"
            >
              Accept / Decline
            </button>
          </div>
        </CardFrame>
      </div>
    </section>
  );
}
