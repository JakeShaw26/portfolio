import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/content/site";

/**
 * Editorial three-band layout: headline + facts share the top row, a wide lead
 * paragraph carries the voice, then the remaining prose runs in two columns.
 *
 * Grid placement is explicit (row-start/col-start) rather than auto-flowed. The
 * `dl` sits on row 1 but is last in the DOM so that mobile — where the grid
 * collapses to a single column — still reads headline → prose → facts.
 */
export function About() {
  return (
    <Section id="about" index="01" label="About">
      <div className="grid gap-x-12 gap-y-10 md:grid-cols-12">
        <h2 className="font-display text-h2 font-semibold md:col-span-7 md:row-start-1">
          I build interfaces that are simple to use — and simple to{" "}
          <span className="text-accent italic">test</span>.
        </h2>

        <Reveal className="md:col-span-8 md:row-start-2">
          <p className="text-xl leading-relaxed text-foreground/80">
            I started on an internship at CloudM, adding an accordion menu to a
            knowledge base. Small feature — but I got completely absorbed in how
            the logic fitted together and how it ought to behave, and that
            settled it. I&rsquo;ve always liked problems and puzzles. This
            turned out to be the version of that I wanted to do every day.
          </p>
        </Reveal>

        <Reveal className="md:col-span-6 md:col-start-1 md:row-start-3">
          <div className="space-y-6 text-base leading-relaxed text-muted">
            <p>
              A good stretch of my career since has been as a Software Engineer
              in Test — front-end at Travelchapter, back-end at JLR — and it
              left me with a conviction I haven&rsquo;t shaken: the best user
              journey is usually the simplest one. Nobody wants to click through
              five things to get somewhere. It turns out the qualities that make
              a journey pleasant to use are the same ones that make it possible
              to test — honest semantic elements, predictable states, hooks
              where you need them. Building for testability and building for
              people pull in the same direction far more often than people
              assume.
            </p>

            <p>
              So I care a great deal about accessibility, and about genuinely
              meeting the W3C and a11y standards rather than gesturing at them.
              Get that right while still building something that grips people,
              and you&rsquo;ll have very happy users.
            </p>
          </div>
        </Reveal>

        <Reveal
          delay={0.12}
          className="md:col-span-6 md:col-start-7 md:row-start-3"
        >
          <div className="space-y-6 text-base leading-relaxed text-muted">
            <p>
              I&rsquo;m not trying to be a jack of all trades. I&rsquo;d rather
              master a core stack — React, Next.js, Node and Express — and
              extend outwards deliberately. Back-end was the part that
              frustrated me most, so I went at it directly; being able to
              contribute across a product instead of one layer of it changes the
              kind of work you can take on. Cloud, with AWS and GCP, is where
              that&rsquo;s heading next. A lot of that deliberateness comes from
              reading — <span className="italic">The Pragmatic Programmer</span>{" "}
              has probably shaped how I think about building software more than
              any single project has.
            </p>

            <p>
              Most recently that&rsquo;s meant AI. I built Ask Andi, a chatbot
              live on AND Digital&rsquo;s site that matches prospective clients
              to the right expert — which meant prompt hardening, abuse
              guardrails, and a great deal of work coaxing an LLM into responses
              that reliably conform to a JSON schema. That last part was harder
              than I expected and improved the product enormously. I&rsquo;ve
              been reading around it since —{" "}
              <span className="italic">
                Architecting Agentic Solutions with Claude
              </span>{" "}
              most recently. AI-enhanced products are where a lot of the
              genuinely interesting work sits right now, and it&rsquo;s the work
              I want more of.
            </p>
          </div>
        </Reveal>

        {/* Wraps on mobile, where three side-by-side facts would be too cramped. */}
        <dl className="flex flex-wrap gap-x-10 gap-y-6 text-base text-muted md:col-span-4 md:col-start-9 md:row-start-1 md:flex-col md:gap-6 md:self-end">
          <div>
            <dt className="text-eyebrow text-foreground/50 uppercase">Based</dt>
            <dd className="mt-1 text-foreground">{site.location}</dd>
          </div>
          <div>
            <dt className="text-eyebrow text-foreground/50 uppercase">
              Status
            </dt>
            <dd className="mt-1 text-accent">
              {site.available ? "Open to work" : "Currently engaged"}
            </dd>
          </div>
          <div>
            <dt className="text-eyebrow text-foreground/50 uppercase">Focus</dt>
            <dd className="mt-1 text-foreground">
              Frontend · AI products · Accessibility · Full-stack JavaScript
            </dd>
          </div>
        </dl>
      </div>
    </Section>
  );
}
