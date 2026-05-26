import { generateLLMsTxt } from "@/lib/llms-txt";

// Static-export route handler — generated at build time, served as plain text.
// Convention: https://llmstxt.org/
export const dynamic = "force-static";

const ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://pranava0x0.github.io";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const BASE_URL = `${ORIGIN}${BASE_PATH}`;

export function GET(): Response {
  return new Response(generateLLMsTxt(BASE_URL), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
