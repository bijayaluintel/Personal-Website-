export type PortfolioVideo = {
  mediaType?: "video" | "image";
  number: string;
  title: string;
  description: string;
  source: string;
  href?: string;
  thumbnail?: string;
  thumbnailAlt: string;
};

/*
 * HOW TO ADD WORK MEDIA
 *
 * Add items to the appropriate array below.
 * YouTube links generate their thumbnails automatically.
 * For other platforms, put an image in public/images/work/ and add:
 *   thumbnail: "/images/work/your-thumbnail.jpg",
 *
 * Brand collaborations can be either video or image. For an image, add:
 *   mediaType: "image",
 *   thumbnail: "/images/work/your-campaign.jpg",
 * `href` is optional for images; use it when the image should open a project link.
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
        title: "Winter in Manang",
        description: "Add the destination and a short note about this scripted journey.",
        source: "Travel series",
        href: "https://www.youtube.com/watch?v=lBjh2tzVNTU",
        thumbnailAlt: "Placeholder for the featured travel script",
      },
      {
        number: "02",
        title: "Road Trip to Bardiya",
        description: "A concise introduction to the place and story.",
        source: "Travel series",
        href: "https://www.youtube.com/watch?v=zD3v5rRXsN0",
        thumbnailAlt: "Placeholder for a travel script",
      },
      {
        number: "03",
        title: "Mustang, Lete during Lockdown",
        description: "Add a short description of this scripted video.",
        source: "Travel series",
        href: "https://www.youtube.com/watch?v=5cISumPvzNg",
        thumbnailAlt: "Placeholder for a scripted journey",
      },
      {
        number: "04",
        title: "Janakpur, East Nepal",
        description: "Introduce the destination, people, or central idea.",
        source: "Travel series",
        href: "https://www.youtube.com/watch?v=JpKTuuXnTa8",
        thumbnailAlt: "Placeholder for a travel story",
      },
      {
        number: "05",
        title: "Shree Antu",
        description: "Describe this travel film in one or two short sentences.",
        source: "Travel series",
        href: "https://www.youtube.com/watch?v=wo49Dd5tiDE",
        thumbnailAlt: "Placeholder for a travel film",
      },
      {
        number: "06",
        title: "Sandakpur | Nepal - India border at 3636M",
        description: "Add the location and context for this journey.",
        source: "Travel series",
        href: "https://www.youtube.com/watch?v=XPPBsZTweAE",
        thumbnailAlt: "Placeholder for a scripted travel video",
      },
      {
        number: "07",
        title: "SHEY PHOKSUNDO LAKE",
        description: "Add a short note about the writing behind this video.",
        source: "Travel series",
        href: "https://www.youtube.com/watch?v=K3NSty1-xpw",
        thumbnailAlt: "Placeholder for a travel video",
      },
      {
        number: "08",
        title: "DHARAN, BASANTAPUR & BARA",
        description: "Add a short note about the writing behind this video.",
        source: "Travel series",
        href: "https://www.youtube.com/@nepal8thwonder/videos",
        thumbnailAlt: "Placeholder for a travel video",
      },
      {
        number: "09",
        title: "DHORPATAN | JALJAL",
        description: "Add a short note about the writing behind this video.",
        source: "Travel series",
        href: "https://www.youtube.com/watch?v=DK0Awn1GSdQ",
        thumbnailAlt: "Placeholder for a travel video",
      },
      {
        number: "10",
        title: "Gorkha | Barpak & Laprak",
        description: "Add a short note about the writing behind this video.",
        source: "Travel series",
        href: "https://www.youtube.com/watch?v=yiLX3q3bOKY",
        thumbnailAlt: "Placeholder for a travel video",
      },
      {
        number: "11",
        title: "Langtang | Kyanjin Ri",
        description: "Add a short note about the writing behind this video.",
        source: "Travel series",
        href: "https://www.youtube.com/watch?v=w-55zzM244o",
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
        title: "The art of Effortless living | Taoist Documentary by Jason Gregory",
        description: "Add a short description of the translation and its context.",
        source: "Translation",
        href: "https://www.youtube.com/watch?v=sVEgFgFHssM",
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
        title: "Jingle for Current Noodles",
        description: "Introduce the campaign, partner, and creative contribution.",
        source: "Campaign partner",
        href: "https://www.youtube.com/watch?v=PTfGfnfGIaw",
        thumbnailAlt: "Placeholder for a brand collaboration",
      },
      {
        number: "02",
        title: "Honda Grazia Testimonia",
        description: "Add a concise description of this collaboration.",
        source: "Brand partner",
        href: "https://www.youtube.com/watch?v=a8MedfUhkB4",
        thumbnailAlt: "Placeholder for the Honda Grazia collaboration video",
      },
      {
        number: "03",
        title: "Brand collaboration",
        description: "Add the campaign, partner, and contribution for this image project.",
        source: "Campaign image",
        mediaType: "image",
        thumbnail: "/images/work/brand-collaboration-placeholder.svg",
        thumbnailAlt: "Placeholder for a brand campaign photograph",
      },
    ] satisfies PortfolioVideo[],
  },
};
