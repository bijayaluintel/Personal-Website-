import type { Metadata } from "next";
import { ScrollRevealObserver } from "@/components/ScrollRevealObserver";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { getExperienceContent } from "@/sanity/lib/experience";

export const metadata: Metadata = {
  title: "Experience — Bijaya Luintel",
  description:
    "A timeline of writing, performance, publishing, translation, and creative collaboration by Bijaya Luintel.",
};

export default async function ExperiencePage() {
  const { hero, experiences } = await getExperienceContent();

  return (
    <>
      <SiteHeader />
      <main id="top">
        <ScrollRevealObserver />
        <section className="page-heading-hero section-shell experience-hero" data-reveal="up">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{hero.title}</h1>
        </section>

        <section className="experience-timeline section-shell" aria-label="Experience timeline">
          <ol className="timeline-list">
            {experiences.map((experience, index) => (
              <li
                className="timeline-entry"
                data-reveal="up"
                key={experience.id ?? `${experience.period}-${experience.title}`}
              >
                <div className="timeline-period">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <time>{experience.period}</time>
                </div>
                <div aria-hidden="true" className="timeline-marker">
                  <span />
                </div>
                <article className="timeline-content">
                  <div className="timeline-content-meta">
                    <p>{experience.organization}</p>
                    <span>{experience.location}</span>
                  </div>
                  <h2>{experience.title}</h2>
                  <p>{experience.description}</p>
                  <ul aria-label="Areas of work">
                    {experience.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
