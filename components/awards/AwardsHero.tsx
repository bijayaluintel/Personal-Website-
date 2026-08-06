export function AwardsHero({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="page-heading-hero section-shell" data-reveal="up">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
    </section>
  );
}
