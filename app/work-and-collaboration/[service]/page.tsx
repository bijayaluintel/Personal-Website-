import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkPage } from "@/components/work/WorkPage";
import { isServiceKey, serviceKeys } from "@/sanity/lib/work";

export const metadata: Metadata = {
  title: "Work & Collaboration — Bijaya Luintel",
  description: "Scriptwriting, copywriting, songwriting, English–Nepali translation, and creative collaborations with Bijaya Luintel.",
};

export const revalidate = 60;

export function generateStaticParams() {
  return serviceKeys.map((service) => ({ service }));
}

export default async function WorkServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  if (!isServiceKey(service)) notFound();

  return <WorkPage activeService={service} />;
}
