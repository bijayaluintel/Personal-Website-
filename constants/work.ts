export type Service = {
  key: "scriptwriting" | "copywriting" | "songwriting" | "translations" | "brand-collaborations";
  number: string;
  title: string;
  description: string;
  details: string[];
};

export const workPageData = {
  hero: {
    eyebrow: "Work & collaboration",
    title: "Work & Collaboration",
  },
  services: [
    {
      key: "scriptwriting",
      number: "01",
      title: "Scriptwriting",
      description:
        "Narrative writing built for the screen, the ear, and the moment.",
      details: ["Screenplays", "Documentary narration", "Video scripts"],
    },
    {
      key: "copywriting",
      number: "02",
      title: "Copywriting",
      description:
        "Distinctive language that gives brands and ideas a memorable voice.",
      details: ["Brand storytelling", "Creative campaigns", "Web copy"],
    },
    {
      key: "songwriting",
      number: "03",
      title: "Songwriting",
      description:
        "Lyrics with emotional clarity, musicality, and room to breathe.",
      details: ["Musical tracks", "Acoustic pieces", "Spoken-word fusion"],
    },
    {
      key: "translations",
      number: "04",
      title: "Translations",
      description:
        "Thoughtful English and Nepali translation that preserves tone and intent.",
      details: ["Poetry", "Prose", "Media"],
    },
    {
      key: "brand-collaborations",
      number: "05",
      title: "Brand collaborations",
      description:
        "Creative partnerships grounded in shared values and meaningful stories.",
      details: ["Sponsored content", "Creative partnerships", "Judgements"],
    },
  ] satisfies Service[],
  collaboration: {
    eyebrow: "Have a project in mind?",
    title: "Let’s make something that stays with people.",
    description:
      "For commissions, script development, song lyrics, translation projects, or thoughtful brand collaborations, share a little about what you are building.",
  },
};
