import type { APIRoute } from "astro";
import { generateOgImageForSite } from "@/utils/generateOgImages";

export const GET = (async () =>
  new Response(
    (await generateOgImageForSite()) as unknown as BodyInit,
  )) satisfies APIRoute;
