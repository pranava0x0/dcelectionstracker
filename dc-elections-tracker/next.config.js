/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const isDev = process.env.NODE_ENV === "development";

// `output: "export"` is the production invariant for this site (static export
// to GitHub Pages). It is omitted in dev to work around a Next.js 14.2 bug
// where the dev server falsely rejects `generateStaticParams` on dynamic
// routes when this option is set. See issues.md → UAT-001.
const nextConfig = {
  ...(isDev ? {} : { output: "export" }),
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  reactStrictMode: true,
};

module.exports = nextConfig;
