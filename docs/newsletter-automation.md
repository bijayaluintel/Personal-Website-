# Automatic emails for published writings

Sanity sends a signed webhook when a writing is first published. The website creates a Kit broadcast with its title, excerpt, and a link to the full piece. All four writing categories are included: poems, stories, memoirs, and others. This uses Kit's V4 API, not its paid RSS campaign feature.

The code is not active until it is deployed and the settings below are configured. The existing homepage subscription integration is separate.

## 1. Configure the audience in Kit

Create a segment whose condition is subscribed to the **Newsletter** form (ID `9971096`). Use that segment's numeric ID for `KIT_NEWSLETTER_SEGMENT_ID`. This is a segment ID, not the form ID. Kit handles confirmed recipients and unsubscribes.

Use the segment editor's URL, or the authenticated `GET https://api.kit.com/v4/segments` endpoint, to find the ID. Configure the verified sender and an HTML/classic default email template in Kit, including the unsubscribe link and sender address. Kit's Broadcast API does not support “Starting point” templates.

For an end-to-end test, first use a segment containing only your own confirmed test address.

## 2. Add Production environment variables in the existing Vercel project

| Variable | Value |
| --- | --- |
| `KIT_API_KEY` | Existing Kit V4 key |
| `KIT_FORM_ID` | `9971096`, used by the homepage signup |
| `KIT_NEWSLETTER_SEGMENT_ID` | Numeric ID of the audience segment above |
| `SITE_URL` | Full canonical HTTPS website URL, such as `https://your-domain.com` |
| `SANITY_NEWSLETTER_WRITE_TOKEN` | Sanity API token with permission to read published writings and create/update `newsletterDelivery` documents |
| `SANITY_NEWSLETTER_WEBHOOK_SECRET` | A long random secret shared with the webhook below |
| `NEWSLETTER_AUTO_SEND` | `false` to create drafts during setup; `true` to schedule automatic emails |

The existing `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` must also be configured. Create the Sanity token in the project's **API → Tokens** settings. Where custom roles are available, restrict writes to `newsletterDelivery`; otherwise an Editor token provides the needed access. Keep both API tokens and the webhook secret server-side and out of Git. No `NEXT_PUBLIC_` prefix for secrets.

Generate the webhook secret locally, for example with `openssl rand -hex 32`, and save it securely. Redeploy after changing environment variables. Do not configure a publishing webhook against a preview deployment.

## 3. Create the Sanity webhook

In [Sanity Manage](https://www.sanity.io/manage), select the project, then **API → Webhooks → Create webhook**.

- Name: `Email new writings through Kit`
- URL: `https://your-domain.com/api/newsletter/publish`
- Dataset: the website's production dataset
- Method: **POST**
- Trigger on: **Create only** (leave Update and Delete off)
- Drafts and versions: **off**
- Secret: same value as `SANITY_NEWSLETTER_WEBHOOK_SECRET`
- Filter:

```groq
_type == "writing" &&
!(_id in path("drafts.**")) &&
!(_id in path("versions.**")) &&
defined(slug.current) && defined(title) && defined(excerpt) && defined(publishedAt)
```

- Projection:

```groq
{_id, _type, "operation": delta::operation()}
```

Publishing a new document creates its published version and triggers the webhook. Editing an already published document is an update and does not trigger another email. Delivery records have a different document type, so they cannot retrigger this webhook.

## 4. Test, then enable automatic sends

1. Deploy with `NEWSLETTER_AUTO_SEND=false` and your test segment ID.
2. Publish a new writing in Studio with a title, slug, category, excerpt, and publication date.
3. Check **Kit → Broadcasts** for the draft. Confirm the destination link, audience, subject, Nepali text, footer, and sender. Send a preview to yourself in Kit.
4. In **Studio → Newsletter Deliveries**, confirm the entry says `draft` and has a broadcast ID.
5. Change `NEWSLETTER_AUTO_SEND=true`, redeploy, and publish another new writing to test an automatic send to the test segment.
6. Switch `KIT_NEWSLETTER_SEGMENT_ID` to the Newsletter form's segment and redeploy. Future new publications now schedule emails automatically.

Draft-mode publications remain drafts; changing the flag does not send those drafts or backfill old writings. Send or delete those drafts manually in Kit as appropriate. A future publication date delays the email until five minutes after that date; the field itself is not a website publication scheduler.

## Everyday workflow

Publish a new writing in Sanity. An email is scheduled approximately five minutes after the webhook runs (or after the publication date, if later). The delay gives the website cache time to refresh. Kit controls final delivery time. You can inspect or cancel the scheduled broadcast in Kit.

“Scheduled” in Studio means Kit accepted the broadcast; check Kit for actual delivery, opens, and bounces. Editing or unpublishing a writing does not change or cancel an email already scheduled in Kit. Cancel it there if needed.

## Retries and troubleshooting

Each writing has a separate persistent delivery record. The atomic create of that record allows only one request to submit a broadcast. Retries and concurrent requests cannot submit it again. Unpublishing and republishing a writing with a delivery record also cannot resend it. Republishing older content that has never had a delivery record can trigger its first email; avoid doing that when you only intend to edit an old piece.

If the webhook fails, inspect Vercel logs, Sanity webhook delivery attempts, and **Newsletter Deliveries**. Missing configuration or an unavailable Sanity read happens before a delivery record is reserved and can be retried normally.

After a delivery record is reserved, failures deliberately require review. There is no automatic resend after an ambiguous network timeout: Kit may have accepted and scheduled the broadcast even if its response never reached the website.

- `failed`: Kit returned a 4xx rejection. Correct the segment, key, template, or account issue before retrying.
- `needsReview`, or `processing` persisting for over a minute: search Kit broadcasts for the writing title. Its broadcast description contains the delivery record ID. It may already be scheduled or sent.
- If the broadcast exists, record its ID and `scheduled`/`draft` status using Sanity's API or Vision mutations. Do not create another broadcast.
- Only after verifying that Kit has **no** corresponding broadcast should a developer delete that specific delivery record and retry the original webhook from Sanity. Never delete records for scheduled or sent emails. These records are read-only in Studio to prevent accidental resets.

No live test emails or broadcasts are created by the repository's automated tests.

## References

- [Kit Create Broadcast API](https://developers.kit.com/api-reference/broadcasts/create-a-broadcast)
- [Kit free plan features and API access](https://help.kit.com/en/articles/16627071-the-kit-free-plan)
- [Sanity webhooks](https://www.sanity.io/docs/content-lake/webhooks)
- [Signed webhooks in Next.js](https://www.sanity.io/docs/nextjs/validating-sanity-webhooks-nextjs)
