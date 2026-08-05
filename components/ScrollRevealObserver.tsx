"use client";

import { useEffect } from "react";

export function ScrollRevealObserver() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.documentElement.classList.add("reveal-ready");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.dataset.revealed = "true";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          (entry.target as HTMLElement).dataset.revealed = "true";
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      },
    );

    const observeElement = (element: HTMLElement) => {
      if (element.dataset.revealed !== "true") observer.observe(element);
    };

    elements.forEach(observeElement);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;

          if (node.matches("[data-reveal]")) observeElement(node);
          node.querySelectorAll<HTMLElement>("[data-reveal]").forEach(observeElement);
        });
      });
    });

    mutationObserver.observe(document.body, {childList: true, subtree: true});

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
