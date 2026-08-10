import type { Metadata } from "next";
import { ScrollRevealObserver } from "@/components/ScrollRevealObserver";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { CollaborationSection } from "@/components/work/CollaborationSection";
import { ServicesSection } from "@/components/work/ServicesSection";
import { WorkHero } from "@/components/work/WorkHero";
import { getWorkContent } from "@/sanity/lib/work";
import { getSiteSettings } from "@/sanity/lib/siteSettings";

export const metadata: Metadata = {
  title: "Work & Collaboration — Bijaya Luintel",
  description:
    "Scriptwriting, copywriting, songwriting, English–Nepali translation, and creative collaborations with Bijaya Luintel.",
};

export const revalidate = 60;

export default async function WorkAndCollaborationPage() {
  const [content, settings] = await Promise.all([getWorkContent(), getSiteSettings()]);

  return (
    <>
      <SiteHeader />
      <main id="top">
        <ScrollRevealObserver />
        <WorkHero hero={content.hero} />
        <ServicesSection eyebrow={content.servicesEyebrow} services={content.services} />
        <CollaborationSection collaboration={content.collaboration} email={settings.email} />
      </main>
      <SiteFooter />
    </>
  );
}
