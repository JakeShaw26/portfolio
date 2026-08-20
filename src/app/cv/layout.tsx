import type { ReactNode } from "react";

import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

// Nav/Footer are wrapped in print:hidden here (not on the shared components
// themselves) so this page's print rules don't reach into how every other
// page prints — same scoping rule as the .cv-page styles in globals.css.
export default function CvLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="print:hidden">
        <Nav />
      </div>
      {children}
      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
