"use client";

import { useEffect, useState } from "react";
import { siteData } from "@/constants/home";

type QuoteGroup = (typeof siteData.quotes)[number];

function CarouselArrow({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 18 18">
      <path
        d={direction === "previous" ? "M14 9H4m4-4L4 9l4 4" : "M4 9h10m-4-4 4 4-4 4"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QuoteCarousel({ group, index }: { group: QuoteGroup; index: number }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [turnDirection, setTurnDirection] = useState<"next" | "previous">("next");
  const activeItem = group.items[activeIndex];

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setTurnDirection("next");
      setActiveIndex((current) => (current + 1) % group.items.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [group.items.length, isPaused]);

  function showPrevious() {
    setTurnDirection("previous");
    setActiveIndex((current) =>
      current === 0 ? group.items.length - 1 : current - 1,
    );
  }

  function showNext() {
    setTurnDirection("next");
    setActiveIndex((current) => (current + 1) % group.items.length);
  }

  return (
    <blockquote
      className={`quote-card quote-card-${index + 1}`}
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`quote-page turns-${turnDirection}`}
        key={`${activeIndex}-${turnDirection}`}
      >
        <div className="quote-card-top">
          <p className="quote-type">{group.type}</p>
          <span className="quote-index">
            {String(activeIndex + 1).padStart(2, "0")} / {String(group.items.length).padStart(2, "0")}
          </span>
        </div>
        <span aria-hidden="true" className="quote-mark">“</span>
        <p className="quote-text" lang={activeItem.lang}>{activeItem.quote}</p>
        <div className="quote-source">
          <span />
          <cite>{activeItem.source}</cite>
        </div>
      </div>

      <div className="quote-controls">
        <button aria-label={`Previous ${group.type}`} onClick={showPrevious} type="button">
          <CarouselArrow direction="previous" />
        </button>
        <button aria-label={`Next ${group.type}`} onClick={showNext} type="button">
          <CarouselArrow direction="next" />
        </button>
      </div>
    </blockquote>
  );
}

export function QuotesSection() {
  return (
    <section className="quotes-section section-shell" id="quotes">
      <div className="section-heading quotes-heading">
        <div>
          <p className="eyebrow">Words that linger</p>
          <h2>On the page <em>& beyond</em></h2>
        </div>
        <p className="quotes-intro">
          A glimpse from the collection, followed by the words it left with a
          reader.
        </p>
      </div>
      <div className="quotes-grid">
        {siteData.quotes.map((group, index) => (
          <QuoteCarousel group={group} index={index} key={group.type} />
        ))}
      </div>
    </section>
  );
}
