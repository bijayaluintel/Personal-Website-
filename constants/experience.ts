export type ExperienceItem = {
  id?: string;
  period: string;
  title: string;
  organization: string;
  location: string;
  description: string;
  highlights: string[];
};

export const experiencePageData = {
  hero: {
    eyebrow: "Journey so far",
    title: "Experience",
  },
  experiences: [
    {
      period: "Mar 2023 — Sep 2023",
      title: "Copywriter",
      organization: "Max Media Pvt. Ltd.",
      location: "Full-time",
      description:
        "Created advertising and social-media copy, promotional video scripts, brand messaging, taglines, and product-packaging content while collaborating closely with designers.",
      highlights: ["Ad copywriting", "Video scriptwriting", "Brand messaging"],
    },
    {
      period: "Jan 2021 — Sep 2023",
      title: "Travel Writer",
      organization: "Nepal 8th Wonder",
      location: "Kathmandu, Bāgmatī, Nepal · On-site",
      description:
        "Turned firsthand journeys into engaging travel narratives through destination research, fact-checking, on-site observation, and close collaboration with documentary production teams.",
      highlights: ["Travel writing", "Research & fact-checking", "Documentary collaboration"],
    },
    {
      period: "May 2021",
      title: "Freelance Translator",
      organization: "Freelance",
      location: "Hybrid",
      description:
        "Translated a documentary related to the teaching of Wu Wei, The Art of Effortless Living, for a Nepali-speaking audience.",
      highlights: ["Documentary translation", "Research", "Nepali adaptation"],
    },
    {
      period: "2019 — 2021",
      title: "Branding and Communication Officer",
      organization: "Inside Himalayas",
      location: "Kathmandu, Bāgmatī, Nepal",
      description:
        "Planned website content, coordinated magazine production, created multi-platform brand content, managed social media, and supported media relations, internal communication, and events.",
      highlights: ["Content planning", "Magazine production", "Brand communication"],
    },
    {
      period: "2019 — 2021",
      title: "Branding & Communication Officer",
      organization: "Royal Mountain Travel — Nepal",
      location: "Kathmandu, Bāgmatī, Nepal · On-site",
      description:
        "Produced content for websites, social media, blogs, and marketing materials while managing audience engagement, public relations, internal communications, and promotional events.",
      highlights: ["Web content writing", "Social media", "Public relations"],
    },
  ] satisfies ExperienceItem[],
};
