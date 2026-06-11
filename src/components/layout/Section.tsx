import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  index: string;
  label: string;
  children: ReactNode;
};

/** Shared section shell: hairline top rule + numbered mono label, SIGNAL style. */
export function Section({ id, index, label, children }: SectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-16 border-t border-hairline px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mb-12 flex items-center gap-3 font-mono text-label text-muted uppercase">
        <span className="text-accent">{index}</span>
        <span>/ {label}</span>
      </div>
      {children}
    </section>
  );
}
