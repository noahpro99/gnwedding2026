/**
 * Monochrome marks for the black-tie bachelor pages. Everything draws in
 * `currentColor` so a mark reads black on the white shirt or silver on black.
 */

export function BowTie({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 60" className={className} aria-hidden="true" fill="currentColor">
      <path d="M64 30 L18 8 C13 6 8 8 8 14 v32 c0 6 5 8 10 6 L64 30 Z" />
      <path d="M76 30 L122 8 c5-2 10 0 10 6 v32 c0 6-5 8-10 6 L76 30 Z" />
      <rect x="60" y="18" width="20" height="24" rx="3" />
    </svg>
  );
}

export function WhiskeyGlass({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 72"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    >
      {/* tumbler */}
      <path d="M12 8 H52 L47 62 A4 4 0 0 1 43 66 H21 A4 4 0 0 1 17 62 Z" />
      {/* whiskey fill */}
      <path d="M15 34 H49 L46 60 A3 3 0 0 1 43 63 H21 A3 3 0 0 1 18 60 Z" fill="currentColor" opacity="0.16" />
      <line x1="15" y1="34" x2="49" y2="34" />
      {/* ice cube */}
      <rect x="26" y="40" width="13" height="13" rx="1.5" />
    </svg>
  );
}

export function PokerChips({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 72"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <circle cx="36" cy="36" r="26" />
      <circle cx="36" cy="36" r="15" strokeWidth="2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={36 + Math.cos(r) * 26}
            y1={36 + Math.sin(r) * 26}
            x2={36 + Math.cos(r) * 20}
            y2={36 + Math.sin(r) * 20}
            strokeWidth="4"
          />
        );
      })}
    </svg>
  );
}

export function PlayingCards({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 72"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinejoin="round"
    >
      <rect x="8" y="16" width="34" height="48" rx="4" transform="rotate(-12 25 40)" />
      <g transform="rotate(10 44 38)">
        <rect x="30" y="12" width="34" height="48" rx="4" fill="currentColor" fillOpacity="0.05" />
        {/* ace of spades */}
        <path
          d="M47 26 C 53 32 59 36 59 42 a5 5 0 0 1 -9 1.4 c 0.7 3 1.6 4 3 6.6 h -12 c 1.4 -2.6 2.3 -3.6 3 -6.6 a5 5 0 0 1 -9 -1.4 c 0 -6 6 -10 12 -16 Z"
          fill="currentColor"
          stroke="none"
        />
        <path d="M36 20 l0 0" strokeLinecap="round" strokeWidth="0" />
      </g>
    </svg>
  );
}
