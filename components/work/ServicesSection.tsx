import Link from "next/link";
import type { WorkContent } from "@/sanity/lib/work";
import { WorkPortfolioSection } from "./WorkPortfolioSection";

export function ServicesSection({
  eyebrow,
  services,
  activeService,
}: {
  eyebrow: string;
  services: WorkContent["services"];
  activeService: WorkContent["services"][number]["key"];
}) {
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

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                aria-selected={isActive}
                className="work-browser-tab"
                href={`/work-and-collaboration/${service.key}`}
                key={service.key}
                role="tab"
              >
                <span>{service.number}</span>
                <strong>{service.title}</strong>
                <small>{service.details.join(" · ")}</small>
                <i aria-hidden="true">→</i>
              </Link>
            );
          })}
        </div>

        <div
          aria-label={`${selectedService.title} portfolio`}
          className="work-browser-panel"
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
