const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: { email?: unknown; website?: unknown };

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json({ message: "Please submit a valid email address." }, { status: 400 });
    }
    payload = body as typeof payload;
  } catch {
    return Response.json({ message: "Please submit a valid email address." }, { status: 400 });
  }

  // Quietly accept bot submissions without forwarding them.
  if (typeof payload.website === "string" && payload.website.length > 0) {
    return Response.json({ message: "Please check your inbox to confirm your subscription." });
  }

  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return Response.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  if (!apiKey || !formId || !/^\d+$/.test(formId)) {
    return Response.json(
      {
        message:
          "The newsletter is not accepting subscriptions yet. Please check back soon.",
      },
      { status: 503 },
    );
  }

  try {
    const headers = {
      "X-Kit-Api-Key": apiKey,
      "Content-Type": "application/json",
    };
    // Kit requires a subscriber to exist before they can join a form.
    // New subscribers wait for confirmation; existing subscribers keep their state.
    const subscriberResponse = await fetch("https://api.kit.com/v4/subscribers", {
      method: "POST",
      headers,
      body: JSON.stringify({ email_address: email, state: "inactive" }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!subscriberResponse.ok) {
      console.error("Kit subscriber creation failed:", subscriberResponse.status);
      throw new Error("Kit subscriber creation failed");
    }

    const response = await fetch(
      `https://api.kit.com/v4/forms/${encodeURIComponent(formId)}/subscribers`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ email_address: email }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!response.ok) {
      console.error("Kit form subscription failed:", response.status);
      throw new Error("Kit form subscription failed");
    }

    const result = (await response.json()) as { subscriber?: { state?: string } };
    const message = result.subscriber?.state === "active"
      ? "You’re subscribed to the newsletter."
      : "Please check your inbox to confirm your subscription.";

    return Response.json({ message });
  } catch {
    // Keep provider responses, subscriber details, and credentials out of client errors.
    return Response.json(
      { message: "We couldn’t complete your subscription. Please try again later." },
      { status: 502 },
    );
  }
}
