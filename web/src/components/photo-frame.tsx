import Image from "next/image";
import type { Photo } from "@/content/photos";

/**
 * Renders a real photograph when one exists, and an honest, visible gap when it
 * does not. Never a stock image, never an illustration pretending to be a photo.
 */
export function PhotoFrame({
  photo,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  ratio = "4 / 3",
}: {
  photo: Photo;
  priority?: boolean;
  sizes?: string;
  ratio?: string;
}) {
  if (!photo.src) {
    return (
      <figure className="photo-frame" style={{ aspectRatio: ratio }}>
        <div className="photo-missing">
          <span className="placeholder">
            <strong>Photo needed:</strong> {photo.alt}
          </span>
          <p className="hint">
            Add a real, licensed photograph to <code>public/photos/</code> and set
            its path in <code>src/content/photos.ts</code>.
          </p>
        </div>
      </figure>
    );
  }

  return (
    <figure className="photo-frame" style={{ aspectRatio: ratio }}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="photo-frame__img"
      />
      {(photo.caption || photo.credit) && (
        <figcaption className="photo-frame__caption">
          {photo.caption}
          {photo.credit ? ` · Photo: ${photo.credit}` : ""}
        </figcaption>
      )}
    </figure>
  );
}
