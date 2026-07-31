"use client";

import Image from "next/image";
import { useState } from "react";
import type { AwardItem } from "@/constants/awards";

const AWARDS_PER_PAGE = 4;

function AwardVisual({ award }: { award: AwardItem }) {
  return (
    <div className="award-visual">
      {award.image ? (
        <Image
          alt={award.imageAlt}
          fill
          sizes="(max-width: 700px) 90vw, 48vw"
          src={award.image}
        />
      ) : (
        <div className="award-image-placeholder" role="img" aria-label={award.imageAlt}>
          <svg aria-hidden="true" fill="none" viewBox="0 0 48 48">
            <rect height="37" rx="18.5" stroke="currentColor" width="37" x="5.5" y="5.5" />
            <path d="m14 32 7-8 5 5 4-4 6 7M29 18h.01" stroke="currentColor" strokeLinecap="round" />
          </svg>
          <span>Award photograph</span>
          <small>Replace with the original image</small>
        </div>
      )}
      <span className="award-visual-number">{award.number}</span>
    </div>
  );
}

export function AwardsArchive({ awards }: { awards: AwardItem[] }) {
  const [visibleCount, setVisibleCount] = useState(AWARDS_PER_PAGE);
  const visibleAwards = awards.slice(0, visibleCount);
  const remainingCount = awards.length - visibleCount;
  const hasMoreAwards = remainingCount > 0;

  return (
    <section className="awards-archive section-shell" aria-label="Awards archive">
      <div className="award-entries">
        {visibleAwards.map((award) => (
          <article className="award-entry" key={award.id ?? award.number}>
            <AwardVisual award={award} />
            <div className="award-entry-copy">
              <div className="award-meta">
                <span>{award.year}</span>
                <span>{award.organization}</span>
              </div>
              <h3>{award.title}</h3>
              <p>{award.description}</p>
              <div className="award-caption">
                <span />
                <small>Recognition no. {award.number}</small>
              </div>
            </div>
          </article>
        ))}
      </div>
      {hasMoreAwards && (
        <div className="awards-reveal">
          <button
            aria-label={`Show ${Math.min(AWARDS_PER_PAGE, remainingCount)} more awards`}
            onClick={() => setVisibleCount((count) => count + AWARDS_PER_PAGE)}
            type="button"
          >
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
              <path d="m7 10 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
