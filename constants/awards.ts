export type AwardItem = {
  id?: string;
  number: string;
  year: string;
  title: string;
  organization: string;
  description: string;
  image?: string;
  imageAlt: string;
};

/*
 * HOW TO ADD AN AWARD
 *
 * 1. Put the photograph in: public/images/awards/
 * 2. Uncomment the award's `image` field and use:
 *      image: "/images/awards/your-file-name.jpg",
 * 3. Replace `title`, `year`, `organization`, and `description`.
 * 4. Write `imageAlt` as a short description of what is visible.
 *
 * If `image` is omitted, the awards page displays a photo placeholder.
 */
export const awardsPageData = {
  hero: {
    eyebrow: "Awards & recognition",
    title: "Honours along the way.",
  },
  awards: [
    {
      number: "01",
      year: "Year",
      title: "Finalist The Poet Idol Season 2",
      organization: "The Poet Idol",
      description:
        "Add a short description of the award, the work it recognised, and why this moment was meaningful.",
      image: "/images/awards/Finalist The Poet Idol Season 2.jpg",
      imageAlt: "Placeholder for the first award photograph",
    },
    {
      number: "02",
      year: "Year",
      title: "Performance of the Week",
      organization: "The Poet Idol",
      description:
        "Use this space for the story behind the recognition, including the project, category, or contribution being celebrated.",
      image: "/images/awards/Performance of the Week.png",
      imageAlt: "Placeholder for the second award photograph",
    },
    {
      number: "03",
      year: "Year",
      title: "Line of the Week",
      organization: "The Poet Idol",
      description:
        "A concise note can explain the occasion, its significance, and the people or community connected to it.",
      image: "/images/awards/Line of the Week.png",
      imageAlt: "Placeholder for the third award photograph",
    },
    {
      number: "04",
      year: "Year",
      title: "Line of the Week 1",
      organization: "The Poet Idol",
      description:
        "A concise note can explain the occasion, its significance, and the people or community connected to it.",
      image: "/images/awards/Line of the Week 1.png",
      imageAlt: "Placeholder for the fourth award photograph",
    },
    {
      number: "05",
      year: "Year",
      title: "Line of the Week 2",
      organization: "The Poet Idol",
      description:
        "A concise note can explain the occasion, its significance, and the people or community connected to it.",
      image: "/images/awards/Line of the Week 2.png",
      imageAlt: "Placeholder for the fifth award photograph",
    },
    {
      number: "06",
      year: "Year",
      title: "Line of the Week 3",
      organization: "The Poet Idol",
      description:
        "A concise note can explain the occasion, its significance, and the people or community connected to it.",
      image: "/images/awards/Line of the Week Poet Idol Season 2.png",
      imageAlt: "Placeholder for the sixth award photograph",
    },
  ] satisfies AwardItem[],
};
