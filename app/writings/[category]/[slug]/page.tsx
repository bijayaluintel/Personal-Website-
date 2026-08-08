import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { ArticleShare } from "@/components/writings/ArticleShare";
import { PhotoCredit, WritingBody, WritingVideo } from "@/components/writings/WritingBody";
import {
  getWritingCategory,
} from "@/constants/writings";
import {
  getWritingPost,
  getWritingStaticParams,
} from "@/sanity/lib/writings";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return getWritingStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const category = getWritingCategory(categorySlug);
  if (!category) return {};

  const post = await getWritingPost(category.slug, slug);
  if (!post) return {};

  return {
    title: `${post.title} — Bijaya Luintel`,
    description: post.excerpt.slice(0, 160),
  };
}

export default async function WritingPostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;
  const category = getWritingCategory(categorySlug);
  if (!category) notFound();

  const post = await getWritingPost(category.slug, slug);
  if (!post) notFound();

  const formattedDate = new Intl.DateTimeFormat("ne-NP", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(post.publishedAt));

  return (
    <>
      <SiteHeader />
      <main id="top">
        <article className={`writing-post writing-post-${category.slug}`}>
          <header className="writing-post-header section-shell">
            <Link href={`/writings/${category.slug}`}>
              {category.label}मा फर्कनुहोस्
            </Link>
            <p>{category.label} · {formattedDate}</p>
            <h1>{post.title}</h1>
          </header>
          {post.image && (
            <figure className="writing-post-hero-figure section-shell">
              <div className="writing-post-hero">
                <Image
                  alt={post.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 700px) 100vw, 1100px"
                  src={post.image}
                />
              </div>
              {post.imageCredit && (
                <figcaption>
                  <PhotoCredit credit={post.imageCredit} url={post.imageCreditUrl} />
                </figcaption>
              )}
            </figure>
          )}
          <div className="writing-post-content">
            {post.video && <WritingVideo video={post.video} />}
            {post.body && <WritingBody value={post.body} />}
          </div>
          <ArticleShare title={post.title} />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
