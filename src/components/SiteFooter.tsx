import { Mail, Phone } from 'lucide-react'
import { CopyButton } from './CopyButton'

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
