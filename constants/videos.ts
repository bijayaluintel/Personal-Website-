export type VideoItem = {
  number: string;
  title: string;
  description: string;
  source: string;
  href?: string;
  thumbnail?: string;
  thumbnailAlt: string;
};

export type VideoCategory = {
  slug: string;
  label: string;
  eyebrow: string;
  description: string;
  items: VideoItem[];
};

/*
 * HOW TO ADD A VIDEO OR MEDIA LINK
 *
 * Edit an item below:
 *   title: "Your title",
 *   description: "A short description",
 *   source: "YouTube / Podcast name / Publication",
 *   href: "https://...",
 *
 * YouTube thumbnails are generated automatically from `href`.
 * For other websites, put an image in public/images/videos/ and add:
 *   thumbnail: "/images/videos/your-thumbnail.jpg",
 */
export const videoCategories: VideoCategory[] = [
  {
    slug: "podcasts",
    label: "Podcasts & Interviews",
    eyebrow: "Listen & watch",
    description:
      "Long-form conversations about writing, creativity, literature, and the everyday.",
    items: [
      {
        number: "01",
        title: "Sushant Pradhan Podcast",
        description: "Introduce the conversation, its host, and central subject.",
        source: "Podcast name",
        href: "https://www.youtube.com/watch?v=d_mfrQT4dfY",
        thumbnailAlt: "Placeholder for the podcast episode",
      },
      {
        number: "02",
        title: "Khali Pristha",
        description: "Add a short note about this podcast appearance.",
        source: "Podcast platform",
        href: "https://www.youtube.com/watch?v=okxclN7TDQU",
        thumbnailAlt: "Placeholder for the podcast conversation",
      },
      {
        number: "03",
        title: "The Pen Speaks",
        description: "Describe what listeners can expect from the episode.",
        source: "Podcast name",
        href: "https://www.youtube.com/watch?v=j-pP0Z-MX_8",
        thumbnailAlt: "Placeholder for the interview episode",
      },
      {
        number: "04",
        title: "MNM Nepal",
        description: "Describe what listeners can expect from the episode.",
        source: "Podcast name",
        href: "https://www.youtube.com/watch?v=WhIkqVdLSMk",
        thumbnailAlt: "Placeholder for the interview episode",
      },
      {
        number: "05",
        title: "Sahitya Post",
        description: "Describe what listeners can expect from the episode.",
        source: "Podcast name",
        href: "https://www.youtube.com/watch?v=xZWdjH4yPOo",
        thumbnailAlt: "Placeholder for the interview episode",
      },
      {
        number: "06",
        title: "Space 4k Television",
        description: "Describe what listeners can expect from the episode.",
        source: "Podcast name",
        href: "https://www.youtube.com/watch?v=Hh1c11l7lo0",
        thumbnailAlt: "Placeholder for the interview episode",
      },
    ],
  },
  {
    slug: "poetry-performances",
    label: "Poetry & Performances",
    eyebrow: "Poetry in voice",
    description:
      "Poems carried beyond the page through live readings, stages, and recorded performances.",
    items: [
      {
        number: "01",
        title: "पदयात्रा र जीवन : Episode 16 The Poet Idol Season 2",
        description: "Add the poem, event, venue, or occasion behind this performance.",
        source: "YouTube / Event",
        href: "https://www.youtube.com/watch?v=UtxeOJN5guU",
        thumbnailAlt: "Placeholder for the poetry performance",
      },
      {
        number: "02",
        title: "कति कुराहरु अधुरै रहे : Laltin Poetry Session",
        description: "Briefly introduce this reading and its setting.",
        source: "Performance venue",
        href: "https://www.youtube.com/watch?v=kUNsuq6yK6E&list=RDkUNsuq6yK6E&start_radio=1",
        thumbnailAlt: "Placeholder for the live poetry reading",
      },
      {
        number: "03",
        title: "परदेशिएका साथीहरुलाई : Laltin Poetry Session",
        description: "Add a short description before entering the video link.",
        source: "YouTube / Event",
        href: "https://www.youtube.com/watch?v=Csn9oQiPjBY&list=RDCsn9oQiPjBY&start_radio=1",
        thumbnailAlt: "Placeholder for the spoken-word performance",
      },
      {
        number: "04",
        title: "आँगनको गर्त : The poet Idol season 2 Episode 7",
        description: "Add a short description before entering the video link.",
        source: "YouTube / Event",
        href: "https://youtu.be/976Cvfvc8MU?t=2925",
        thumbnailAlt: "Placeholder for the spoken-word performance",
      },
      {
        number: "05",
        title: "आमा गणित : The poet idol Season 2 Episode 11",
        description: "Add a short description before entering the video link.",
        source: "YouTube / Event",
        href: "https://youtu.be/Ely243DjSME?t=2415",
        thumbnailAlt: "Placeholder for the spoken-word performance",
      },
      {
        number: "06",
        title: "अस्तित्वको घाम छायाँ : The poet Idol Season 2 Episode 21",
        description: "Add a short description before entering the video link.",
        source: "YouTube / Event",
        href: "https://youtu.be/wKidsv6qd2Q?t=1140",
        thumbnailAlt: "Placeholder for the spoken-word performance",
      },
    ],
  },
  {
    slug: "documentaries",
    label: "Documentaries",
    eyebrow: "Stories in depth",
    description:
      "Documentary films exploring people, places, ideas, and stories with depth and attention.",
    items: [
      {
        number: "01",
        title: "Nuwakot Bull Fight : Voiceover | Script | Direction",
        description: "Introduce the subject and story explored in this documentary.",
        source: "YouTube / Documentary series",
        href: "https://www.youtube.com/watch?v=iJ1gNck8YEk",
        thumbnailAlt: "Placeholder for the documentary",
      },
    ],
  },
];

export function getVideoCategory(slug: string) {
  return videoCategories.find((category) => category.slug === slug);
}

export function getYouTubeThumbnail(href?: string) {
  if (!href) return null;

  try {
    const url = new URL(href);
    let id: string | null = null;

    if (url.hostname === "youtu.be") id = url.pathname.slice(1);
    if (url.hostname.includes("youtube.com")) {
      id = url.searchParams.get("v");
      if (!id && (url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/"))) {
        id = url.pathname.split("/")[2] ?? null;
      }
    }

    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
  } catch {
    return null;
  }
}
