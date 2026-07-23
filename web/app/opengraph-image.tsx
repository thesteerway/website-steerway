import { ImageResponse } from "next/og";
import { MARK } from "@/lib/steerway";

export const alt = "The Steerway | Systems that steer growth";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social share card, generated at build. The two brand PNGs in
 * public/brand/01_primary_logo are flattened exports with NO S-carve baked
 * in (verified: they are just a flat ivory disc), so embedding them here
 * produced a broken-looking "blank circle" seal. The carve only exists as
 * SVG <mask> geometry (same technique as SealMark.tsx / app/icon.svg). So
 * the seal here is built from that mask geometry directly and embedded as
 * an SVG data URI -- guaranteed to render with the actual S carved out.
 */
function sealDataUri() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 120 120">
    <mask id="ogcut" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
      <rect width="120" height="120" fill="#fff"/>
      <path d="${MARK.sPath}" fill="none" stroke="#000" stroke-width="13" stroke-linecap="round"/>
    </mask>
    <circle cx="${MARK.circle.cx}" cy="${MARK.circle.cy}" r="${MARK.circle.r}" fill="#ece7dd" mask="url(#ogcut)"/>
    <rect x="${MARK.square.x}" y="${MARK.square.y}" width="${MARK.square.size}" height="${MARK.square.size}" fill="#c3a268"/>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/**
 * Satori has no built-in fonts: any text node whose requested family isn't
 * registered silently falls back to whichever font WAS registered, no
 * matter its style. Loading only the italic face made the mono label and
 * tagline render in that same italic too. So every face actually used in
 * this image must be fetched and registered explicitly.
 */
async function loadFont(family: string, query: string) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:${query}`
  ).then((r) => r.text());
  const url = css.match(/src: url\(([^)]+)\)/)?.[1];
  if (!url) return null;
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function OgImage() {
  const [frauncesLight, frauncesLabel, mono] = await Promise.all([
    loadFont("Fraunces", "wght@340"),
    loadFont("Fraunces", "wght@500"),
    loadFont("IBM+Plex+Mono", "wght@500"),
  ]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 54,
          background: "linear-gradient(135deg, #14110d 0%, #0a0a0c 60%)",
        }}
      >
        {/* faint champagne bloom behind the mark */}
        <div
          style={{
            position: "absolute",
            top: 90,
            width: 620,
            height: 320,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(195,162,104,0.22), rgba(195,162,104,0))",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sealDataUri()} width={126} height={126} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 19,
                letterSpacing: 8,
                color: "#ece7dd",
                fontFamily: "FrauncesLabel, Georgia, serif",
              }}
            >
              THE
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 92,
                lineHeight: 0.95,
                color: "#ece7dd",
                fontFamily: "FrauncesLight, Georgia, serif",
                marginTop: 2,
              }}
            >
              Steerway
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            textAlign: "center",
            fontSize: 26,
            letterSpacing: 6,
            color: "#c3a268",
            fontFamily: "PlexMono, monospace",
          }}
        >
          WEBSITES · AI · SOFTWARE · CRM · GROWTH
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        frauncesLight && {
          name: "FrauncesLight",
          data: frauncesLight,
          style: "normal" as const,
          weight: 400 as const,
        },
        frauncesLabel && {
          name: "FrauncesLabel",
          data: frauncesLabel,
          style: "normal" as const,
          weight: 500 as const,
        },
        mono && {
          name: "PlexMono",
          data: mono,
          style: "normal" as const,
          weight: 500 as const,
        },
      ].filter((f): f is NonNullable<typeof f> => Boolean(f)),
    }
  );
}
