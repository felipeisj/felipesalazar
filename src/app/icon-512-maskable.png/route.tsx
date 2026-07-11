import { ImageResponse } from "next/og";

// Maskable icons get cropped into a circle/rounded-square by the OS, so the
// background must be edge-to-edge and the glyph kept inside the ~80% safe zone.
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#16161d",
          color: "#4640de",
          fontSize: 220,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        F
      </div>
    ),
    { width: 512, height: 512 }
  );
}
