import Image from "next/image";
import type { HomeContent } from "@/sanity/lib/home";
import { ArrowIcon } from "./ArrowIcon";

export function HeroSection({ hero }: { hero: HomeContent["hero"] }) {
  return (
    <section className="hero section-shell" id="about">
      <div className="hero-copy">
        <h1>{hero.title}</h1>
        <p className="hero-roles">{hero.roles}</p>
        <p className="hero-tagline">{hero.tagline}</p>
        <div className="button-row">
          <a className="button button-dark" href={hero.primaryCta.href}>
            {hero.primaryCta.label}<ArrowIcon />
          </a>
          <a className="text-link" href={hero.secondaryCta.href}>
            {hero.secondaryCta.label}<ArrowIcon direction="down" />
          </a>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-image-frame">
          <Image alt={hero.imageAlt} fill priority sizes="(max-width: 760px) 88vw, 44vw" src={hero.image} />
        </div>
        {/* <p className="image-note">Words for the spaces in between.</p> */}
      </div>
    </section>
  );
}
