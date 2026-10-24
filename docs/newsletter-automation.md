# Curated newsletters: Sanity → Kit draft → client sends

The client chooses one or more already published poems or articles, arranges them, and creates **one Kit draft**. The client reviews that email and sends or schedules it in Kit. Publishing or updating an article does not create or send an email.

## After upgrading from the old article automation

1. Keep the old article-publishing webhook disabled.
2. Deploy this updated code to the existing Vercel project. The embedded Sanity Studio updates with it.
3. Keep the existing Kit key, form ID, segment ID, site URL, Sanity token and webhook secret.
4. Configure a new webhook for `newsletterIssue` using the instructions below.
5. Test one issue and inspect the draft in Kit before sending it.

`NEWSLETTER_AUTO_SEND` is no longer used. You can remove it from Vercel. Even if an old value is `true`, this implementation always submits `send_at: null` and `public: false` to Kit. It cannot schedule or send a broadcast. Cancel any broadcasts scheduled by the old version separately in Kit; deploying this change does not cancel them.

## Vercel Production settings

| Variable | Value |
| --- | --- |
| `KIT_API_KEY` | Existing Kit V4 key |
| `KIT_FORM_ID` | `9971096` — used by homepage signups |
| `KIT_NEWSLETTER_SEGMENT_ID` | `601403` — verify this segment contains the Newsletter form's subscribers |
| `SITE_URL` | Canonical HTTPS website URL |
| `SANITY_NEWSLETTER_WRITE_TOKEN` | Token that can read newsletter issues/published writings and create/update `newsletterDelivery` documents |
| `SANITY_NEWSLETTER_WEBHOOK_SECRET` | Same private secret configured on the webhook |

The existing `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are also required. No new secrets are needed if all the prior setup is complete. A restricted Sanity role must now allow reading `newsletterIssue` as well as writings and delivery records. An existing Editor token already has the needed access. Redeploy after environment changes. Keep secrets out of Git and never prefix them with `NEXT_PUBLIC_`.

Configure Kit's verified sender and a supported default HTML/classic email template with its unsubscribe link and sender address. The Broadcast API does not support “Starting point” templates.

## Create the Newsletter Issues webhook

In [Sanity Manage](https://www.sanity.io/manage), open the project → **API → Webhooks → Create webhook**.

| Setting | Value |
| --- | --- |
| Name | Create newsletter draft in Kit |
| URL | `https://YOUR-DOMAIN.com/api/newsletter/publish` |
| Dataset | Website's production dataset |
| Method | POST |
| Trigger | **Create only**; Update and Delete off |
| Drafts and versions | Off |
| Secret | Existing `SANITY_NEWSLETTER_WEBHOOK_SECRET` |
| Enabled | On |

Filter:

```groq
_type == "newsletterIssue" &&
!(_id in path("drafts.**")) &&
!(_id in path("versions.**"))
```

Projection:

```groq
{_id, _type, "operation": delta::operation()}
```

The **Create draft in Kit** action uses Sanity's validated publish operation on the newsletter issue. This creates its published version and triggers the webhook. Merely saving the issue does not trigger it. Newsletter issues are not rendered as website articles. Article events are also explicitly rejected by the endpoint if the old webhook is accidentally re-enabled.

## Client workflow and first test

1. Publish articles normally in Sanity, or use articles already on the website.
2. Open **Newsletter Issues → New**.
3. Enter an email subject and optional introduction.
4. Select **one or more distinct published writings** and drag them into the desired order. Each must have a title, excerpt, category and URL slug. The backend reads published content, excluding unpublished edits.
5. Click **Create draft in Kit**. This prepares an email; it does not send it.
6. Check **Newsletter Deliveries** for a `draft` entry and Kit broadcast ID. The issue button says “Draft requested” after publishing; that alone does not confirm webhook success.
7. Open **Kit → Broadcasts** and find the draft by its subject.
8. Review the sender, recipients (Website Newsletter segment), introduction, article order, links and footer. Send a preview to your own email using Kit.
9. When ready, send or schedule the email from Kit. Kit manages confirmed recipients and unsubscribes.

The email contains each selection's title, excerpt and link to its full website page. One issue produces one draft. Further changes to the issue or its articles do not update a Kit draft: edit the email in Kit. Create a new issue for the next newsletter. Studio's delivery status tracks draft creation, not subsequent sends, opens or bounces; view those in Kit.

## Troubleshooting and duplicate protection

An atomic Sanity delivery record reserves each issue before contacting Kit. Concurrent webhook calls, retries and republishing cannot create another draft for the same issue. Legacy delivery records are retained.

Check Sanity's webhook delivery log, Vercel logs and **Newsletter Deliveries** when a draft does not appear. A selected article that was deleted or unpublished before processing prevents the entire draft from being created; nothing is silently omitted.

Missing configuration and content errors happen before the record is reserved. Fix the problem and retry the original webhook. If you need to correct the issue's published data after submission, a developer can update it through Sanity's API before retrying; creating a replacement issue is also possible, but do not retry both issues later.

After reservation, a failure requires review:

- `failed`: Kit returned a 4xx rejection. Correct the key, segment, template, account or rate-limit issue.
- `needsReview`, or `processing` persisting for over a minute: Kit may have created a draft even though the response was lost. Search Kit by subject; the broadcast description contains the delivery record ID.
- If the draft exists, record its ID and `draft` status using Sanity's API. Do not create another draft.
- Only after verifying that Kit has no corresponding broadcast should a developer delete that specific delivery record and retry the original webhook. Studio keeps delivery records read-only to prevent accidental resets.

No messages are sent by repository tests. Run `npm run test:newsletter` to check selection validation, draft-only behavior, ignored article events and duplicate protection.

## References

- [Kit Create Broadcast API](https://developers.kit.com/api-reference/broadcasts/create-a-broadcast)
- [Sanity document actions](https://www.sanity.io/docs/studio/document-actions)
- [Sanity webhooks](https://www.sanity.io/docs/content-lake/webhooks)
