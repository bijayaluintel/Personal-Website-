import { BookSection } from "@/components/home/BookSection";
import { HeroSection } from "@/components/home/HeroSection";
import { QuotesSection } from "@/components/home/QuotesSection";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { SubscribeSection } from "@/components/home/SubscribeSection";
import { WritingsSection } from "@/components/home/WritingsSection";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <HeroSection />
        <BookSection />
        <QuotesSection />
        <SubscribeSection />
        <WritingsSection />
      </main>
      <SiteFooter />
    </>
  );
}
