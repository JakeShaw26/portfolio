import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Why `script-src` carries `'unsafe-inline'` — this is a deliberate trade, not
 * an oversight.
 *
 * Next.js inlines the RSC flight payload as several `<script>` blocks in every
 * prerendered page (`self.__next_f.push(...)`). Their contents differ per page
 * and change on every build, so a static hash allowlist cannot cover them. The
 * only strict alternative is a per-request nonce, and nonces require dynamic
 * rendering — which would disable static generation, ISR and CDN caching for a
 * site that is 100% static. That is a large, permanent cost.
 *
 * It buys close to nothing here, because the vector a strict `script-src`
 * defends against does not exist on this site: no user input is accepted, no
 * request data is reflected, there are no route handlers or server actions, and
 * CMS copy renders as React text (there is no `dangerouslySetInnerHTML`
 * anywhere in `src/`). Markup injection has no entry point to begin with.
 *
 * So the policy concentrates its value in the directives that constrain what
 * injected markup could actually *do*: it cannot pull a script from another
 * origin, redirect relative script URLs via an injected `<base>`, exfiltrate
 * over fetch/WebSocket, or frame the site. Those are the directives worth
 * reading below; `script-src` is the honest weak spot.
 */
const cspDirectives = [
  "default-src 'self'",
  // 'unsafe-eval' is dev-only: React uses eval to rebuild server error stacks
  // in the browser. Production needs neither.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // GSAP and Lenis animate through the CSSOM (`element.style`), which CSP does
  // not govern, and neither library injects a `<style>` element — verified
  // against both bundles. The built HTML contains zero `<style>` elements; the
  // inline styles that do exist are `style="..."` attributes from next/image
  // blur placeholders and layout offsets. Attribute styles cannot execute
  // script, and tightening this further is theatre while script-src is open.
  "style-src 'self' 'unsafe-inline'",
  // `data:` covers next/image blur placeholders. No remote images: next.config
  // declares no `images.remotePatterns`.
  "img-src 'self' data: blob:",
  // next/font/google self-hosts at build time, so no Google Fonts origin.
  "font-src 'self'",
  // Nothing fetches from the client. Contentful is only ever called
  // server-side, at build time.
  "connect-src 'self'",
  "object-src 'none'",
  // 'none' rather than 'self': nothing here sets a `<base>`, and an injected
  // base tag is the standard way to turn `script-src 'self'` into a loophole by
  // repointing every relative script URL at an attacker's origin.
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Dev is served over http://localhost, where an upgrade to https would break
  // the page rather than protect it.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Sends the full URL same-origin, bare origin cross-origin, and nothing at
  // all on an HTTPS→HTTP downgrade.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing on this site uses these APIs, so denying them outright means an
  // injected script cannot either. `browsing-topics` opts out of Google's
  // Topics API, which is an advertising signal this site has no use for.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Superseded by `frame-ancestors`, kept for browsers that predate CSP Level 2.
  { key: "X-Frame-Options", value: "DENY" },
  // Vercel already sends exactly this at the edge, so on Vercel it is a no-op.
  // It is declared here so the guarantee travels with the app rather than the
  // host if this is ever deployed somewhere else.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Suppresses `X-Powered-By: Next.js`. Version disclosure is not a
  // vulnerability on its own; it just hands a scanner the framework for free.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
