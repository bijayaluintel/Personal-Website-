import { createHash } from "node:crypto";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type MailchimpError = {
  detail?: string;
  title?: string;
};

export async function POST(request: Request) {
  let payload: { email?: unknown; website?: unknown };

  try {
    payload = (await request.json()) as typeof payload;
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

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix =
    process.env.MAILCHIMP_SERVER_PREFIX ?? apiKey?.split("-").at(-1);

  if (!apiKey || !audienceId || !serverPrefix) {
    return Response.json(
      {
        message:
          "The newsletter is not accepting subscriptions yet. Please check back soon.",
      },
      { status: 503 },
    );
  }

  const subscriberHash = createHash("md5").update(email).digest("hex");
  const endpoint =
    `https://${serverPrefix}.api.mailchimp.com/3.0/lists/` +
    `${encodeURIComponent(audienceId)}/members/${subscriberHash}`;

  try {
    const response = await fetch(endpoint, {
      body: JSON.stringify({
        email_address: email,
        status_if_new: "pending",
      }),
      cache: "no-store",
      headers: {
        Authorization: `Basic ${Buffer.from(`website:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
    });

    if (!response.ok) {
      const providerError = (await response.json().catch(() => ({}))) as MailchimpError;
      console.error("Mailchimp subscription failed:", {
        detail: providerError.detail,
        status: response.status,
        title: providerError.title,
      });
      return Response.json(
        { message: "We couldn’t complete your subscription. Please try again later." },
        { status: 502 },
      );
    }

    const member = (await response.json()) as { status?: string };
    const message =
      member.status === "subscribed"
        ? "You’re already subscribed to the newsletter."
        : "Please check your inbox to confirm your subscription.";

    return Response.json({ message });
  } catch (error) {
    console.error("Mailchimp subscription failed:", error);
    return Response.json(
      { message: "We couldn’t complete your subscription. Please try again later." },
      { status: 502 },
    );
  }
}
