import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { ScrollRevealObserver } from "@/components/ScrollRevealObserver";
import { getVideoCategoryParams, getVideosContent, type VideoItem } from "@/sanity/lib/videos";
import { getYouTubeThumbnail } from "@/sanity/lib/youtube";

export async function generateStaticParams() {
  return getVideoCategoryParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const content = await getVideosContent(slug);
  if (!content) return {};

  return {
    title: `${content.category.label} — Bijaya Luintel`,
    description: content.category.description,
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
  const content = await getVideosContent(slug);
  if (!content) notFound();
  const { category, navigation: categoryNavigation } = content;
  const isYouTubeChannel = category.slug === "youtube-channel";

  return (
    <>
      <SiteHeader />
      <main id="top">
        {isYouTubeChannel && <ScrollRevealObserver />}
        <section className="video-page-hero section-shell">
          <nav aria-label="Video categories" className="video-category-nav">
            {categoryNavigation.map((item) => (
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

        {category.channel && (
          <section className="youtube-channel-intro section-shell" aria-label="Bijaya Luintel YouTube channel">
            <div className="youtube-channel-mark" aria-hidden="true">
              <span />
            </div>
            <div className="youtube-channel-copy">
              <p>Official channel</p>
              <h2>Bijaya Luintel</h2>
              <span>{category.channel.handle}</span>
            </div>
            <p className="youtube-channel-note">Poetry, spoken word, thoughtful conversations, and stories—collected in one place.</p>
            <a className="youtube-channel-link" href={category.channel.href} rel="noreferrer" target="_blank">
              Visit channel <span>↗</span>
            </a>
          </section>
        )}

        <section className="video-library section-shell" aria-label={`${category.label} links`}>
          <div className="video-library-grid">
            {category.items.map((item, index) => (
              <article
                className={`video-card${index === 0 ? " is-featured" : ""}`}
                data-reveal={isYouTubeChannel ? "up" : undefined}
                key={item.number}
              >
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
