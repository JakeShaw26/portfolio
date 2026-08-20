import type { ReactNode } from "react";

import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export default function WorkLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
