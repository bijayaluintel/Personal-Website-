import { BookSection } from "@/components/home/BookSection";
import { HeroSection } from "@/components/home/HeroSection";
import { QuotesSection } from "@/components/home/QuotesSection";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { SubscribeSection } from "@/components/home/SubscribeSection";
import { WritingsSection } from "@/components/home/WritingsSection";
import { getHomeContent } from "@/sanity/lib/home";

export const revalidate = 60;

export default async function Home() {
  const content = await getHomeContent();

  return (
    <>
      <SiteHeader />
      <main id="top">
        <HeroSection hero={content.hero} />
        <BookSection book={content.book} />
        <QuotesSection groups={content.quotes} heading={content.quotesHeading} />
        <SubscribeSection newsletter={content.newsletter} />
        <WritingsSection heading={content.featuredHeading} posts={content.writings} />
      </main>
      <SiteFooter />
    </>
  );
}
