import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkPage } from "@/components/work/WorkPage";

const brandSubsections = ["collaboration-showcase", "brands-worked-with"] as const;

export const metadata: Metadata = {
  title: "Brand Collaborations — Bijaya Luintel",
  description: "Selected brand collaborations and brands that have worked with Bijaya Luintel.",
};

export const revalidate = 60;

export function generateStaticParams() {
  return brandSubsections.map((subsection) => ({service: "brand-collaborations", subsection}));
}

export default async function BrandCollaborationSubsectionPage({
  params,
}: {
  params: Promise<{service: string; subsection: string}>;
}) {
  const {service, subsection} = await params;
  if (service !== "brand-collaborations" || !brandSubsections.some((item) => item === subsection)) notFound();

  return <WorkPage activeService={service} brandSubsection={subsection as (typeof brandSubsections)[number]} />;
}
