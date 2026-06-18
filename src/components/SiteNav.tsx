import { Link } from "@tanstack/react-router";
import {
  Calendar,
  Gift,
  Heart,
  HelpCircle,
  Images,
  Mail,
  Plane,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NotificationBell } from "~/components/NotificationBell";

type NavLink =
  | { to: string; href?: never; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }
  | { to?: never; href: string; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> };

const navLinks: NavLink[] = [
  { to: "/our-story", label: "Our Story", icon: Heart },
  { to: "/travel", label: "Travel", icon: Plane },
  { to: "/itinerary", label: "Itinerary", icon: Calendar },
  { to: "/wedding-party", label: "Wedding Party", icon: Users },
  { to: "/registry", label: "Registry", icon: Gift },
  { href: "https://photos.app.goo.gl/y36aLTqf3mL31vHx9", label: "Photos", icon: Images },
  { to: "/faq", label: "FAQ", icon: HelpCircle },
  { to: "/rsvp", label: "RSVP", icon: Mail },
];

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
        <div className="flex flex-1 items-center justify-end gap-1 pr-2">
          <NotificationBell />
          <button
            aria-label="Toggle menu"
            className="flex items-center px-3 h-full text-burgundy"
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
      </div>

      {/* Desktop top bar */}
      <div className="hidden md:flex h-16 mx-auto max-w-6xl px-6 items-stretch justify-between">
        <Link to="/" className="flex items-center pr-4 font-script text-3xl text-burgundy">
          G &amp; N
        </Link>

        <div className="flex items-stretch">
          <nav className="flex items-stretch text-sm uppercase tracking-widest">
            {navLinks.map((link) => {
              const { label, icon: Icon } = link;
              const inner = (
                <span className="flex items-center gap-1.5 border-b border-transparent group-[.is-active]:border-burgundy pb-px">
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                  {label}
                </span>
              );
              if (link.href) {
                return (
                  <a
                    key={label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center px-3 text-ink/70 hover:text-burgundy transition-colors"
                  >
                    {inner}
                  </a>
                );
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group flex items-center px-3 text-ink/70 hover:text-burgundy transition-colors"
                  activeProps={{ className: "group flex items-center px-3 text-burgundy is-active" }}
                >
                  {inner}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center pl-2">
            <NotificationBell />
          </div>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-amber bg-cream">
          <div className="px-6 py-4 flex flex-col gap-3 text-sm uppercase tracking-widest">
            {navLinks.map((link) => {
              const { label, icon: Icon } = link;
              if (link.href) {
                return (
                  <a
                    key={label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-ink/70 hover:text-burgundy"
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                    {label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2.5 text-ink/70 hover:text-burgundy"
                  activeProps={{ className: "flex items-center gap-2.5 text-burgundy font-medium" }}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
