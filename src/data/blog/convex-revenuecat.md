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

I was building an app for the [RevenueCat Shipyard Hackathon](https://www.revenuecat.com/shipyard) (Expo, Convex, Better Auth), the usual stack, and everything was pretty much wired up when I realized the SDK doesn't support server-side entitlement checks. It handles purchases on the client fine, but on the server the only option was hitting their [REST API](https://www.revenuecat.com/docs/customers/customer-info) on every request. No caching, no reactivity, just a blocking HTTP call every time someone opened a gated screen. That just felt wrong.

I went looking for a Convex component that handled this. Nothing existed. So I ended up building one during the hackathon, testing it against real sandbox purchases in the app as I went.

I'd been pretty deep in the Convex ecosystem for a while at that point, PRing bug fixes to their better-auth component ([#218](https://github.com/get-convex/better-auth/pull/218), [#245](https://github.com/get-convex/better-auth/pull/245), [#267](https://github.com/get-convex/better-auth/pull/267), [#278](https://github.com/get-convex/better-auth/pull/278)) and using components in basically every new project. Turns out they were running a [component authoring challenge](https://www.convex.dev/component-authoring?ref=ramonclaudio.com) at the same time as the hackathon. I submitted what I had, it got accepted, won a $100 gift card, and it's been on [convex.dev/components](https://www.convex.dev/components/ramonclaudio-convex-revenuecat) since.

I didn't win the hackathon. Honestly I spent way more time on the component than the actual submission, but it was my first hackathon so I'll take it as a learning experience.

### How it works

You mount a webhook handler, point RevenueCat at it, and the component just keeps subscription state in your Convex database. The core query is `hasEntitlement()`. Returns a boolean. Since it's a Convex query, it's reactive: user buys premium, webhook fires, UI unlocks. No polling.

The edge cases took way longer than the happy path. Cancellation got me. I assumed it revoked access. It doesn't. The user actually keeps access until their subscription expires. I shipped a broken version of the app before I figured that out, then went back and fixed it in the component so the default behavior is correct.

### Sync

I left sync out of the initial release on purpose. Webhooks only, one data path, keep it simple.

Then someone [opened an issue](https://github.com/ramonclaudio/convex-revenuecat/issues/12) saying webhooks weren't always firing in their setup. They'd been calling RevenueCat's REST API manually as a workaround. The thing is the component owns the tables, so if a webhook gets dropped there's really no way to fix the data from the outside. I added `syncSubscriber` in [v0.1.11](https://github.com/ramonclaudio/convex-revenuecat/releases/tag/v0.1.11): you just fetch from their API, pass the raw subscriber object, and the component upserts everything. If a webhook shows up later, it reconciles instead of duplicating.

[`convex-revenuecat`](https://www.npmjs.com/package/convex-revenuecat) is on npm and gets about 700 downloads a week. [Repo here](https://github.com/ramonclaudio/convex-revenuecat).

\- Ray
