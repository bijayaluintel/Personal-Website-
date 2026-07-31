import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import {
  getWritingCategory,
  writingCategories,
} from "@/constants/writings";
import { getBlogPosts } from "@/lib/blogger";

export const revalidate = 3600;

export async function generateStaticParams() {
  const groups = await Promise.all(
    writingCategories.map(async (category) => {
      const posts = await getBlogPosts(category);
      return posts.map((post) => ({ category: category.slug, slug: post.slug }));
    }),
  );

  return groups.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const category = getWritingCategory(categorySlug);
  if (!category) return {};

  const post = (await getBlogPosts(category)).find((item) => item.slug === slug);
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

  const post = (await getBlogPosts(category)).find((item) => item.slug === slug);
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
        <article className="writing-post">
          <header className="writing-post-header section-shell">
            <Link href={`/writings/${category.slug}`}>
              {category.label}मा फर्कनुहोस्
            </Link>
            <p>{category.label} · {formattedDate}</p>
            <h1>{post.title}</h1>
          </header>
          {post.image && (
            <div className="writing-post-hero section-shell">
              <Image
                alt=""
                fill
                priority
                sizes="(max-width: 700px) 100vw, 1100px"
                src={post.image}
              />
            </div>
          )}
          <div
            className="writing-post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
