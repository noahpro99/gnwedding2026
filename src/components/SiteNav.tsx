import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/our-story", label: "Our Story" },
  { to: "/travel", label: "Travel" },
  { to: "/itinerary", label: "Itinerary" },
  { to: "/wedding-party", label: "Wedding Party" },
  { to: "/registry", label: "Registry" },
  { to: "/faq", label: "FAQ" },
  { to: "/rsvp", label: "RSVP" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-amber shadow-[0_2px_24px_rgba(92,58,34,0.09)]"
    >
      {/* Mobile top bar */}
      <div className="flex md:hidden h-14">
        <Link
          to="/"
          className="flex items-center pl-5 pr-6 h-full font-script text-3xl text-burgundy"
        >
          G &amp; N
        </Link>
        <button
          aria-label="Toggle menu"
          className="flex flex-1 items-center justify-end px-5 h-full text-burgundy"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop top bar */}
      <div className="hidden md:flex mx-auto max-w-6xl px-6 py-4 items-center justify-between">
        <Link to="/" className="font-script text-3xl text-burgundy">
          G &amp; N
        </Link>

        <nav className="flex items-center gap-7 text-sm uppercase tracking-widest">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-ink/70 hover:text-burgundy transition-colors"
              activeProps={{ className: "text-burgundy" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      {open && (
        <nav className="md:hidden border-t border-amber bg-cream">
          <div className="px-6 py-4 flex flex-col gap-3 text-sm uppercase tracking-widest">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-ink/70 hover:text-burgundy"
                activeProps={{ className: "text-burgundy" }}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
