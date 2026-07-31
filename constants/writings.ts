export const writingCategories = [
  {
    slug: "poems",
    label: "कविता",
    eyebrow: "कविता सङ्ग्रह",
    description:
      "समय, प्रेम, यात्रा र जीवनका सूक्ष्म अनुभूतिहरूलाई समेटिएका कविताहरू।",
    bloggerLabel: "कविता",
  },
  {
    slug: "stories",
    label: "कथा",
    eyebrow: "कथा सङ्ग्रह",
    description:
      "मानिस, सम्बन्ध र दैनिक जीवनका अनौठा मोडहरूबाट जन्मिएका छोटा तथा लामा कथाहरू।",
    bloggerLabel: "कथा",
  },
  {
    slug: "memoirs",
    label: "संस्मरण",
    eyebrow: "यात्रा र सम्झना",
    description:
      "यात्रामा भेटिएका ठाउँ, मानिस र मनमा बाँकी बसेका स्मृतिका व्यक्तिगत अभिलेखहरू।",
    bloggerLabel: "संस्मरण",
  },
] as const;

export type WritingCategory = (typeof writingCategories)[number];

export function getWritingCategory(slug: string) {
  return writingCategories.find((category) => category.slug === slug);
}
