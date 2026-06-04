import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { LeafDivider } from "./LeafDivider";

export function SectionHeader({
  eyebrow,
  title,
  icon: Icon,
  children,
}: {
  eyebrow?: string;
  title: string;
  icon?: LucideIcon;
  children?: ReactNode;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      {eyebrow && (
        <p className="uppercase text-xs tracking-[0.3em] text-gold mb-3">
          {eyebrow}
        </p>
      )}
      {Icon && (
        <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-parchment border border-amber text-burgundy shadow-[0_4px_14px_rgba(92,58,34,0.12),0_1px_0_rgba(255,255,255,0.6)_inset]">
          <Icon className="w-6 h-6" strokeWidth={1.5} />
        </div>
      )}
      <h1 className="font-script text-5xl md:text-6xl text-burgundy">
        {title}
      </h1>
      <div className="mt-5 mb-1">
        <LeafDivider />
      </div>
      {children && (
        <div className="mt-5 text-ink/80 leading-relaxed">{children}</div>
      )}
    </div>
  );
}
