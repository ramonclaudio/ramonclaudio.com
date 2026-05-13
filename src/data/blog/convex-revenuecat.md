---
author: Ray
pubDatetime: 2026-04-02T23:00:00Z
title: "Building convex-revenuecat: Server-Side Entitlements for Convex"
slug: building-convex-revenuecat
featured: true
draft: false
tags:
  - project
  - convex
  - revenuecat
  - typescript
description: I needed server-side entitlement checks in my Convex app. No component existed. So I built one.
---

I wanted to enter my first hackathon. [RevenueCat Shipyard](https://www.revenuecat.com/shipyard) was running, so I joined. The app was Expo with Convex and Better Auth, and I needed to gate features by subscription. RevenueCat's SDK handles purchases on the client fine, but checking entitlements on the server meant hitting their [REST API](https://www.revenuecat.com/docs/customers/customer-info) on every request. No caching, no reactivity, a blocking HTTP call every time someone opened a gated screen.

No Convex component existed, so I built one during the hackathon as a side project, tested it against real sandbox purchases in the app, and published it to npm as [`convex-revenuecat`](https://www.npmjs.com/package/convex-revenuecat) in case anyone else hit the same wall.

```bash
npm install convex-revenuecat
```

Convex happened to be running a [component authoring challenge](https://www.convex.dev/component-authoring?ref=ramonclaudio.com) at the same time, so I submitted what I had. It got accepted, won a $100 gift card, and is now listed on [convex.dev/components](https://www.convex.dev/components/ramonclaudio-convex-revenuecat). I'd already been PRing bug fixes to their better-auth component ([#218](https://github.com/get-convex/better-auth/pull/218), [#245](https://github.com/get-convex/better-auth/pull/245), [#267](https://github.com/get-convex/better-auth/pull/267), [#278](https://github.com/get-convex/better-auth/pull/278)) so I was deep in the Convex ecosystem already.

I didn't place in the RevenueCat hackathon. Spent way more time on the component than the submission.

### How it works

RevenueCat emits a webhook for every subscription event: purchase, renewal, cancellation, pause, transfer, refund, and around a dozen others. The component registers one HTTP handler at `/webhooks/revenuecat`. On each POST it does four things before dispatch:

1. Validates the `Authorization` header against `REVENUECAT_WEBHOOK_AUTH`
2. Rate limits 100 requests/minute per webhook secret
3. Dedupes on `event.id` (UUID, capped at 128 bytes so a compromised token can't inflate storage with megabyte keys)
4. Routes the payload to the matching internal handler by `event.type`

Each handler upserts into the right table (`customers`, `subscriptions`, `entitlements`, `invoices`, `virtualCurrencyBalances`, `experimentEnrollments`, etc.), then records a before/after snapshot of the user's entitlement state in `webhookEvents` so any transition can be audited. The whole thing runs inside a single Convex mutation, so every write in one event either lands or none do.

### Entitlement checks

`hasEntitlement` is a Convex query. Queries are reactive by default, so any UI bound to it updates the moment a webhook flips the state:

```typescript
export const checkPremium = query({
  args: { appUserId: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    return await revenuecat.hasEntitlement(ctx, {
      appUserId: args.appUserId,
      entitlementId: "premium",
    });
  },
});
```

No polling, no client-side state to invalidate, no REST call to RevenueCat on the read path.

### The edge cases

The happy path was the easy part. The RC docs bury the subtleties.

The one that got me was cancellation. I assumed it revoked access. It doesn't. The user keeps the entitlement until `expirationAtMs`, and I shipped a broken version of the app before I figured that out. Pause is the same: doesn't revoke, entitlement stays active through the billing pause. Grace periods too. A failed charge starts a grace window and access continues until it expires.

Refunds, on the other hand, revoke immediately. RC sends a `CANCELLATION` with `cancel_reason: "CUSTOMER_SUPPORT"`, the component picks that up and expires the entitlement right away instead of waiting for the billing window to close. Transfers are the trickiest of the bunch: a single webhook deactivates on one `appUserId` and activates on another in the same mutation.

### Transition hooks

When an entitlement flips between active and not-active, the component fires user-supplied callbacks. They fire exactly once per `(appUserId, entitlementId)` transition regardless of the trigger (`INITIAL_PURCHASE`, `RENEWAL`, `REFUND_REVERSED`, a transfer, or a sync), and the `sourceEventType` arg tells you which. Handy for "thanks for subscribing" emails, feature-flag backfills, or revenue logging without duplicating logic across every event handler.

```typescript
const revenuecat = new RevenueCat(components.revenuecat, {
  REVENUECAT_WEBHOOK_AUTH: process.env.REVENUECAT_WEBHOOK_AUTH,
  hooks: {
    onEntitlementActivated: internal.revenuecat.onActivated,
    onEntitlementDeactivated: internal.revenuecat.onDeactivated,
  },
});
```

### Sync

I left sync out of the initial release on purpose. Webhooks only, one data path, keep it simple.

Then someone [opened an issue](https://github.com/ramonclaudio/convex-revenuecat/issues/12) saying webhooks weren't always firing in their setup. They'd been calling RevenueCat's REST API manually as a workaround. The component owns the tables, so if a webhook drops there's no way to patch the data from outside. I added `syncSubscriber` in [v0.1.11](https://github.com/ramonclaudio/convex-revenuecat/releases/tag/v0.1.11): fetch the subscriber from RC's `/v1/subscribers` endpoint, pass the raw payload in, and the component upserts everything. Writes are idempotent and indexed by `originalTransactionId`, so if a delayed webhook arrives after a sync, it reconciles instead of duplicating.

Same transition hooks fire on sync-driven transitions with `sourceEventType: "SYNC"`.

### Where it is now

First release was January 2026. 14 versions later, around 5,700 downloads on npm. Listed on the [Convex Components Directory](https://www.convex.dev/components/ramonclaudio-convex-revenuecat). [Source](https://github.com/ramonclaudio/convex-revenuecat).

\- Ray
