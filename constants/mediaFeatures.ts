export type MediaFeatureItem = {
  id?: string;
  number: string;
  title: string;
  description: string;
  source: string;
  href?: string;
  image?: string;
  imageAlt: string;
};

export type MediaFeaturesPageData = {
  label: string;
  eyebrow: string;
  description: string;
  items: MediaFeatureItem[];
};

export const mediaFeaturesPageData: MediaFeaturesPageData = {
  label: "Media Features",
  eyebrow: "Published in media",
  description:
    "Selected conversations, profiles, and appearances published by newspapers, magazines, and media platforms.",
  items: [
    {
      number: "01",
      title: "Nepal Khabar",
      description: "Add a short introduction to this published media feature.",
      source: "Publication name",
      href: "https://www.nepalkhabar.com/entertainment/201403-2024-5-22-8-22-38",
      image: "/images/media-features/nepal-khabar.jpg",
      imageAlt: "Placeholder for the Nepal Khabar media feature",
    },
    {
      number: "02",
      title: "Sahitya Post",
      description: "Briefly explain the subject and where it was published.",
      source: "Media platform",
      href: "https://archive.sahityapost.com/tag/%e0%a4%b5%e0%a4%bf%e0%a4%9c%e0%a4%af-%e0%a4%b2%e0%a5%81%e0%a4%87%e0%a4%9f%e0%a5%87%e0%a4%b2/",
      image: "/images/media-features/sahitya-post.png",
      imageAlt: "Placeholder for the Sahitya Post media feature",
    },
    {
      number: "03",
      title: "Setopati",
      description: "Add a concise description before pasting the external link.",
      source: "Publication name",
      href: "https://www.setopati.com/author/1152",
      image: "/images/media-features/setopati.svg",
      imageAlt: "Placeholder for the Setopati media feature",
    },
  ],
};
