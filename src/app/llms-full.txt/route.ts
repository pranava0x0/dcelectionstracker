import { generateLLMsFullTxt } from "@/lib/llms-txt";

// Long-form companion to /llms.txt — full issue text, candidate positions,
// voting records as plain markdown. Static-export route handler.
export const dynamic = "force-static";

const ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://pranava0x0.github.io";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const BASE_URL = `${ORIGIN}${BASE_PATH}`;

export function GET(): Response {
  return new Response(generateLLMsFullTxt(BASE_URL), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
