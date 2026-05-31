import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function SectionHeader({
  eyebrow,
  title,
  icon: Icon,
  children,
}: {
  eyebrow?: string
  title: string
  icon?: LucideIcon
  children?: ReactNode
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      {eyebrow && (
        <p className="uppercase text-xs tracking-[0.3em] text-gold mb-3">
          {eyebrow}
        </p>
      )}
      {Icon && (
        <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-parchment border border-amber text-burgundy">
          <Icon className="w-6 h-6" strokeWidth={1.5} />
        </div>
      )}
      <h1 className="font-script text-5xl md:text-6xl text-burgundy">
        {title}
      </h1>
      {children && <div className="mt-6 text-ink/80 leading-relaxed">{children}</div>}
    </div>
  )
}
