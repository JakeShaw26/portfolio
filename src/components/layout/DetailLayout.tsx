import type { ReactNode } from "react";

import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

/** Nav/Footer wrapper shared by every non-homepage top-level route. */
export function DetailLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
