import type { Metadata } from "next";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { CollaborationSection } from "@/components/work/CollaborationSection";
import { ServicesSection } from "@/components/work/ServicesSection";
import { WorkHero } from "@/components/work/WorkHero";

export const metadata: Metadata = {
  title: "Work & Collaboration — Bijaya Luintel",
  description:
    "Scriptwriting, copywriting, songwriting, English–Nepali translation, and creative collaborations with Bijaya Luintel.",
};

export default function WorkAndCollaborationPage() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <WorkHero />
        <ServicesSection />
        <CollaborationSection />
      </main>
      <SiteFooter />
    </>
  );
}
