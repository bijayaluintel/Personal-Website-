export function WorkHero({ hero }: { hero: { eyebrow: string; title: string } }) {
  return (
    <section className="page-heading-hero section-shell" data-reveal="up">
      <p className="eyebrow">{hero.eyebrow}</p>
      <h1>{hero.title}</h1>
    </section>
  );
}
