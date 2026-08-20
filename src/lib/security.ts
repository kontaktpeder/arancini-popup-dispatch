/** HTTP security helpers for the Cloudflare Worker / SSR entry. */

export const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy":
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    // React / TanStack hydration still needs inline + eval in this stack
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "media-src 'self' https://player.vimeo.com",
    "frame-src 'self' https://player.vimeo.com",
    [
      "connect-src 'self'",
      "https://*.supabase.co",
      "wss://*.supabase.co",
      "https://*.lovable.app",
      "https://*.lovable.dev",
      "https://ai.gateway.lovable.dev",
      "https://tally.so",
    ].join(" "),
    "upgrade-insecure-requests",
  ].join("; "),
};

const ALLOWED_METHODS = new Set(["GET", "HEAD", "POST", "OPTIONS"]);

const BLOCKED_EXACT = new Set([
  "/package.json",
  "/package-lock.json",
  "/bun.lock",
  "/bun.lockb",
  "/wrangler.jsonc",
  "/vite.config.ts",
  "/tsconfig.json",
]);

const BLOCKED_PREFIXES = ["/.env", "/.git", "/node_modules", "/src/", "/supabase/"];

export function isBlockedPath(pathname: string): boolean {
  const path = pathname.toLowerCase();
  if (BLOCKED_EXACT.has(path)) return true;
  return BLOCKED_PREFIXES.some((p) => path === p.replace(/\/$/, "") || path.startsWith(p));
}

export function isMethodAllowed(method: string): boolean {
  return ALLOWED_METHODS.has(method.toUpperCase());
}

export function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function methodNotAllowedResponse(): Response {
  return withSecurityHeaders(
    new Response("Method Not Allowed", {
      status: 405,
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS",
        "content-type": "text/plain; charset=utf-8",
      },
    }),
  );
}

export function notFoundPlainResponse(): Response {
  return withSecurityHeaders(
    new Response("Not Found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    }),
  );
}
