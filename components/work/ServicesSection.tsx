import Link from "next/link";
import type { WorkContent } from "@/sanity/lib/work";
import { WorkPortfolioSection } from "./WorkPortfolioSection";

export function ServicesSection({
  eyebrow,
  services,
  activeService,
  brandLogos,
  brandSubsection,
}: {
  eyebrow: string;
  services: WorkContent["services"];
  activeService: WorkContent["services"][number]["key"];
  brandLogos: WorkContent["brandLogos"];
  brandSubsection: "collaboration-showcase" | "brands-worked-with";
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
            <span>{selectedService.number} / {String(services.length).padStart(2, "0")}</span>
            <p>{selectedService.description}</p>
          </div>
          {selectedService.key === "brand-collaborations" && (
            <nav aria-label="Brand collaboration sections" className="brand-subsection-nav">
              <Link aria-current={brandSubsection === "collaboration-showcase" ? "page" : undefined} href="/work-and-collaboration/brand-collaborations/collaboration-showcase">
                Collaboration Showcase
              </Link>
              <Link aria-current={brandSubsection === "brands-worked-with" ? "page" : undefined} href="/work-and-collaboration/brand-collaborations/brands-worked-with">
                Brands Worked With
              </Link>
            </nav>
          )}
          <WorkPortfolioSection brandLogos={brandLogos} brandSubsection={brandSubsection} service={selectedService} />
        </div>
      </div>
    </section>
  );
}
