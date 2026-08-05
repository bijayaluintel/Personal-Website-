"use client";

import { useState } from "react";

type ShareTarget = "facebook" | "x" | "whatsapp" | "email";

export function ArticleShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function getShareDetails() {
    const url = window.location.href.split("#")[0];
    return { url, encodedUrl: encodeURIComponent(url), encodedTitle: encodeURIComponent(title) };
  }

  function shareTo(target: ShareTarget) {
    const { encodedTitle, encodedUrl } = getShareDetails();
    const urls: Record<Exclude<ShareTarget, "email">, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    };

    if (target === "email") {
      window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`;
      setIsOpen(false);
      return;
    }

    window.open(urls[target], "_blank", "noopener,noreferrer,width=720,height=620");
    setIsOpen(false);
  }

  async function shareNative() {
    const { url } = getShareDetails();

    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
        setIsOpen(false);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    await copyLink();
  }

  async function copyLink() {
    const { url } = getShareDetails();

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setIsOpen(false);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy this article link:", url);
    }
  }

  return (
    <aside
      className="article-share"
      aria-label="Share this article"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setIsOpen(false);
      }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className="article-share-caption">Share this article</span>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Show article sharing options"
        className="article-share-trigger"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <circle cx="6" cy="12" r="2.2" stroke="currentColor" />
          <circle cx="17.5" cy="6" r="2.2" stroke="currentColor" />
          <circle cx="17.5" cy="18" r="2.2" stroke="currentColor" />
          <path d="m8 11 7.4-3.8M8 13l7.4 3.8" stroke="currentColor" strokeLinecap="round" />
        </svg>
      </button>
      <div className={`article-share-menu${isOpen ? " is-open" : ""}`} role="menu">
        <button onClick={shareNative} role="menuitem" type="button">Device share <span>↗</span></button>
        <button onClick={() => shareTo("facebook")} role="menuitem" type="button">Facebook</button>
        <button onClick={() => shareTo("x")} role="menuitem" type="button">X</button>
        <button onClick={() => shareTo("whatsapp")} role="menuitem" type="button">WhatsApp</button>
        <button onClick={() => shareTo("email")} role="menuitem" type="button">Email</button>
        <button onClick={copyLink} role="menuitem" type="button">Copy link</button>
      </div>
      <p aria-live="polite" className={`article-share-status${copied ? " is-visible" : ""}`}>
        Link copied ✓
      </p>
    </aside>
  );
}
