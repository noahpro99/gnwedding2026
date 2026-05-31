import { Leaf } from 'lucide-react'

export function LeafDivider() {
  return (
    <div className="flex items-center justify-center gap-3 text-gold">
      <span className="h-px w-12 bg-gold/60" />
      <Leaf className="w-4 h-4 -rotate-12" strokeWidth={1.5} />
      <span className="h-px w-12 bg-gold/60" />
    </div>
  )
}
