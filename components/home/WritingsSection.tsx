import Image from "next/image";
import Link from "next/link";
import type { HomeContent } from "@/sanity/lib/home";
import { ArrowIcon } from "./ArrowIcon";

export function WritingsSection({
  heading,
  posts,
}: {
  heading: HomeContent["featuredHeading"];
  posts: HomeContent["writings"];
}) {
  return (
    <section className="writings-section section-shell" id="writings">
      <div className="section-heading">
        <p className="eyebrow">{heading.eyebrow}</p>
        <h2>{heading.title}</h2>
      </div>
      <div className="writings-grid">
        {posts.map((post) => {
          const isVideo = post.contentType === "video";
          const visual = (
            <>
              <Image
                alt={post.imageAlt}
                fill
                sizes="(max-width: 700px) 92vw, 380px"
                src={post.image}
              />
              {isVideo && (
                <span aria-hidden="true" className="featured-writing-play">
                  <svg viewBox="0 0 24 24"><path d="M8.5 6.7 17 12l-8.5 5.3V6.7Z" fill="currentColor" /></svg>
                </span>
              )}
            </>
          );

          return (
          <article className="writing-card" key={post.href}>
            <div className="writing-meta">
              <span>{post.number}</span>
              <span>{post.type}</span>
            </div>
            {isVideo ? (
              <a aria-label={`Watch ${post.title}`} className="featured-writing-image" href={post.href} rel="noreferrer" target="_blank">
                {visual}
              </a>
            ) : (
              <Link aria-label={`Read ${post.title}`} className="featured-writing-image" href={post.href}>
                {visual}
              </Link>
            )}
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            {isVideo ? (
              <a href={post.href} aria-label={`Watch ${post.title}`} rel="noreferrer" target="_blank">
                Watch video <ArrowIcon />
              </a>
            ) : (
              <Link href={post.href} aria-label={`Read ${post.title}`}>
                Read full article <ArrowIcon />
              </Link>
            )}
          </article>
          );
        })}
      </div>
    </section>
  );
}
