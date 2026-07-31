export type PortfolioVideo = {
  number: string;
  title: string;
  description: string;
  source: string;
  href?: string;
  thumbnail?: string;
  thumbnailAlt: string;
};

/*
 * HOW TO ADD WORK VIDEOS
 *
 * Add items to the appropriate array below.
 * YouTube links generate their thumbnails automatically.
 * For other platforms, put an image in public/images/work/ and add:
 *   thumbnail: "/images/work/your-thumbnail.jpg",
 */
export const workPortfolioData = {
  introduction: {
    eyebrow: "Selected portfolio",
    title: "Stories made for the screen.",
    description:
      "A selection of scripts, translations, and collaborations shaped for different voices, audiences, and formats.",
  },
  scriptwriting: {
    eyebrow: "Scriptwriting",
    title: "Travel scripts",
    description:
      "Narrative-led travel videos that bring together place, people, history, and the feeling of a journey.",
    videos: [
      {
        number: "01",
        title: "Featured travel script",
        description: "Add the destination and a short note about this scripted journey.",
        source: "Travel series",
        thumbnailAlt: "Placeholder for the featured travel script",
      },
      {
        number: "02",
        title: "Travel script title",
        description: "A concise introduction to the place and story.",
        source: "Travel series",
        thumbnailAlt: "Placeholder for a travel script",
      },
      {
        number: "03",
        title: "Journey title",
        description: "Add a short description of this scripted video.",
        source: "Travel series",
        thumbnailAlt: "Placeholder for a scripted journey",
      },
      {
        number: "04",
        title: "Place and people",
        description: "Introduce the destination, people, or central idea.",
        source: "Travel series",
        thumbnailAlt: "Placeholder for a travel story",
      },
      {
        number: "05",
        title: "Travel film title",
        description: "Describe this travel film in one or two short sentences.",
        source: "Travel series",
        thumbnailAlt: "Placeholder for a travel film",
      },
      {
        number: "06",
        title: "Scripted journey",
        description: "Add the location and context for this journey.",
        source: "Travel series",
        thumbnailAlt: "Placeholder for a scripted travel video",
      },
      {
        number: "07",
        title: "On the road",
        description: "Add a short note about the writing behind this video.",
        source: "Travel series",
        thumbnailAlt: "Placeholder for a travel video",
      },
    ] satisfies PortfolioVideo[],
  },
  translation: {
    eyebrow: "Translation",
    title: "Across languages",
    description:
      "Translation work that carries meaning, emotion, and cultural texture between Nepali and English.",
    videos: [
      {
        number: "01",
        title: "Translation project",
        description: "Add a short description of the translation and its context.",
        source: "Translation",
        thumbnailAlt: "Placeholder for the translation project",
      },
    ] satisfies PortfolioVideo[],
  },
  brandCollaborations: {
    eyebrow: "Brand collaboration",
    title: "Stories with purpose",
    description:
      "Selected partnerships where brand voice and human storytelling meet naturally.",
    videos: [
      {
        number: "01",
        title: "Brand collaboration",
        description: "Introduce the campaign, partner, and creative contribution.",
        source: "Campaign partner",
        thumbnailAlt: "Placeholder for a brand collaboration",
      },
      {
        number: "02",
        title: "Campaign story",
        description: "Add a concise description of this collaboration.",
        source: "Brand partner",
        thumbnailAlt: "Placeholder for a campaign story",
      },
    ] satisfies PortfolioVideo[],
  },
};
