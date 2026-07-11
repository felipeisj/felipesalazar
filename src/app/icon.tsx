import { ImageResponse } from "next/og";

export const contentType = "image/png";

const SIZES = [
  { id: "16", px: 16, fontSize: 10 },
  { id: "32", px: 32, fontSize: 20 },
  { id: "48", px: 48, fontSize: 30 },
];

export function generateImageMetadata() {
  return SIZES.map(({ id, px }) => ({
    id,
    size: { width: px, height: px },
    contentType,
  }));
}

export default function Icon({ id }: { id: string }) {
  const { px, fontSize } = SIZES.find((s) => s.id === id) ?? SIZES[1];

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
          borderRadius: Math.round(px * 0.22),
          color: "#4640de",
          fontSize,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        F
      </div>
    ),
    { width: px, height: px }
  );
}
