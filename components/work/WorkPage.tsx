import { ScrollRevealObserver } from "@/components/ScrollRevealObserver";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { getSiteSettings } from "@/sanity/lib/siteSettings";
import { getWorkContent } from "@/sanity/lib/work";
import { CollaborationSection } from "./CollaborationSection";
import { ServicesSection } from "./ServicesSection";
import { WorkHero } from "./WorkHero";

export async function WorkPage({ activeService }: { activeService: string }) {
  const [content, settings] = await Promise.all([getWorkContent(), getSiteSettings()]);
  if (!content.services.some((service) => service.key === activeService)) notFound();

  return (
    <>
      <SiteHeader />
      <main id="top">
        <ScrollRevealObserver />
        <WorkHero hero={content.hero} />
        <ServicesSection activeService={activeService} eyebrow={content.servicesEyebrow} services={content.services} />
        <CollaborationSection collaboration={content.collaboration} email={settings.email} />
      </main>
      <SiteFooter />
    </>
  );
}
import { notFound } from "next/navigation";
