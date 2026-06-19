import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

type SectionProps = {
  id?: string;
  index: string;
  label: string;
  children: ReactNode;
};

/** Editorial section shell: small-caps eyebrow + generous rhythm, GILDED AIR style. */
export function Section({ id, index, label, children }: SectionProps) {
  return (
    <section
      id={id}
      className="relative scroll-mt-24 px-6 py-24 sm:px-10 sm:py-36 lg:px-16"
    >
      <Reveal className="mb-12 flex items-center gap-3 text-base leading-none font-semibold tracking-[0.12em] text-accent uppercase">
        <span className="tabular-nums">{index}</span>
        <span className="h-px w-10 bg-accent/40" />
        <span>{label}</span>
      </Reveal>
      <Reveal delay={0.08}>{children}</Reveal>
    </section>
  );
}
