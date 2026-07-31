"use client";

import { useState } from "react";
import { workPageData } from "@/constants/work";
import { WorkPortfolioSection } from "./WorkPortfolioSection";

export function ServicesSection() {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  return (
    <section className="services-section section-shell" aria-label="What I do">
      <div className="services-heading">
        <p className="eyebrow">What I do</p>
      </div>

      <div className="services-list">
        {workPageData.services.map((service) => {
          const isExpanded = expandedService === service.title;

          return (
            <article className="service-accordion-item" key={service.title}>
              <button
                aria-expanded={isExpanded}
                className="service-row"
                onClick={() => setExpandedService(isExpanded ? null : service.title)}
                type="button"
              >
                <span className="service-number">{service.number}</span>
                <span className="service-title">{service.title}</span>
                <span className="service-description">{service.description}</span>
                <span className="service-details">{service.details.join(" · ")}</span>
                <span aria-hidden="true" className="service-toggle-icon">
                  <span />
                  <span />
                </span>
              </button>
              {isExpanded && <WorkPortfolioSection serviceTitle={service.title} />}
            </article>
          );
        })}
      </div>
    </section>
  );
}
