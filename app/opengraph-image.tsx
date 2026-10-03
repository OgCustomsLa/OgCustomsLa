import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

// The preview card shown when a link to the site is shared (iMessage, Instagram, Facebook, X…).
export const alt = "OG Customs LA — custom jewelry designed in 3D, Los Angeles";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(path.join(process.cwd(), "public/images/logo-la.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 64, background: "#141414", color: "#F1F1EC" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={360} height={360} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: 10 }}>OG CUSTOMS</div>
          <div style={{ fontSize: 26, letterSpacing: 9, color: "#C9A24E", marginTop: 14 }}>3D JEWELRY STUDIO · LOS ANGELES</div>
          <div style={{ width: 120, height: 4, background: "#A8854F", margin: "40px 0 28px" }} />
          <div style={{ fontSize: 32, color: "#A9A596" }}>Custom jewelry, designed in 3D.</div>
          <div style={{ fontSize: 32, color: "#A9A596", marginTop: 6 }}>Made to order · Ships worldwide</div>
        </div>
      </div>
    ),
    size,
  );
}
