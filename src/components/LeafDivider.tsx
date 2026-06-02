import { Leaf } from 'lucide-react'

export function LeafDivider() {
  return (
    <div className="flex items-center justify-center gap-3 text-gold max-w-xs mx-auto">
      <span className="flex-1 h-px bg-gradient-to-l from-gold/55 to-transparent" />
      <span className="w-1 h-1 rounded-full bg-gold/50" />
      <Leaf className="w-4 h-4 -rotate-12 opacity-75" strokeWidth={1.5} />
      <span className="w-1 h-1 rounded-full bg-gold/50" />
      <span className="flex-1 h-px bg-gradient-to-r from-gold/55 to-transparent" />
    </div>
  )
}
