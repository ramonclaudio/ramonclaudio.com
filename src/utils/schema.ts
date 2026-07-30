import { SITE } from "@/config";
import { stats } from "@/data/contributions";

const ORIGIN = SITE.website;

export const PERSON_ID = `${ORIGIN}/#person`;
export const WEBSITE_ID = `${ORIGIN}/#website`;

export type SchemaNode = Record<string, unknown>;

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export const personEntity: SchemaNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Ramon Claudio",
  alternateName: "Ray",
  url: ORIGIN,
  image: `${ORIGIN}/ramonclaudio-og.jpg`,
  jobTitle: "Developer Tools Engineer",
  description: `Developer tools engineer. Writing code since 2013. Builds CLIs, scaffolders, and Claude Code tooling, and ships React Native apps on Expo with Convex for backend and Better Auth for auth. ${stats.merged} merged PRs upstream to Expo, React Native, Hermes, Bun, Convex, Better Auth, shadcn/ui, Astro, napi-rs, TanStack, fumadocs, and App Store Connect CLI.`,
  knowsAbout: [
    "Developer Tools",
    "TypeScript",
    "Swift",
    "Rust",
    "Zig",
    "Go",
    "Python",
    "React",
    "React Native",
    "Expo",
    "Convex",
    "Better Auth",
    "Bun",
    "Tauri",
    "Claude Code",
    "AI SDK",
    "Open Source Software",
  ],
  sameAs: [
    "https://github.com/ramonclaudio",
    "https://x.com/ramonclaudio",
    "https://www.linkedin.com/in/ramonclaudio/",
    "https://www.npmjs.com/~ramonclaudio",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "New York",
    addressRegion: "NY",
    addressCountry: "US",
  },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Long Island University" },
};

export const websiteEntity: SchemaNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: ORIGIN,
  name: SITE.title,
  description: SITE.desc,
  inLanguage: "en-US",
  publisher: { "@id": PERSON_ID },
  author: { "@id": PERSON_ID },
};

// Build Home > segment > segment breadcrumbs from a pathname.
export function breadcrumbsFromPath(
  pathname: string,
): BreadcrumbItem[] | undefined {
  const clean = pathname.replace(/\/+$/, "");
  const segments = clean.split("/").filter(Boolean);
  if (!segments.length) return undefined;
  const items: BreadcrumbItem[] = [{ name: "Home", url: `${ORIGIN}/` }];
  segments.forEach((seg, i) => {
    const isLast = i === segments.length - 1;
    const label = decodeURIComponent(seg).replace(/-/g, " ");
    items.push({
      name: label.charAt(0).toUpperCase() + label.slice(1),
      url: isLast
        ? undefined
        : `${ORIGIN}/${segments.slice(0, i + 1).join("/")}/`,
    });
  });
  return items;
}

export function buildGraph(opts: {
  canonical: string;
  title: string;
  description: string;
  image: string;
  breadcrumbs?: BreadcrumbItem[];
  profilePage?: boolean;
  extraNodes?: SchemaNode[];
}): SchemaNode {
  const {
    canonical,
    title,
    description,
    image,
    breadcrumbs,
    profilePage,
    extraNodes,
  } = opts;
  const hasCrumbs = !!breadcrumbs?.length;

  const webPage: SchemaNode = {
    "@type": profilePage ? ["WebPage", "ProfilePage"] : "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en-US",
    primaryImageOfPage: { "@type": "ImageObject", url: image },
    ...(profilePage ? { mainEntity: { "@id": PERSON_ID } } : {}),
    ...(hasCrumbs ? { breadcrumb: { "@id": `${canonical}#breadcrumb` } } : {}),
  };

  const nodes: SchemaNode[] = [websiteEntity, personEntity, webPage];

  if (hasCrumbs) {
    nodes.push({
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: breadcrumbs!.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        ...(b.url ? { item: b.url } : {}),
      })),
    });
  }

  if (extraNodes) nodes.push(...extraNodes);

  return { "@context": "https://schema.org", "@graph": nodes };
}
