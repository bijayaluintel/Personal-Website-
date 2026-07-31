import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import {
  getVideoCategory,
  getYouTubeThumbnail,
  videoCategories,
  type VideoItem,
} from "@/constants/videos";

export function generateStaticParams() {
  return videoCategories.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getVideoCategory(slug);
  if (!category) return {};

  return {
    title: `${category.label} — Bijaya Luintel`,
    description: category.description,
  };
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M8.5 6.7 17 12l-8.5 5.3V6.7Z" fill="currentColor" />
    </svg>
  );
}

function VideoVisual({ item }: { item: VideoItem }) {
  const thumbnail = item.thumbnail ?? getYouTubeThumbnail(item.href);

  return (
    <div className={`video-card-visual${thumbnail ? "" : " is-placeholder"}`}>
      {thumbnail ? (
        <Image
          alt={item.thumbnailAlt}
          fill
          sizes="(max-width: 700px) 92vw, 640px"
          src={thumbnail}
        />
      ) : (
        <>
          <span className="video-placeholder-orbit" />
          <span className="video-placeholder-label">Thumbnail</span>
        </>
      )}
      <span className="video-card-play"><PlayIcon /></span>
      <span className="video-card-number">{item.number}</span>
    </div>
  );
}

export default async function VideoCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getVideoCategory(slug);
  if (!category) notFound();

  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="video-page-hero section-shell">
          <nav aria-label="Video categories" className="video-category-nav">
            {videoCategories.map((item) => (
              <Link
                aria-current={item.slug === category.slug ? "page" : undefined}
                href={`/videos/${item.slug}`}
                key={item.slug}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="eyebrow">{category.eyebrow}</p>
          <h1>{category.label}</h1>
        </section>

        <section className="video-library section-shell" aria-label={`${category.label} links`}>
          <div className="video-library-grid">
            {category.items.map((item, index) => (
              <article className={`video-card${index === 0 ? " is-featured" : ""}`} key={item.number}>
                {item.href ? (
                  <a aria-label={`${item.title} हेर्नुहोस्`} href={item.href} rel="noreferrer" target="_blank">
                    <VideoVisual item={item} />
                  </a>
                ) : (
                  <VideoVisual item={item} />
                )}
                <div className="video-card-copy">
                  <p>{item.source}</p>
                  <h2>
                    {item.href ? (
                      <a href={item.href} rel="noreferrer" target="_blank">{item.title}</a>
                    ) : item.title}
                  </h2>
                  <span>{item.description}</span>
                  {item.href && (
                    <a className="video-watch-link" href={item.href} rel="noreferrer" target="_blank">
                      Watch now <span>↗</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
