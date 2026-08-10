import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { getMediaFeaturesContent, type MediaFeatureItem } from "@/sanity/lib/mediaFeatures";

export const metadata: Metadata = {
  title: "Media Features — Bijaya Luintel",
  description: "Selected conversations, profiles, and appearances featuring Bijaya Luintel.",
};

function FeatureImage({ item }: { item: MediaFeatureItem }) {
  return (
    <div className={`media-feature-image${item.image ? "" : " is-placeholder"}`}>
      {item.image ? (
        <Image
          alt={item.imageAlt}
          fill
          sizes="(max-width: 700px) 92vw, 640px"
          src={item.image}
        />
      ) : (
        <>
          <span className="media-feature-placeholder-mark">BL</span>
          <span>Publication image</span>
        </>
      )}
      <small>{item.number}</small>
    </div>
  );
}

export default async function MediaFeaturesPage() {
  const { eyebrow, label, items } = await getMediaFeaturesContent();

  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="media-page-hero section-shell">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{label}</h1>
        </section>

        <section className="media-feature-library section-shell" aria-label="Media features">
          <div className={`media-feature-grid${items.length === 3 ? " has-three-items" : ""}`}>
            {items.map((item, index) => (
              <article className={`media-feature-card${index === 0 ? " is-featured" : ""}`} key={item.id ?? item.number}>
                {item.href ? (
                  <a aria-label={`${item.title} पढ्नुहोस्`} href={item.href} rel="noreferrer" target="_blank">
                    <FeatureImage item={item} />
                  </a>
                ) : (
                  <FeatureImage item={item} />
                )}
                <div className="media-feature-copy">
                  <p>{item.source}</p>
                  <h2>
                    {item.href ? (
                      <a href={item.href} rel="noreferrer" target="_blank">{item.title}</a>
                    ) : item.title}
                  </h2>
                  <span>{item.description}</span>
                  {item.href && (
                    <a className="media-feature-link" href={item.href} rel="noreferrer" target="_blank">
                      Read feature <span>↗</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
