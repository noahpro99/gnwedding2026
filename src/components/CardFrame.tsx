import type { ReactNode } from "react";

/**
 * A decorative card layout: PNG overlay (the floral / border art) sits on top
 * of a cream card. Drop your decoration PNG at /public/card-frame.png with a
 * transparent center.
 */
export function CardFrame({
  children,
  frameSrc = "/card-frame.png",
}: {
  children: ReactNode;
  frameSrc?: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-2xl aspect-[3/4] bg-cream rounded-3xl shadow-2xl shadow-walnut/20">
      <div className="absolute inset-0 flex items-center justify-center p-12 md:p-16 text-center">
        <div className="w-full">{children}</div>
      </div>
      <img
        src={frameSrc}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
