import type { ReactNode } from "react";

import { DetailLayout } from "@/components/layout/DetailLayout";

export default function WorkLayout({ children }: { children: ReactNode }) {
  return <DetailLayout>{children}</DetailLayout>;
}
