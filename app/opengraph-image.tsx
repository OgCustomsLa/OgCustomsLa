import { ImageResponse } from "next/og";

// The preview card shown when a link to the site is shared (iMessage, Instagram, Facebook, X…).
export const alt = "OG Customs LA — custom jewelry designed in 3D, Los Angeles";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const gold = "linear-gradient(180deg, #F6E3A6 0%, #D9B158 45%, #A9822F 100%)";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#141414", color: "#F1F1EC" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: -8, backgroundImage: gold, backgroundClip: "text", color: "transparent" }}>OG</div>
          <div style={{ width: 4, height: 140, background: "#F1F1EC" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 72 }}>Customs</div>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700, border: "3px solid #F1F1EC", padding: "2px 12px", alignSelf: "flex-start" }}>LA</div>
          </div>
        </div>
        <div style={{ width: 120, height: 4, background: "#A8854F", margin: "56px 0 40px" }} />
        <div style={{ fontSize: 34, letterSpacing: 8, textTransform: "uppercase", color: "#C9A24E" }}>Custom jewelry · Designed in 3D</div>
        <div style={{ fontSize: 28, marginTop: 18, color: "#A9A596" }}>Made to order in Los Angeles · Ships worldwide</div>
      </div>
    ),
    size,
  );
}
