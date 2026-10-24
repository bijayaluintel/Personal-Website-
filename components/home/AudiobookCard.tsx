import type { HomeContent } from "@/sanity/lib/home";
import { ArrowIcon } from "./ArrowIcon";

export function AudiobookCard({ audiobook }: { audiobook: HomeContent["audiobook"] }) {
  return (
    <article className="quote-card audiobook-card" aria-labelledby="audiobook-title">
      <div className="audiobook-heading">
        <h3 className="quote-type" id="audiobook-title">{audiobook.label}</h3>
      </div>
      <iframe
        className="audiobook-player"
        src={audiobook.embedUrl}
        title={`${audiobook.label} — Spotify audio player`}
        width="100%"
        height="352"
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
      <a className="audiobook-link" href={audiobook.href} target="_blank" rel="noopener noreferrer">
        Listen on Spotify <span className="sr-only">(opens in a new tab)</span><ArrowIcon />
      </a>
    </article>
  );
}
