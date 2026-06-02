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
        className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-olive/80 text-cream text-xs uppercase tracking-widest transition-colors"
      >
        <Icon className="w-3.5 h-3.5" strokeWidth={2} />
        Copied to clipboard
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-amber text-ink/50 hover:border-burgundy hover:text-burgundy transition-colors"
    >
      <Icon className="w-4 h-4" strokeWidth={1.75} />
    </button>
  )
}

export function SiteFooter() {
  return (
    <footer id="contact" className="mt-24 border-t border-amber bg-cream shadow-[0_-4px_32px_rgba(92,58,34,0.06)]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="text-center">
          <p className="font-script text-3xl text-burgundy">Gwendolyn &amp; Noah</p>
          <p className="mt-2 text-sm text-ink/60 tracking-widest uppercase">
            October 25, 2026 · Beliveau Winery
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="text-xs uppercase tracking-widest text-ink/50">Contact us</span>
            <CopyButton value="noahpro@gmail.com" icon={Mail} label="Copy email" />
            <CopyButton value="5403156063" icon={Phone} label="Copy phone number" />
          </div>
        </div>
      </div>
    </footer>
  )
}
