import Image from "next/image";
import type { AwardItem } from "@/constants/awards";

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
  return (
    <section className="awards-archive section-shell" aria-label="Awards archive">
      <div className="award-entries">
        {awards.map((award) => (
          <article className="award-entry" data-reveal="up" key={award.id ?? award.number}>
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
    </section>
  );
}
