import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// GILDED AIR monogram for the home-screen icon. Same design as icon.tsx, but
// with extra internal padding and a solid fill since there's no browser
// chrome around it to frame the mark.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "28px",
          background: "#f7efe2",
          backgroundImage:
            "radial-gradient(160px 160px at 85% 5%, #f3c57b 0%, transparent 60%), radial-gradient(130px 130px at 5% 95%, #e68a5c 0%, transparent 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            color: "#c2502e",
            fontFamily: "serif",
            fontSize: 96,
            fontWeight: 600,
          }}
        >
          JS
        </div>
      </div>
    ),
    size,
  );
}
