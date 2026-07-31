import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/home/ArrowIcon";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import {
  getWritingCategory,
  writingCategories,
} from "@/constants/writings";
import { getBlogPosts } from "@/lib/blogger";

export const revalidate = 3600;

export function generateStaticParams() {
  return writingCategories.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getWritingCategory(slug);

  if (!category) return {};

  return {
    title: `${category.label} — Bijaya Luintel`,
    description: category.description,
  };
}

export default async function WritingCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getWritingCategory(slug);
  if (!category) notFound();

  const posts = await getBlogPosts(category);
  const dateFormatter = new Intl.DateTimeFormat("ne-NP", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="writing-archive-hero section-shell">
          <nav aria-label="लेखनका विधाहरू" className="writing-category-nav">
            {writingCategories.map((item) => (
              <Link
                aria-current={item.slug === category.slug ? "page" : undefined}
                href={`/writings/${item.slug}`}
                key={item.slug}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="eyebrow">{category.eyebrow}</p>
          <h1>{category.label}</h1>
          <p>{category.description}</p>
        </section>
        <section className="writing-archive section-shell" aria-label={`${category.label} सूची`}>
          <div className="writing-archive-topline">
            <span>{posts.length} रचना</span>
            <span>नयाँदेखि पुरानोसम्म</span>
          </div>
          {posts.length > 0 ? (
            <div className="writing-archive-list">
              {posts.map((post, index) => (
                <article
                  className={`writing-archive-card${index === 0 ? " is-featured" : ""}${index > 0 && index % 6 === 0 ? " is-wide" : ""}`}
                  key={post.href}
                >
                  <span className="writing-archive-index">{String(index + 1).padStart(2, "0")}</span>
                  <Link
                    aria-label={`${post.title} पढ्नुहोस्`}
                    className={`writing-archive-image${post.image ? "" : " is-placeholder"}`}
                    href={`/writings/${category.slug}/${post.slug}`}
                  >
                    {post.image ? (
                      <Image
                        alt=""
                        fill
                        sizes="(max-width: 700px) 100vw, 260px"
                        src={post.image}
                      />
                    ) : (
                      <span>{category.label}</span>
                    )}
                  </Link>
                  <div className="writing-archive-copy">
                    <time dateTime={post.publishedAt}>
                      {dateFormatter.format(new Date(post.publishedAt))}
                    </time>
                    <h2>
                      <Link href={`/writings/${category.slug}/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && <p>{post.excerpt}</p>}
                    <Link className="writing-archive-read" href={`/writings/${category.slug}/${post.slug}`}>
                      <span>पढ्नुहोस्</span> <ArrowIcon />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="writing-archive-empty">
              <p>रचनाहरू अहिले लोड हुन सकेनन्। मूल ब्लगमा पढ्न सक्नुहुन्छ।</p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
