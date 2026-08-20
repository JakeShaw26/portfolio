import type { ReactNode } from "react";

import { DetailLayout } from "@/components/layout/DetailLayout";

export default function ExperienceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DetailLayout>{children}</DetailLayout>;
}
