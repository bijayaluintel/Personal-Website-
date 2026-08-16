import Image from "next/image";
import Link from "next/link";
import type { HomeContent } from "@/sanity/lib/home";
import { ArrowIcon } from "./ArrowIcon";

export function HeroSection({ hero }: { hero: HomeContent["hero"] }) {
  return (
    <section className="hero section-shell" id="about">
      <div className="hero-copy">
        <h1>{hero.title}</h1>
        <p className="hero-roles">{hero.roles}</p>
        <div className="hero-tagline" style={{ textAlign: hero.taglineAlignment }}>
          {hero.tagline.split(/\r?\n+/).map((paragraph) => paragraph.trim()).filter(Boolean).map((paragraph, index) => (
            <p key={`${index}-${paragraph}`}>{paragraph}</p>
          ))}
        </div>
        <div className="button-row">
          <Link className="button button-dark" href="/writings/poems">
            Read my writings<ArrowIcon />
          </Link>
          <Link className="text-link" href="/work-and-collaboration/scriptwriting">
            Work &amp; collaboration<ArrowIcon />
          </Link>
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
