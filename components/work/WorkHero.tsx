import { workPageData } from "@/constants/work";

export function WorkHero() {
  const { hero } = workPageData;

  return (
    <section className="page-heading-hero section-shell">
      <p className="eyebrow">{hero.eyebrow}</p>
      <h1>{hero.title}</h1>
    </section>
  );
}
