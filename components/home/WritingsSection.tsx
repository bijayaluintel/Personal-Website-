import Image from "next/image";
import Link from "next/link";
import { siteData } from "@/constants/home";
import { ArrowIcon } from "./ArrowIcon";

export function WritingsSection() {
  return (
    <section className="writings-section section-shell" id="writings">
      <div className="section-heading">
        <p className="eyebrow">Featured writing</p>
        <h2>Featured posts</h2>
      </div>
      <div className="writings-grid">
        {siteData.writings.map((post) => {
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
              <a aria-label={`${post.title} हेर्नुहोस्`} className="featured-writing-image" href={post.href} rel="noreferrer" target="_blank">
                {visual}
              </a>
            ) : (
              <Link aria-label={`${post.title} पढ्नुहोस्`} className="featured-writing-image" href={post.href}>
                {visual}
              </Link>
            )}
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            {isVideo ? (
              <a href={post.href} aria-label={`${post.title} हेर्नुहोस्`} rel="noreferrer" target="_blank">
                भिडियो हेर्नुहोस् <ArrowIcon />
              </a>
            ) : (
              <Link href={post.href} aria-label={`${post.title} पढ्नुहोस्`}>
                पूरा पढ्नुहोस् <ArrowIcon />
              </Link>
            )}
          </article>
          );
        })}
      </div>
    </section>
  );
}
