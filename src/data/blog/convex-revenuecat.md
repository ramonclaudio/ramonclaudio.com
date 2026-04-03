---
author: Ray
pubDatetime: 2026-04-02T23:00:00Z
title: "Building convex-revenuecat: Server-Side Entitlements for Expo"
slug: building-convex-revenuecat
featured: true
draft: false
tags:
  - project
  - convex
  - revenuecat
  - expo
  - typescript
description: I needed server-side entitlement checks in my Convex app. No component existed. So I built one.
---

I use Convex for everything. Auth, database, real-time queries, cron jobs, the whole backend. So when I entered the RevenueCat Shipyard Hackathon and started building an Expo app called DreamSeeker, naturally the backend was Convex.

The problem came when I needed to check if a user had premium access. RevenueCat's SDK handles purchases on the client, but server-side? The only option was hitting their API on every request. No caching, no reactivity, just a blocking HTTP call every time someone opened a gated screen. For a Convex app that felt completely wrong.

I went looking for a component that handled this. Nothing existed. So I built one during the hackathon, testing it against real sandbox purchases in DreamSeeker as I went.

I'd been deep in the Convex ecosystem for a while at that point, PRing bug fixes to their [better-auth component](https://github.com/get-convex/better-auth) and using components in every project. I'd replied to one of their posts back in August with "Yea. I see the vision with components!" Turns out they were running a component authoring challenge at the same time as the hackathon. I submitted what I had, it got accepted, and it's been on [convex.dev/components](https://www.convex.dev/components/ramonclaudio-convex-revenuecat) since.

I didn't win the hackathon. Honestly I spent more time on the component than the actual submission, but it was my first hackathon so I'll take it.

### How it works

You mount a webhook handler, point RevenueCat at it, and the component keeps subscription state in your Convex database. The core query is `hasEntitlement()`, which returns a boolean. Since it's a Convex query, it's reactive: a user buys premium, the webhook fires, the UI unlocks. No polling.

The edge cases took longer than the happy path. The one that got me was cancellation. I assumed it revoked access. It doesn't. The user keeps access until their subscription actually expires. I shipped a broken version of DreamSeeker before I figured that out, and then I fixed it in the component so the default behavior is correct.

### Sync

I left sync out of the initial release on purpose. Webhooks only, one data path, keep it simple.

Then someone [opened an issue](https://github.com/ramonclaudio/convex-revenuecat/issues/12) saying webhooks weren't always firing in their setup. They'd been calling RevenueCat's REST API manually as a fallback. The problem is the component owns the tables, so if a webhook gets dropped the consumer has no way to fix the data. I added `syncSubscriber` in v0.1.11: you fetch from their API, pass the raw subscriber object, and the component upserts everything. If a webhook shows up later, it reconciles instead of duplicating.

[`convex-revenuecat`](https://www.npmjs.com/package/convex-revenuecat) is on npm and gets about 460 downloads a week. [Repo here](https://github.com/ramonclaudio/convex-revenuecat).

\- Ray
