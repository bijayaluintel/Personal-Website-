"use client";

import { useId, useState } from "react";
import type { WorkContent } from "@/sanity/lib/work";
import { WorkPortfolioSection } from "./WorkPortfolioSection";

export function ServicesSection({
  eyebrow,
  services,
}: {
  eyebrow: string;
  services: WorkContent["services"];
}) {
  const [activeService, setActiveService] = useState(
    services[0]?.key,
  );
  const browserId = useId();
  const selectedService = services.find(
    (service) => service.key === activeService,
  ) ?? services[0];

  if (!selectedService) return null;

  return (
    <section className="work-browser section-shell" aria-label="Work portfolio">
      <div className="work-browser-heading" data-reveal="up">
        <p className="eyebrow">{eyebrow}</p>
      </div>

      <div className="work-browser-layout">
        <div aria-label="Work categories" className="work-browser-nav" data-reveal="left" role="tablist">
          {services.map((service) => {
            const isActive = service.key === activeService;
            const tabId = `${browserId}-${service.number}-tab`;

            return (
              <button
                aria-controls={`${browserId}-panel`}
                aria-selected={isActive}
                className="work-browser-tab"
                id={tabId}
                key={service.key}
                onClick={() => setActiveService(service.key)}
                role="tab"
                type="button"
              >
                <span>{service.number}</span>
                <strong>{service.title}</strong>
                <small>{service.details.join(" · ")}</small>
                <i aria-hidden="true">→</i>
              </button>
            );
          })}
        </div>

        <div
          aria-labelledby={`${browserId}-${selectedService.number}-tab`}
          className="work-browser-panel"
          data-reveal="right"
          id={`${browserId}-panel`}
          role="tabpanel"
        >
          <div className="work-browser-panel-intro">
            <span>{selectedService.number} / 05</span>
            <p>{selectedService.description}</p>
          </div>
          <WorkPortfolioSection service={selectedService} />
        </div>
      </div>
    </section>
  );
}
