import type { ReactNode } from "react";

import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export default function ColophonLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
