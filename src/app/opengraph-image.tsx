import { ImageResponse } from "next/og";

import { site } from "@/lib/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// GILDED AIR, rendered for social cards. ImageResponse only supports flexbox and
// a CSS subset, so this is a deliberately simple layout (no grid). Default fonts
// keep it dependency-free; swap in Fraunces later by passing font ArrayBuffers.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#f7efe2",
          backgroundImage:
            "radial-gradient(900px 900px at 85% 5%, #f3c57b 0%, transparent 60%), radial-gradient(700px 700px at 5% 95%, #e68a5c 0%, transparent 60%)",
          color: "#2b2018",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#c2502e",
          }}
        >
          <span>{site.role}</span>
          <span style={{ width: 60, height: 2, background: "#c2502e" }} />
          <span>{site.location}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ fontSize: 128, lineHeight: 1, fontWeight: 600 }}>
            {site.name}
          </div>
          <div
            style={{
              fontSize: 40,
              lineHeight: 1.2,
              maxWidth: 900,
              color: "#8a7561",
              fontFamily: "sans-serif",
            }}
          >
            {site.tagline}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
