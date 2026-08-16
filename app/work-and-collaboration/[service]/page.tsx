import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { WorkPage } from "@/components/work/WorkPage";
import { getWorkServiceParams } from "@/sanity/lib/work";

export const metadata: Metadata = {
  title: "Work & Collaboration — Bijaya Luintel",
  description: "Scriptwriting, copywriting, lyrics writing, English–Nepali translation, and creative collaborations with Bijaya Luintel.",
};

export const revalidate = 60;

export const generateStaticParams = getWorkServiceParams;

export default async function WorkServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  if (service === "brand-collaborations") {
    redirect("/work-and-collaboration/brand-collaborations/collaboration-showcase");
  }

  return <WorkPage activeService={service} />;
}
