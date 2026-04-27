export const SITE = {
  website: "https://ramonclaudio.com",
  author: "Ray",
  profile: "https://ramonclaudio.com",
  desc: "Product engineer shipping React Native apps on Expo with Convex and Better Auth. Upstream fixes to Expo, Convex, Bun, shadcn/ui.",
  title: "Ray",
  ogImage: "ramonclaudio-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 20,
  postPerPage: 20,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/ramonclaudio/ramonclaudio.com/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/New_York", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
