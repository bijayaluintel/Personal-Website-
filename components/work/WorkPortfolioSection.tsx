"use client";

import Image from "next/image";
import { useState } from "react";
import { getYouTubeThumbnail } from "@/constants/videos";
import {
  workPortfolioData,
  type PortfolioVideo,
} from "@/constants/workPortfolio";

const INITIAL_TRAVEL_VIDEOS = 7;
const TRAVEL_VIDEO_BATCH = 6;

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M8.5 6.7 17 12l-8.5 5.3V6.7Z" fill="currentColor" />
    </svg>
  );
}

function PortfolioVisual({ video }: { video: PortfolioVideo }) {
  const thumbnail = video.thumbnail ?? getYouTubeThumbnail(video.href);

  return (
    <div className={`portfolio-video-visual${thumbnail ? "" : " is-placeholder"}`}>
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
          <small>Video thumbnail</small>
        </>
      )}
      <span className="portfolio-play"><PlayIcon /></span>
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
    <article className={`portfolio-video-card${featured ? " is-featured" : ""}`}>
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
        <span>{video.description}</span>
      </div>
    </article>
  );
}

export function WorkPortfolioSection({ serviceTitle }: { serviceTitle: string }) {
  const [visibleTravelVideos, setVisibleTravelVideos] = useState(INITIAL_TRAVEL_VIDEOS);
  const {
    scriptwriting,
    translation,
    brandCollaborations,
  } = workPortfolioData;

  if (serviceTitle === "Scriptwriting") {
    const travelVideos = scriptwriting.videos.slice(0, visibleTravelVideos);
    const hasMoreTravelVideos = visibleTravelVideos < scriptwriting.videos.length;

    return (
      <div className="service-work-expanded work-portfolio is-scriptwriting">
        <div className="portfolio-group-heading">
          <div>
            <p>{scriptwriting.eyebrow}</p>
            <h3>{scriptwriting.title}</h3>
          </div>
          <span>{scriptwriting.description}</span>
        </div>
        <div className="travel-script-grid">
          {travelVideos.map((video, index) => (
            <PortfolioCard featured={index === 0} key={video.number} video={video} />
          ))}
        </div>
        {hasMoreTravelVideos && (
          <button
            aria-label="Show more travel-script videos"
            className="portfolio-show-more"
            onClick={() => setVisibleTravelVideos((count) => count + TRAVEL_VIDEO_BATCH)}
            type="button"
          >
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
              <path d="m7 10 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  const group =
    serviceTitle === "Translations"
      ? translation
      : serviceTitle === "Brand collaborations"
        ? brandCollaborations
        : null;

  if (group) {
    const variant =
      serviceTitle === "Translations" ? "is-translation" : "is-brand-collaboration";

    return (
      <div className={`service-work-expanded work-portfolio ${variant}`}>
        <div className="portfolio-group-heading">
          <div>
            <p>{group.eyebrow}</p>
            <h3>{group.title}</h3>
          </div>
          <span>{group.description}</span>
        </div>
        <div className="portfolio-secondary-videos">
          {group.videos.map((video) => (
            <PortfolioCard key={video.number} video={video} />
          ))}
        </div>
      </div>
    );
  }

  const emptyCopy =
    serviceTitle === "Copywriting"
      ? {
          label: "Copywriting portfolio",
          title: "Words that give an idea its voice.",
          note: "Campaigns, brand stories, and selected copy projects will live here.",
          className: "is-copywriting",
        }
      : {
          label: "Songwriting portfolio",
          title: "Lyrics, rhythm, and stories made to be heard.",
          note: "Selected songs, lyrics, and listening links will live here.",
          className: "is-songwriting",
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
