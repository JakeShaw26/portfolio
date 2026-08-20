import { ImageResponse } from "next/og";

import { ogPalette } from "@/lib/og/palette";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// GILDED AIR monogram for the home-screen icon. Same design as icon.tsx, but
// with extra internal padding and a solid fill since there's no browser
// chrome around it to frame the mark. fontSize kept below the padded inner
// width (180 - 2*24 = 132px) with margin to spare, since Satori doesn't
// shrink or wrap text that overflows its box.
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: ogPalette.cream,
        backgroundImage: `radial-gradient(160px 160px at 85% 5%, ${ogPalette.amber} 0%, transparent 60%), radial-gradient(130px 130px at 5% 95%, ${ogPalette.terracotta} 0%, transparent 60%)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          color: ogPalette.accent,
          fontFamily: "serif",
          fontSize: 84,
          fontWeight: 600,
        }}
      >
        JS
      </div>
    </div>,
    size,
  );
}
