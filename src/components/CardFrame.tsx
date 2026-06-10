import type { ReactNode } from "react";

export function CardFrame({
  children,
  frameSrc = "/images/border.png",
}: {
  children: ReactNode;
  frameSrc?: string;
}) {
  return (
    <div
      className="relative bg-parchment shadow-card rounded-sm animate-fall-in"
      style={{
        width: "min(90vw, calc(90svh * 5 / 7))",
        aspectRatio: "5 / 7",
        containerType: "inline-size",
      }}
    >
      <img
        src={frameSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        style={{ objectFit: "fill", zIndex: 10, mixBlendMode: "multiply" }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center text-center"
        style={{ padding: "15% 17%", zIndex: 20 }}
      >
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
