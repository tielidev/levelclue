export const game = {
  name: "Signal Box",
  slug: "signal-box",
  unitLabel: "Level",
  description: "A fictional puzzle game used to demonstrate title-aware walkthrough architecture.",
  image: "/assets/signal-box.svg"
};

export const guides = [
  {
    number: 1,
    title: "Wake the Station",
    answer: "Turn the brass dial clockwise, then pull the illuminated lever.",
    steps: [
      "Tap the note beside the dial and read the clockwise arrow.",
      "Rotate the brass dial until the two white marks meet.",
      "Pull the lever after its indicator changes from red to green."
    ],
    keywords: ["wake station", "brass dial", "first lever"],
    image: "/assets/signal-box.svg",
    imageAlt: "Original illustration of a brass signal box control panel",
    updatedAt: "2026-10-01"
  },
  {
    number: 2,
    title: "The Silent Bell",
    answer: "Use the three switches in short-long-short order before pressing the bell.",
    steps: [
      "Read the dash-and-dot pattern on the ticket: short, long, short.",
      "Move the left switch once, hold the center switch, then move the right switch once.",
      "Press the bell while all three indicator lights are on."
    ],
    keywords: ["silent bell", "switch order", "ticket code"],
    image: "/assets/signal-box.svg",
    imageAlt: "Original illustration of a signal box panel with switches and a bell",
    updatedAt: "2026-10-01"
  }
];

