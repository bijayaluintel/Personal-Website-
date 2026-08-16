import Image from "next/image";
import type { HomeContent } from "@/sanity/lib/home";
import { ArrowIcon } from "./ArrowIcon";

export function BookSection({ book }: { book: HomeContent["book"] }) {
  return (
    <section className="book-section" id="book">
      <div className="section-shell book-grid">
        <div className="book-art">
          <span className="book-shape book-shape-one" />
          <span className="book-shape book-shape-two" />
          <div className="book-cover">
            <Image alt={book.coverAlt} fill sizes="(max-width: 760px) 62vw, 310px" src={book.cover} />
          </div>
        </div>
        <div className="book-copy">
          {/* <p className="eyebrow eyebrow-light">{book.eyebrow}</p> */}
          <h2>{book.title}</h2>
          <div className="section-description" style={{ textAlign: book.descriptionAlignment }}>
            {book.description.split(/\r?\n+/).map((paragraph) => paragraph.trim()).filter(Boolean).map((paragraph, index) => (
              <p key={`${index}-${paragraph}`}>{paragraph}</p>
            ))}
          </div>
          <a
            aria-label={`${book.video.label} — YouTube मा हेर्नुहोस्`}
            className="book-video"
            href={book.video.href}
            rel="noreferrer"
            target="_blank"
          >
            <Image
              alt={book.video.thumbnailAlt}
              fill
              sizes="(max-width: 700px) 88vw, 460px"
              src={book.video.thumbnail}
            />
            <span className="book-video-shade" />
            <span aria-hidden="true" className="book-video-play">
              <svg viewBox="0 0 24 24">
                <path d="M8.5 6.7 17 12l-8.5 5.3V6.7Z" fill="currentColor" />
              </svg>
            </span>
            <span className="book-video-copy">
              <strong>{book.video.label}</strong>
              <small>{book.video.prompt} ↗</small>
            </span>
          </a>
          <div className="button-row">
            <a className="button button-paper" href={book.links[0].href}>
              {book.links[0].label}<ArrowIcon />
            </a>
            <a className="text-link text-link-light" href={book.links[1].href}>{book.links[1].label}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
