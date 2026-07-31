import Image from "next/image";
import Link from "next/link";
import { siteData } from "@/constants/home";
import { ArrowIcon } from "./ArrowIcon";

export function WritingsSection() {
  return (
    <section className="writings-section section-shell" id="writings">
      <div className="section-heading">
        <p className="eyebrow">Featured writing</p>
        <h2>Featured posts</h2>
      </div>
      <div className="writings-grid">
        {siteData.writings.map((post) => (
          <article className="writing-card" key={post.href}>
            <div className="writing-meta">
              <span>{post.number}</span>
              <span>{post.type}</span>
            </div>
            <Link
              aria-label={`${post.title} पढ्नुहोस्`}
              className="featured-writing-image"
              href={post.href}
            >
              <Image
                alt={post.imageAlt}
                fill
                sizes="(max-width: 700px) 92vw, 380px"
                src={post.image}
              />
            </Link>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <Link href={post.href} aria-label={`${post.title} पढ्नुहोस्`}>
              पूरा पढ्नुहोस् <ArrowIcon />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
