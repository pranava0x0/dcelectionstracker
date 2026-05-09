const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function path(href: string): string {
  if (!href.startsWith("/")) return href;
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (basePath === "") return href;
  return `${basePath}${href}`;
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
