"use client";

import { FormEvent, useState } from "react";
import type { HomeContent } from "@/sanity/lib/home";
import { ArrowIcon } from "./ArrowIcon";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function SubscribeSection({ newsletter }: { newsletter: HomeContent["newsletter"] }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/newsletter", {
        body: JSON.stringify({
          email: formData.get("email"),
          website: formData.get("website"),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || newsletter.error);
      }

      form.reset();
      setStatus("success");
      setMessage(result.message || newsletter.success);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : newsletter.error);
    }
  }

  return (
    <section className="subscribe-section section-shell">
      <div className="subscribe-copy">
        <p className="eyebrow">{newsletter.eyebrow}</p>
        <h2>{newsletter.title}</h2>
        <p>{newsletter.description}</p>
      </div>
      <form className="subscribe-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="newsletter-email">
          Your email address
        </label>
        <div aria-hidden="true" className="newsletter-honeypot">
          <label htmlFor="newsletter-website">Website</label>
          <input
            autoComplete="off"
            id="newsletter-website"
            name="website"
            tabIndex={-1}
            type="text"
          />
        </div>
        <div className="input-row">
          <input
            aria-describedby="newsletter-note newsletter-status"
            autoComplete="email"
            disabled={status === "submitting"}
            id="newsletter-email"
            name="email"
            placeholder="Enter your email address"
            required
            type="email"
          />
          <button disabled={status === "submitting"} type="submit">
            {status === "submitting" ? "Joining…" : "Subscribe"}
            <ArrowIcon />
          </button>
        </div>
        <p id="newsletter-note">{newsletter.privacy}</p>
        <p
          aria-live="polite"
          className={`newsletter-status${status === "error" ? " is-error" : ""}`}
          id="newsletter-status"
          role="status"
        >
          {message}
        </p>
      </form>
    </section>
  );
}
