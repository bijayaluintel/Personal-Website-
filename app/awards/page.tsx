import type { Metadata } from "next";
import { ScrollRevealObserver } from "@/components/ScrollRevealObserver";
import { AwardsArchive } from "@/components/awards/AwardsArchive";
import { AwardsHero } from "@/components/awards/AwardsHero";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { getAwardsContent } from "@/sanity/lib/awards";

export const metadata: Metadata = {
  title: "Awards & Recognition — Bijaya Luintel",
  description:
    "Awards, recognition, and selected milestones from the creative journey of Bijaya Luintel.",
};

export default async function AwardsPage() {
  const { hero, awards } = await getAwardsContent();

  return (
    <>
      <SiteHeader />
      <main id="top">
        <ScrollRevealObserver />
        <AwardsHero eyebrow={hero.eyebrow} title={hero.title} />
        <AwardsArchive awards={awards} />
      </main>
      <SiteFooter />
    </>
  );
}
