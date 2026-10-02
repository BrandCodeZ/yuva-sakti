export interface Chapter {
  index: string;
  title: string;
  body: string;
  /** Layout hint so the three chapters do not read as three identical cards. */
  layout: "wide" | "split" | "photo";
}

export const whyWeRun: Chapter[] = [
  {
    index: "01",
    title: "Run for youth",
    body: "Delhi builds for cars, not for people on foot. Yuva Shakti Run takes one morning back for the people who run, walk and train on those same roads. Three distances so a first-timer and a regular can start on the same start line.",
    layout: "wide",
  },
  {
    index: "02",
    title: "Run together",
    body: "Nobody signs up alone. Pacing groups, running clubs and school teams train for this one. If you do not know a single runner yet, you will by the finish line.",
    layout: "split",
  },
  {
    index: "03",
    title: "Run stronger",
    body: "We publish every finish time, every result and a certificate you can actually use. No invented participant counts, no prize money we cannot pay. What we commit to, we publish.",
    layout: "photo",
  },
];
