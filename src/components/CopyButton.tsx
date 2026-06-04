'use client'
import { type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

const SIZES = {
  sm: {
    button: 'w-7 h-7',
    icon: 'w-3.5 h-3.5',
    pill: 'h-7 px-3 text-[10px] gap-1.5',
    pillIcon: 'w-3 h-3',
  },
  md: {
    button: 'w-10 h-10',
    icon: 'w-4 h-4',
    pill: 'h-10 px-4 text-xs gap-2',
    pillIcon: 'w-3.5 h-3.5',
  },
} as const

export function CopyButton({
  value,
  icon: Icon,
  label,
  size = 'sm',
}: {
  value: string
  icon: LucideIcon
  label: string
  size?: keyof typeof SIZES
}) {
  const [copied, setCopied] = useState(false)
  const s = SIZES[size]

  useEffect(() => {
    if (!copied) return
    function reset() {
      setCopied(false)
    }
    document.addEventListener('click', reset, { once: true })
    return () => document.removeEventListener('click', reset)
  }, [copied])

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard.writeText(value).then(() => setCopied(true))
  }

  if (copied) {
    return (
      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        className={`inline-flex items-center rounded-full bg-olive/80 text-cream uppercase tracking-widest transition-colors ${s.pill}`}
      >
        <Icon className={s.pillIcon} strokeWidth={2} />
        Copied
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-full border border-amber/60 text-ink/40 hover:border-burgundy hover:text-burgundy transition-colors ${s.button}`}
    >
      <Icon className={s.icon} strokeWidth={1.75} />
    </button>
  )
}
