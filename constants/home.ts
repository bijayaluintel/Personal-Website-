export type LinkItem = { label: string; href: string };
export type NavigationItem = LinkItem & {
  children?: LinkItem[];
};

export type FeaturedWriting = {
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
      ],
    },
    {
      label: "Videos",
      href: "/videos/poetry-performances",
      children: [
        { label: "Poetry & Performances", href: "/videos/poetry-performances" },
        { label: "Podcasts & Interviews", href: "/videos/podcasts" },
        { label: "Documentaries", href: "/videos/documentaries" },
      ],
    },
    { label: "Media features", href: "/media-features" },
    { label: "Work & collaboration", href: "/work-and-collaboration" },
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
    eyebrow: "कविता सङ्ग्रह",
    title: "समयका खुकुला चप्पल",
    description:
      "कविता सङ्ग्रह “समयका खुकुला चप्पल” भित्र जिजीविषा छन् , जहाँ मानिस जीवनका अप्ठ्याराहरुलाई सहजताका साथ स्वीकार्न सिक्दछ , त्यस्तै प्रेम छ, जहाँ कलिलो उमेरका रौसे प्रेम देखि परिपक्‍व प्रेमका भावनाहरु छन् । देश छ, जहाँ विचार र भावना एकआपसमा संवाद गर्दछन् । अनि छ आध्यात्म, जहाँ मानिस खोज्दछ, आफ्नै अस्तित्व र जीवनलाई प‌ृथक ढङ्गबाट हेर्न सिक्दछ । समयका खुकुला चप्पलका सम्पूर्ण कविताहरुको गर्भमा एक यस्तो अव्यक्त भाव छ जसले बारम्बार भनिरहन्छ कि जीवन नश्वर छ र मानिस समयको खुकुलो चप्पल हो, जसको नियतिमा कुनैदिन समयका गोडाबाट फुस्कन लेखिएको छ ।",
    // praise:
    //   "म ओइलिन लागेको , गमलाको एक फूल हुँ\nहारेर संसारसँग आफूलाई नास्‍न पनि सक्छु\nखोसेर पानी आकाशसँग हाँस्‍न पनि सक्छु",
    // praiseBy: "",
    video: {
      label: "पुस्तक प्रकाशनको कथा",
      prompt: "भिडियो हेर्नुहोस्",
      href: "https://www.youtube.com/watch?v=fCU-4prZB2s",
      thumbnail: "https://i.ytimg.com/vi/fCU-4prZB2s/hqdefault.jpg",
      thumbnailAlt: "समयका खुकुला चप्पल पुस्तक प्रकाशनसम्बन्धी भिडियो",
    },
    cover: "/images/समयका-खुकुला-चप्पल–विजय-लुईटेल_Cover.jpg",
    coverAlt: "Cover of समयका-खुकुला-चप्पल by Bijaya Luintel",
    links: [
      { label: "Buy paperback", href: "#" },
      { label: "Read Review", href: "https://archive.sahityapost.com/samichaa/155277/" },
    ] satisfies LinkItem[],
  },
  quotes: [
    {
      type: "From the book",
      quote:
        // "I carried the morning with me—folded small, like a letter I was not yet ready to read.",
        "म ओइलिन लागेको , गमलाको एक फूल हुँ\nहारेर संसारसँग आफूलाई नास्‍न पनि सक्छु\nखोसेर पानी आकाशसँग हाँस्‍न पनि सक्छु",
      source: "समयका खुकुला चप्पल",
    },
    {
      type: "Reader note",
      quote:
        "Bijaya’s poems have the rare gift of feeling both deeply personal and entirely ours.",
      source: "Mira S. · Reader",
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
      number: "01",
      type: "कविता",
      title: "म कहाँ जान्छु ?",
      excerpt:
        "म स्वतन्त्र छु तर आवश्यकताले बाँध्दछ। म माटो हुँ, मलाई माटैले खानेछ…",
      href: "/writings/poems/blog-post",
      image:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjNq8HAdLiH1GizKSZD0HWrKFNcEB7CSS1Tbhl175LrfBDf2HJoy4Bl0PtOm1gburJJnbL99-Z8ZNtYR8wwS0Q0is3sN4a0msoi40JSHJQTVLX9-A0U7tILxroCG8QzP7W_1roK_r_Ssbts-DSnI4V69G2bCuDQKTV5c7qVX2ySxL_oaFEgAvO7VGUYH_g/w640-h360/%E0%A4%AE%20%E0%A4%95%E0%A4%B9%E0%A4%BE%E0%A4%81%20%E0%A4%9C%E0%A4%BE%E0%A4%A8%E0%A5%8D%E0%A4%9B%E0%A5%81%20.png",
      imageAlt: "म कहाँ जान्छु कविताको चित्र",
    },
    {
      number: "02",
      type: "कथा",
      title: "म घामभन्दा छिटो भएँ",
      excerpt:
        "उठेर बाहिर हेरेँ, पुरै अन्धकार थियो। चिसो बिहानीमा सुरु भएको एउटा यात्रा…",
      href: "/writings/stories/blog-post_27",
      image:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgvZ3Udnpo6_zY1SxGEReRcmtEDdaB07OAZZiK2mwr_gjBOQSxQhSKkZQEy17HgZ1UBHukqLKFdzrEP7H8zgwiwRpJ2wIE-IcDfWar6OhDsOfm02i-Df54eK7vF3RwqpNUJOOHCmYu_JnM/s640/man-sitting-on-edge-facing-sunset-915972.jpg",
      imageAlt: "सूर्यास्त हेर्दै गरेको मानिस",
    },
    {
      number: "03",
      type: "संस्मरण",
      title: "आज उसको सम्झना आयो",
      excerpt:
        "धेरै समयदेखि आफूभित्र गुम्सेको खिन्नता उनको सामु पोखूँझैँ लाग्यो…",
      href: "/writings/memoirs/blog-post_14",
      image:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiKA3Y9NF2Tkzue5YngbAz6_cqV_kQP_IrAxTLooZuhsXk3pMw6g3wcXklB53VKoOkGUpQu_L1ytNkDuIWeGAT5LXunfGwk9zQmQFxzaDkfc92AMt7-C0Kqy6bXJGx1Ci__f5B6Gj5YrE4/s640/black-and-white-couple-hands-1004014.jpg",
      imageAlt: "हात समातेको जोडीको श्यामश्वेत चित्र",
    },
  ] satisfies FeaturedWriting[],
  socialLinks: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "X / Twitter", href: "#" },
  ] satisfies LinkItem[],
  email: "hello@bijayaluintel.com",
};
