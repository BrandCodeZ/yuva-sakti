/**
 * Photography plan.
 *
 * The site ships with no invented or stock imagery. Every entry below has
 * `src: null`, which renders a visible "photo needed" frame instead of a fake
 * picture. Drop a real, licensed file into `web/public/photos/` and set `src`
 * to its path — nothing else changes.
 *
 * Requirements for each file:
 *  - real photograph, WebP or AVIF, under 200 KB at the size used
 *  - `alt` must describe the photo, not the layout
 *  - `credit` is the photographer or club, shown on hover/caption
 */
export interface Photo {
  src: string | null;
  alt: string;
  caption: string;
  credit: string | null;
}

export const heroPhoto: Photo = {
  src: null,
  alt: "Runners on a wide Delhi road at sunrise, mid-stride, seen from the front",
  caption: "Yuva Shakti Run, Delhi",
  credit: null,
};

export const chapterPhotos: Record<string, Photo> = {
  "02": {
    src: null,
    alt: "A group of runners from a Delhi running club stretching together before a morning run",
    caption: "Pacing groups train together before race day",
    credit: null,
  },
  "03": {
    src: null,
    alt: "A runner crossing a finish line and receiving a finisher medal",
    caption: "Every finisher gets a medal and a published result",
    credit: null,
  },
};

export const launchPhotos: Photo[] = [
  {
    src: null,
    alt: "Volunteers and runners at a Yuva Shakti Run launch meetup",
    caption: "Launch meetup",
    credit: null,
  },
  {
    src: null,
    alt: "A training run along the Yamuna river path",
    caption: "Training on the river path",
    credit: null,
  },
  {
    src: null,
    alt: "Young runners from a school team at a practice session",
    caption: "School team practice",
    credit: null,
  },
  {
    src: null,
    alt: "Delhi skyline at dawn behind a runner on the road",
    caption: "Where the run happens",
    credit: null,
  },
];

export const allPhotos = [heroPhoto, ...Object.values(chapterPhotos), ...launchPhotos];
