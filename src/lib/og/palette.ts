// GILDED AIR palette for ImageResponse-rendered assets (OG card, favicon,
// apple-icon). Hardcoded rather than read from Tailwind's CSS tokens because
// Satori (ImageResponse's renderer) doesn't resolve CSS custom properties —
// this is the one place in the codebase these values have to be duplicated
// from the design system, so it's centralized here instead of copied again
// per file.
export const ogPalette = {
  cream: "#f7efe2",
  amber: "#f3c57b",
  terracotta: "#e68a5c",
  accent: "#c2502e",
  ink: "#2b2018",
  muted: "#8a7561",
};
