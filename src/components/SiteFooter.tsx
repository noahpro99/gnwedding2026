'use client'
import { Mail, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'

function CopyButton({
  value,
  icon: Icon,
  label,
}: {
  value: string
  icon: typeof Mail
  label: string
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    function reset() { setCopied(false) }
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
        className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full bg-olive/80 text-cream text-[10px] uppercase tracking-widest transition-colors"
      >
        <Icon className="w-3 h-3" strokeWidth={2} />
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
      className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-amber/60 text-ink/40 hover:border-burgundy hover:text-burgundy transition-colors"
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
    </button>
  )
}

export function SiteFooter() {
  return (
    <footer id="contact" className="mt-16 border-t border-amber/60 bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span className="font-script text-lg text-burgundy italic">Gwendolyn &amp; Noah</span>
        <span className="text-amber/60 text-xs">·</span>
        <span className="text-[11px] uppercase tracking-widest text-ink/45">October 25, 2026 · Beliveau Winery</span>
        <span className="text-amber/60 text-xs">·</span>
        <div className="flex items-center gap-2">
          <CopyButton value="noahpro@gmail.com" icon={Mail} label="Copy email" />
          <CopyButton value="5403156063" icon={Phone} label="Copy phone number" />
        </div>
      </div>
    </footer>
  )
}
