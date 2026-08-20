import { ImageResponse } from "next/og";

import { ogPalette } from "@/lib/og/palette";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// GILDED AIR monogram, browser-tab scale. Same palette/pattern as
// opengraph-image.tsx; default fonts keep it dependency-free.
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: ogPalette.cream,
        backgroundImage: `radial-gradient(30px 30px at 85% 5%, ${ogPalette.amber} 0%, transparent 60%), radial-gradient(24px 24px at 5% 95%, ${ogPalette.terracotta} 0%, transparent 60%)`,
        color: ogPalette.accent,
        fontFamily: "serif",
        fontSize: 18,
        fontWeight: 600,
      }}
    >
      JS
    </div>,
    size,
  );
}
