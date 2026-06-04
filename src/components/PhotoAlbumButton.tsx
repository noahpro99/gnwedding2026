import { siGooglephotos } from "simple-icons";

const ALBUM_URL = "https://photos.app.goo.gl/y36aLTqf3mL31vHx9";

export function PhotoAlbumButton({
  label = "Open Google Photos Album",
}: {
  label?: string;
}) {
  return (
    <a
      href={ALBUM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 px-8 py-3 bg-burgundy text-cream uppercase tracking-widest text-sm rounded-full hover:bg-pumpkin transition-colors"
    >
      <svg
        role="img"
        viewBox="0 0 24 24"
        className="w-5 h-5 fill-current"
        aria-hidden="true"
      >
        <path d={siGooglephotos.path} />
      </svg>
      <span>{label}</span>
    </a>
  );
}
