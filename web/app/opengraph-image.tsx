import { ImageResponse } from "next/og";

export const alt = "The Steerway | Systems that steer growth";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share card, generated at build: seal geometry + the promise. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #121014 0%, #0a0a0c 100%)",
          color: "#ece7dd",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 9999,
              background: "#ece7dd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 54,
              fontStyle: "italic",
              color: "#0a0a0c",
            }}
          >
            S
          </div>
          <div style={{ width: 22, height: 22, background: "#c3a268" }} />
        </div>
        <div style={{ display: "flex", fontSize: 84, marginTop: 48, lineHeight: 1.05 }}>
          Systems that steer growth.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 28,
            color: "#c3a268",
            letterSpacing: 6,
            fontFamily: "monospace",
          }}
        >
          THE STEERWAY · WEBSITES · AI · SOFTWARE · GROWTH INFRASTRUCTURE
        </div>
      </div>
    ),
    size
  );
}
