"use client";

import Image from "next/image";
import type { PortfolioVideo, WorkContent } from "@/sanity/lib/work";
import { getYouTubeThumbnail } from "@/sanity/lib/youtube";

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M8.5 6.7 17 12l-8.5 5.3V6.7Z" fill="currentColor" />
    </svg>
  );
}

function PortfolioVisual({ video }: { video: PortfolioVideo }) {
  const isImage = video.mediaType === "image";
  const thumbnail = video.thumbnail ?? (isImage ? null : getYouTubeThumbnail(video.href));

  return (
    <div className={`portfolio-video-visual${thumbnail ? "" : " is-placeholder"}${isImage ? " is-image" : ""}`}>
      {thumbnail ? (
        <Image
          alt={video.thumbnailAlt}
          fill
          sizes="(max-width: 700px) 92vw, 620px"
          src={thumbnail}
        />
      ) : (
        <>
          <span className="portfolio-placeholder-line" />
          <small>{isImage ? "Campaign image" : "Video thumbnail"}</small>
        </>
      )}
      {!isImage && <span className="portfolio-play"><PlayIcon /></span>}
      <span className="portfolio-number">{video.number}</span>
    </div>
  );
}

function PortfolioCard({
  video,
  featured = false,
}: {
  video: PortfolioVideo;
  featured?: boolean;
}) {
  return (
    <article
      className={`portfolio-video-card${featured ? " is-featured" : ""}`}
    >
      {video.href ? (
        <a aria-label={`${video.title} हेर्नुहोस्`} href={video.href} rel="noreferrer" target="_blank">
          <PortfolioVisual video={video} />
        </a>
      ) : (
        <PortfolioVisual video={video} />
      )}
      <div className="portfolio-video-copy">
        <p>{video.source}</p>
        <h4>
          {video.href ? (
            <a href={video.href} rel="noreferrer" target="_blank">{video.title}</a>
          ) : video.title}
        </h4>
      </div>
    </article>
  );
}

export function WorkPortfolioSection({
  service,
}: {
  service: WorkContent["services"][number];
}) {
  if (service.key === "scriptwriting") {
    return (
      <div className="service-work-expanded work-portfolio is-scriptwriting">
        <div className="portfolio-group-heading">
          <div>
            <p>{service.portfolio.eyebrow}</p>
            <h3>{service.portfolio.title}</h3>
          </div>
        </div>
        <div className="travel-script-grid">
          {service.portfolio.items.map((video, index) => (
            <PortfolioCard featured={index === 0} key={video.number} video={video} />
          ))}
        </div>
      </div>
    );
  }

  if (service.key === "translations" || service.key === "brand-collaborations") {
    const variant =
      service.key === "translations" ? "is-translation" : "is-brand-collaboration";

    return (
      <div className={`service-work-expanded work-portfolio ${variant}`}>
        <div className="portfolio-group-heading">
          <div>
            <p>{service.portfolio.eyebrow}</p>
            <h3>{service.portfolio.title}</h3>
          </div>
        </div>
        <div className="portfolio-secondary-videos">
          {service.portfolio.items.map((video) => (
            <PortfolioCard key={video.number} video={video} />
          ))}
        </div>
      </div>
    );
  }

  if (service.portfolio.items.length > 0) {
    return (
      <div className={`service-work-expanded work-portfolio is-${service.key}`}>
        <div className="portfolio-group-heading">
          <div>
            <p>{service.portfolio.eyebrow}</p>
            <h3>{service.portfolio.title}</h3>
          </div>
        </div>
        <div className="portfolio-secondary-videos">
          {service.portfolio.items.map((item) => (
            <PortfolioCard key={item.number} video={item} />
          ))}
        </div>
      </div>
    );
  }

  const emptyCopy = {
    label: service.portfolio.eyebrow,
    title: service.portfolio.title,
    note: service.portfolio.emptyNote,
    className: service.key === "copywriting" ? "is-copywriting" : "is-songwriting",
  };

  return (
    <div className={`service-work-empty ${emptyCopy.className}`}>
      <div>
        <span>{emptyCopy.label}</span>
        <h3>{emptyCopy.title}</h3>
      </div>
      <p>{emptyCopy.note}</p>
      <div aria-hidden="true" className="service-work-empty-mark">+</div>
    </div>
  );
}
