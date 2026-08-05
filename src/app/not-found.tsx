import { Reveal } from "@/components/motion/Reveal";
import { CtaLink } from "@/components/ui/CtaLink";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <Reveal>
        <p className="text-eyebrow font-semibold text-accent uppercase">
          Error 404
        </p>
        <h1 className="mt-6 font-display text-display font-semibold">
          Lost the<span className="text-accent italic"> thread</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-muted">
          This page drifted off somewhere. Let’s get you back to solid ground.
        </p>
        <div className="mt-10 flex justify-center">
          <CtaLink href="/">Back home</CtaLink>
        </div>
      </Reveal>
    </main>
  );
}
