import { Images } from 'lucide-react'

const ALBUM_URL = 'https://photos.app.goo.gl/y36aLTqf3mL31vHx9'

export function PhotoAlbumButton({
  label = 'Open Album',
}: {
  label?: string
}) {
  return (
    <a
      href={ALBUM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 px-8 py-3 bg-burgundy text-cream uppercase tracking-widest text-sm rounded-full hover:bg-pumpkin transition-colors"
    >
      <Images className="w-5 h-5" strokeWidth={1.75} />
      <span>{label}</span>
    </a>
  )
}
