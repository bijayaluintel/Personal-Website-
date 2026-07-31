import { cache } from "react";
import type { WritingCategory } from "@/constants/writings";

export type BlogPost = {
  title: string;
  publishedAt: string;
  href: string;
  slug: string;
  excerpt: string;
  image: string | null;
  content: string;
};

type BloggerText = { $t?: string };
type BloggerLink = { rel?: string; href?: string };
type BloggerEntry = {
  title?: BloggerText;
  published?: BloggerText;
  summary?: BloggerText;
  content?: BloggerText;
  link?: BloggerLink[];
  media$thumbnail?: { url?: string };
};
type BloggerFeed = {
  feed?: {
    entry?: BloggerEntry[];
  };
};

const namedEntities: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

function cleanExcerpt(value: string) {
  const text = value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (_, entity: string) => {
      if (entity.startsWith("#x")) {
        return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
      }
      if (entity.startsWith("#")) {
        return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
      }
      return namedEntities[entity.toLowerCase()] ?? " ";
    })
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^(?:photo|फोटो)\s*(?:by)?\s*:?\s*[^ऀ-ॿ]*(?=[ऀ-ॿ])/i, "")
    .trim();

  if (text.length <= 220) return text;

  const shortened = text.slice(0, 220);
  const lastCompleteWord = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastCompleteWord > 160 ? lastCompleteWord : 220).trim()}…`;
}

function normalizeImageUrl(value: string) {
  if (value.startsWith("//")) return `https:${value}`;
  return value.replace(/^http:/, "https:");
}

function getImage(entry: BloggerEntry, content: string) {
  const contentImage = content.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
  const image = contentImage ?? entry.media$thumbnail?.url;
  return image ? normalizeImageUrl(image) : null;
}

function sanitizePostHtml(value: string) {
  return value
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, "")
    .replace(/\son\w+\s*=\s*(["']).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, '$1="#"');
}

function removeFirstContentImage(value: string) {
  return value.replace(/<img\b[^>]*>/i, "");
}

function getPostSlug(href: string) {
  const pathname = new URL(href).pathname;
  return pathname.split("/").at(-1)?.replace(/\.html$/, "") ?? pathname;
}

export const getBlogPosts = cache(
  async (category: WritingCategory): Promise<BlogPost[]> => {
    const label = encodeURIComponent(category.bloggerLabel);
    const url = `https://bijaywrites.blogspot.com/feeds/posts/default/-/${label}?alt=json&max-results=100`;

    try {
      const response = await fetch(url, { next: { revalidate: 3600 } });
      if (!response.ok) return [];

      const data = (await response.json()) as BloggerFeed;

      return (data.feed?.entry ?? []).flatMap((entry) => {
        const title = entry.title?.$t?.trim();
        const publishedAt = entry.published?.$t;
        const href = entry.link?.find((link) => link.rel === "alternate")?.href;
        const rawContent = entry.content?.$t ?? entry.summary?.$t ?? "";
        const excerpt = cleanExcerpt(entry.summary?.$t ?? rawContent);

        if (!title || !publishedAt || !href) return [];
        return [{
          title,
          publishedAt,
          href,
          slug: getPostSlug(href),
          excerpt,
          image: getImage(entry, rawContent),
          content: removeFirstContentImage(sanitizePostHtml(rawContent)),
        }];
      });
    } catch {
      return [];
    }
  },
);
