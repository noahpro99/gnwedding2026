import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { CardFrame } from "~/components/CardFrame";
import { getInvite } from "~/server/rsvp";

export const Route = createFileRoute("/invite/$id")({
  head: () => ({
    links: [{ rel: "preload", as: "image", href: "/images/border.png" }],
  }),
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

function formatGuestNames(guestNames: string): string[] {
  return guestNames.split(", ");
}

function InvitePage() {
  const { invite } = Route.useLoaderData();

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "100svh" }}
    >
      <CardFrame>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0",
            width: "100%",
          }}
        >
          <p
            style={{
              fontFamily: "inherit",
              fontStyle: "italic",
              fontSize: "6.8cqw",
              lineHeight: 1.2,
              color: "var(--color-burgundy)",
            }}
          >
            Gwendolyn Swannell
          </p>
          <p
            style={{
              fontFamily: "inherit",
              fontStyle: "italic",
              fontSize: "6.8cqw",
              lineHeight: 1.2,
              color: "var(--color-burgundy)",
            }}
          >
            &amp; Noah Provenzano
          </p>
          <p
            style={{
              fontSize: "3.1cqw",
              marginTop: "3cqw",
              color: "color-mix(in srgb, var(--color-ink) 75%, transparent)",
              lineHeight: 1.4,
            }}
          >
            cordially invite you to celebrate their wedding
          </p>

          <div
            style={{
              width: "52%",
              borderTop: "1px solid color-mix(in srgb, var(--color-burgundy) 40%, transparent)",
              margin: "4cqw auto",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.6cqw",
            }}
          >
            {formatGuestNames(invite.guest_names).map((line, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "3.8cqw",
                    color: "color-mix(in srgb, var(--color-ink) 85%, transparent)",
                    lineHeight: 1.4,
                  }}
                >
                  {line}
                </p>
              ))}
          </div>

          <div
            style={{
              width: "52%",
              borderTop: "1px solid color-mix(in srgb, var(--color-burgundy) 40%, transparent)",
              margin: "4cqw auto",
            }}
          />

          <p
            style={{
              fontSize: "2.8cqw",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "color-mix(in srgb, var(--color-ink) 80%, transparent)",
            }}
          >
            Sunday, October 25, 2026 at 3pm
          </p>
          <p
            style={{
              fontSize: "3.1cqw",
              marginTop: "1.5cqw",
              color: "color-mix(in srgb, var(--color-ink) 70%, transparent)",
            }}
          >
            Beliveau Farm Winery, Blacksburg, VA
          </p>

          <Link
            to="/"
            style={{
              marginTop: "5cqw",
              padding: "1.5cqw 6cqw",
              fontSize: "2.6cqw",
              backgroundColor: "var(--color-burgundy)",
              color: "var(--color-cream)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              borderRadius: "9999px",
              display: "inline-block",
              textDecoration: "none",
            }}
          >
            RSVP
          </Link>
        </div>
      </CardFrame>
    </div>
  );
}
