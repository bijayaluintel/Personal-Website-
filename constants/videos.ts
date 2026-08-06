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
  channel?: {
    href: string;
    handle: string;
  };
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
  {
    slug: "youtube-channel",
    label: "YouTube Channel",
    eyebrow: "Latest from the channel",
    description:
      "Original poems, spoken-word performances, conversations, and stories from Bijaya Luintel.",
    channel: {
      href: "https://www.youtube.com/@bijayaluintel",
      handle: "@bijayaluintel",
    },
    items: [
      { number: "01", title: "A call for Unity — Sunsari Nepal", description: "A reflection on humanity, harmony, and the strength found in unity.", source: "Latest short", href: "https://www.youtube.com/shorts/bNYxvF-Lv78", thumbnailAlt: "A call for Unity video thumbnail" },
      { number: "02", title: "धुवाँ", description: "An original Nepali poem presented in a short video.", source: "Nepali poetry", href: "https://www.youtube.com/shorts/qXoGt60s4uQ", thumbnailAlt: "धुवाँ Nepali poem video thumbnail" },
      { number: "03", title: "Nepali Poem on Friendship", description: "A heartfelt Nepali poem about friendship and connection.", source: "Nepali poetry", href: "https://www.youtube.com/shorts/2vTkuEigRtM", thumbnailAlt: "Nepali friendship poem video thumbnail" },
      { number: "04", title: "उमेर — The Art of Crying", description: "An original poem written and performed by Bijaya Luintel.", source: "Spoken word", href: "https://www.youtube.com/shorts/Kv4TcZFtim0", thumbnailAlt: "उमेर poem video thumbnail" },
      { number: "05", title: "आँखाहरू", description: "A short Nepali poetry performance about eyes, love, and feeling.", source: "Nepali poetry", href: "https://www.youtube.com/shorts/wBdkhuiwcCc", thumbnailAlt: "आँखाहरू poem video thumbnail" },
      { number: "06", title: "यात्रामा जिन्दगीको", description: "Nepali spoken-word poetry about time, travel, and moments that pass.", source: "Spoken word", href: "https://www.youtube.com/watch?v=3IXwEaB9ptc", thumbnailAlt: "यात्रामा जिन्दगीको video thumbnail" },
      { number: "07", title: "मेटिँदो रहेछ प्रेम", description: "A poem about love slowly fading through time, silence, and distance.", source: "Poetry short", href: "https://www.youtube.com/shorts/EDCJu5-Y6YM", thumbnailAlt: "मेटिँदो रहेछ प्रेम video thumbnail" },
      { number: "08", title: "नयाँ बर्ष — New Year Poem", description: "A Nepali poem welcoming a new year and a fresh beginning.", source: "Poetry short", href: "https://www.youtube.com/shorts/SLoFJp_Inbo", thumbnailAlt: "New Year poem video thumbnail" },
      { number: "09", title: "तिम्रा याद", description: "A short Nepali love poem by Bijaya Luintel.", source: "Love poem", href: "https://www.youtube.com/shorts/tAU4jX8HQdU", thumbnailAlt: "तिम्रा याद love poem video thumbnail" },
      { number: "10", title: "सम्झनाहरु", description: "A motivational Nepali poem about memories and moving forward.", source: "Motivational poem", href: "https://www.youtube.com/shorts/jceeJtB_DMY", thumbnailAlt: "सम्झनाहरु poem video thumbnail" },
      { number: "11", title: "झरी — एक प्रेम कविता", description: "A love poem shaped by rain and the mood of the monsoon.", source: "Love poem", href: "https://www.youtube.com/shorts/kWTX-WNp3C8", thumbnailAlt: "झरी love poem video thumbnail" },
      { number: "12", title: "My Friend Got Married — गफगाफ", description: "A conversation about emotional bonds, love, and beginning married life.", source: "Conversation", href: "https://www.youtube.com/watch?v=xQeT999FPF0", thumbnailAlt: "My Friend Got Married video thumbnail" },
      { number: "13", title: "How Life Should Be Lived", description: "A Nepali poem reflecting on honesty, kindness, choices, and meaningful living.", source: "Life poem", href: "https://www.youtube.com/watch?v=uiguSuyEp_A", thumbnailAlt: "How Life Should Be Lived video thumbnail" },
      { number: "14", title: "Nepali Love Poem", description: "An original romantic poem written and performed in Nepali.", source: "Love poem", href: "https://www.youtube.com/shorts/ahm5UjCYZvA", thumbnailAlt: "Nepali Love Poem video thumbnail" },
      { number: "15", title: "How I Published My First Poetry Book", description: "The story behind Samayaka Khukula Chappal and the writer's self-publishing journey.", source: "Writing journey", href: "https://www.youtube.com/watch?v=fCU-4prZB2s", thumbnailAlt: "First poetry book publishing video thumbnail" },
    ],
  },
];

export function getVideoCategory(slug: string) {
  return videoCategories.find((category) => category.slug === slug);
}

const videoCategoryNavigationOrder = [
  "poetry-performances",
  "podcasts",
  "documentaries",
  "youtube-channel",
];

export function getVideoCategoryNavigation() {
  return videoCategoryNavigationOrder.flatMap((slug) => {
    const category = getVideoCategory(slug);
    return category ? [category] : [];
  });
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
