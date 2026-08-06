export type LinkItem = { label: string; href: string };
export type NavigationItem = LinkItem & {
  children?: LinkItem[];
};

export type FeaturedWriting = {
  contentType: "writing" | "video";
  number: string;
  type: string;
  title: string;
  excerpt: string;
  href: string;
  image: string;
  imageAlt: string;
};

export const siteData = {
  name: "Bijaya Luintel",
  shortName: "BL",
  nav: [
    { label: "Home", href: "/" },
    {
      label: "Writings",
      href: "/writings/poems",
      children: [
        { label: "Poetry", href: "/writings/poems" },
        { label: "Stories", href: "/writings/stories" },
        { label: "Memoirs", href: "/writings/memoirs" },
        { label: "Others", href: "/writings/others" },
      ],
    },
    {
      label: "Videos",
      href: "/videos/poetry-performances",
      children: [
        { label: "Poetry & Performances", href: "/videos/poetry-performances" },
        { label: "Podcasts & Interviews", href: "/videos/podcasts" },
        { label: "Documentaries", href: "/videos/documentaries" },
        { label: "YouTube Channel", href: "/videos/youtube-channel" },
      ],
    },
    { label: "Work & collaboration", href: "/work-and-collaboration" },
    { label: "Media features", href: "/media-features" },
    { label: "Experience", href: "/experience" },
    { label: "Awards", href: "/awards" },
  ] satisfies NavigationItem[],
  hero: {
    title: "Bijaya Luintel",
    roles: "कवि / स्क्रिप्ट राइटर / कपी राइटर / अनुवादक अनि हुन बाँकी जम्मै ….",
    tagline:
      "म सिक्न खोजिरहन्छु र यो क्रममा जे जे सिक्छु । सबैसँग साझा गर्ने कोसिस गरिरहन्छु ताकी सिक्ने मौका झन् धेरै मिलोस् ।",
    primaryCta: { label: "Read my writings", href: "#writings" },
    secondaryCta: { label: "Discover the book", href: "#book" },
    image: "/images/bijaya1.jpg",
    imageAlt: "Placeholder portrait for Bijaya Luintel",
  },
  book: {
    // eyebrow: "कविता सङ्ग्रह",
    title: "समयका खुकुला चप्पल",
    description:
      "कविता सङ्ग्रह “समयका खुकुला चप्पल” भित्र जिजीविषा छन् , जहाँ मानिस जीवनका अप्ठ्याराहरुलाई सहजताका साथ स्वीकार्न सिक्दछ , त्यस्तै प्रेम छ, जहाँ कलिलो उमेरका रौसे प्रेम देखि परिपक्‍व प्रेमका भावनाहरु छन् । देश छ, जहाँ विचार र भावना एकआपसमा संवाद गर्दछन् । अनि छ आध्यात्म, जहाँ मानिस खोज्दछ, आफ्नै अस्तित्व र जीवनलाई प‌ृथक ढङ्गबाट हेर्न सिक्दछ । समयका खुकुला चप्पलका सम्पूर्ण कविताहरुको गर्भमा एक यस्तो अव्यक्त भाव छ जसले बारम्बार भनिरहन्छ कि जीवन नश्वर छ र मानिस समयको खुकुलो चप्पल हो, जसको नियतिमा कुनैदिन समयका गोडाबाट फुस्कन लेखिएको छ ।",
    video: {
      label: "पुस्तक प्रकाशनको कथा",
      prompt: "भिडियो हेर्नुहोस्",
      href: "https://www.youtube.com/watch?v=fCU-4prZB2s",
      thumbnail: "https://i.ytimg.com/vi/fCU-4prZB2s/hqdefault.jpg",
      thumbnailAlt: "समयका खुकुला चप्पल पुस्तक प्रकाशनसम्बन्धी भिडियो",
    },
    cover: "/images/समयका-खुकुला-चप्पल–विजय-लुईटेल.png",
    coverAlt: "Cover of समयका-खुकुला-चप्पल by Bijaya Luintel",
    links: [
      { label: "Buy paperback", href: "#" },
      { label: "Read Review", href: "https://archive.sahityapost.com/samichaa/155277/" },
    ] satisfies LinkItem[],
  },
  quotes: [
    {
      type: "Quotes",
      items: [
        {
          quote: "म ओइलिन लागेको , गमलाको एक फूल हुँ",
          source: "समयका खुकुला चप्पल",
          lang: "ne",
        },
        {
          quote: "हारेर संसारसँग आफूलाई नास्‍न पनि सक्छु",
          source: "समयका खुकुला चप्पल",
          lang: "ne",
        },
        {
          quote: "खोसेर पानी आकाशसँग हाँस्‍न पनि सक्छु",
          source: "समयका खुकुला चप्पल",
          lang: "ne",
        },
        {
          quote: "यहाँ पुस्तकबाट अर्को चयनित उद्धरण राख्नुहोस्।",
          source: "नयाँ उद्धरण",
          lang: "ne",
        },
        {
          quote: "यहाँ पुस्तकबाट अर्को स्मरणीय पङ्क्ति राख्नुहोस्।",
          source: "नयाँ उद्धरण",
          lang: "ne",
        },
      ],
    },
    {
      type: "Reader’s notes",
      items: [
        {
          quote: "Bijaya’s poems have the rare gift of feeling both deeply personal and entirely ours.",
          source: "Mira S. · Reader",
          lang: "en",
        },
        {
          quote: "यहाँ पाठकको छोटो प्रतिक्रिया राख्नुहोस्।",
          source: "Reader note 02",
          lang: "ne",
        },
        {
          quote: "यहाँ पुस्तकबारे अर्को पाठकीय अनुभव राख्नुहोस्।",
          source: "Reader note 03",
          lang: "ne",
        },
        {
          quote: "यहाँ कविताले पाठकमा छोडेको अनुभूति राख्नुहोस्।",
          source: "Reader note 04",
          lang: "ne",
        },
        {
          quote: "यहाँ अर्को छोटो र अर्थपूर्ण पाठक प्रतिक्रिया राख्नुहोस्।",
          source: "Reader note 05",
          lang: "ne",
        },
      ],
    },
  ],
  newsletter: {
    eyebrow: "A quiet letter",
    title: "Get occasional poems in your inbox.",
    description:
      "Enter your email to receive selected poems, new writing, and occasional notes from Bijaya.",
    privacy: "Your email stays private. Unsubscribe whenever you like.",
    success: "Please check your inbox to confirm your subscription.",
    error: "We couldn’t complete your subscription. Please try again later.",
  },
  writings: [
    {
      contentType: "writing",
      number: "01",
      type: "कविता",
      title: "म कहाँ जान्छु ?",
      excerpt:
        "म स्वतन्त्र छु तर आवश्यकताले बाँध्दछ। म माटो हुँ, मलाई माटैले खानेछ…",
      href: "/writings/poems",
      image: "/images/bijaya.jpg",
      imageAlt: "म कहाँ जान्छु कविताको चित्र",
    },
    {
      contentType: "writing",
      number: "02",
      type: "कथा",
      title: "म घामभन्दा छिटो भएँ",
      excerpt:
        "उठेर बाहिर हेरेँ, पुरै अन्धकार थियो। चिसो बिहानीमा सुरु भएको एउटा यात्रा…",
      href: "/writings/stories",
      image: "/images/समयका-खुकुला-चप्पल–विजय-लुईटेल_Cover.jpg",
      imageAlt: "सूर्यास्त हेर्दै गरेको मानिस",
    },
    {
      contentType: "video",
      number: "03",
      type: "Video article",
      title: "How I published my first poetry book",
      excerpt:
        "समयका खुकुला चप्पल तयार पार्ने, सम्पादन गर्ने र आफ्नै प्रयासमा प्रकाशित गर्ने यात्राको कथा।",
      href: "https://www.youtube.com/watch?v=fCU-4prZB2s",
      image: "https://i.ytimg.com/vi/fCU-4prZB2s/hqdefault.jpg",
      imageAlt: "How I published my first poetry book video thumbnail",
    },
  ] satisfies FeaturedWriting[],
  socialLinks: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "X / Twitter", href: "#" },
  ] satisfies LinkItem[],
  email: "hello@bijayaluintel.com",
};
