import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";

const title = "Colophon";
const description =
  "How this site is actually built — reduced-motion handling, a keyboard-accessible carousel, SHA-pinned CI, an asset-metadata gate, Zod-validated CMS content, and a documented CSP trade-off.";

export const metadata: Metadata = {
  title,
  description,
};

/**
 * Single-column prose page, structured like /experience/[slug] rather than the
 * two-column case-study template — there's no image or stack list here, just
 * an argument. Uses Reveal directly (not Section, which is the homepage's
 * numbered-eyebrow wrapper) since this isn't a scroll-linked section.
 */
export default function ColophonPage() {
  return (
    <main id="main-content" className="px-6 py-28 sm:px-10 sm:py-40 lg:px-16">
      <Reveal>
        <Link
          href="/"
          className="text-eyebrow font-semibold text-accent uppercase"
        >
          ← Back home
        </Link>

        <span className="mt-10 block text-eyebrow text-muted uppercase">
          Colophon
        </span>
        <h1 className="mt-3 font-display text-h2 font-semibold">
          How this site is built
        </h1>
      </Reveal>

      <div className="mt-16 max-w-2xl space-y-8 text-lg leading-relaxed text-muted">
        <Reveal>
          <p>
            This page exists because I make claims elsewhere on this site about
            accessibility, CI, and security that are easy to state and easy to
            leave unproven. Here is some of the evidence, drawn from the code
            actually running behind this page.
          </p>
        </Reveal>

        <Reveal>
          <p>
            Motion here is opt-in, not assumed. Every GSAP timeline runs inside{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-base text-foreground">
              gsap.matchMedia(&quot;(prefers-reduced-motion:
              no-preference)&quot;)
            </code>
            , so if you have told your OS you do not want animation, none of it
            plays. That is a real branch in the code, not a CSS media query
            bolted on afterwards. The testimonial carousel further down this
            site follows the same principle: keyboard-reachable rather than
            mouse-only, with dot buttons sized to a proper touch target rather
            than relying on you being able to grab a scrollbar.
          </p>
        </Reveal>

        <Reveal>
          <p>
            Every GitHub Action this repo&rsquo;s CI runs is pinned to a commit
            SHA rather than a floating version tag, so a compromised or
            rewritten upstream release cannot silently swap in different code on
            the next push. Before anything else runs, a small dependency-free
            script scans every committed image for embedded EXIF and XMP
            metadata and fails the build if it finds any — the kind of thing a
            camera or design tool embeds without telling you, and happily ships
            to every visitor if nobody checks. I added that gate after finding
            and fixing exactly that leak on a real project.
          </p>
        </Reveal>

        <Reveal>
          <p>
            Content comes from Contentful, and one field — the rich case-study
            body — is a freeform Object type Contentful does not type-check the
            way it does everything else. So it is validated with Zod at the
            fetch boundary, and malformed content fails loudly at build time
            instead of quietly rendering as broken markup.
          </p>
        </Reveal>

        <Reveal>
          <p>
            The one compromise I will own rather than hide: the CSP allows{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-base text-foreground">
              script-src &apos;unsafe-inline&apos;
            </code>
            . Next.js inlines the React server payload as inline script tags
            that differ on every build, so a static hash allowlist cannot cover
            them, and the strict alternative — a per-request nonce — needs
            dynamic rendering, giving up static generation for a site with no
            other reason to need it. I made that trade deliberately: no user
            input is ever accepted or reflected anywhere on this site, so there
            is nowhere for an attacker to inject markup in the first place —
            which is what the rest of the policy is written to protect.
          </p>
        </Reveal>

        <Reveal>
          <p>
            None of this is dramatic, and that is rather the point. It is what I
            would want a production frontend to look like by default, not just
            on the projects where someone is watching. The fuller reasoning
            behind these decisions, and a few more, is written up in{" "}
            <a
              href="https://github.com/JakeShaw26/portfolio/blob/main/ARCHITECTURE.md"
              className="text-accent underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              ARCHITECTURE.md
            </a>{" "}
            in the repo.
          </p>
        </Reveal>
      </div>
    </main>
  );
}
