import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "The Steerway | Systems that steer growth";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social share card, generated at build. Embeds the real primary logo lockup
 * (the seal + wordmark) as a base64 PNG so link previews on WhatsApp, X,
 * LinkedIn etc. carry the actual brand mark, not a stand-in.
 */
export default function OgImage() {
  const logo = readFileSync(
    join(
      process.cwd(),
      "public/brand/01_primary_logo/steerway_primary_header_lockup__USE_FOR_HEADER_ON_DARK.png"
    )
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  // native lockup is 1731 x 600
  const logoW = 640;
  const logoH = Math.round((logoW * 600) / 1731);

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
            background: "radial-gradient(circle, rgba(195,162,104,0.22), rgba(195,162,104,0))",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={logoW} height={logoH} alt="The Steerway" />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            textAlign: "center",
            fontSize: 26,
            letterSpacing: 6,
            color: "#c3a268",
            fontFamily: "monospace",
          }}
        >
          WEBSITES · AI · SOFTWARE · CRM · GROWTH
        </div>
      </div>
    ),
    size
  );
}
