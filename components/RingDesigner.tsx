"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DESIGN_KEY, type DesignPrefill } from "@/lib/site";

/*
 * Ring designer: signet rings (engraved initials) and engagement rings (centre diamond),
 * with a live SVG preview. Diamonds are drawn as faceted brilliant cuts.
 * While `demoIndex` is set it shows that showcase ring; the first touch calls onTouch.
 */

type Metal = "gold" | "white" | "rose";
type Style = "signet" | "engagement";
type Face = "oval" | "square" | "round";
type Stones = "none" | "halo" | "iced";
type Font = "roman" | "old" | "script" | "bold" | "retro" | "signature" | "modern";
type Cut = "round" | "oval" | "princess" | "pear";
type Setting = "solitaire" | "halo" | "pave";
export type RingOpts = { style: Style; initials: string; metal: Metal; face: Face; stones: Stones; font: Font; cut: Cut; setting: Setting };

const METALS: Record<Metal, { label: string; order: string; light: string; mid: string; dark: string; edge: string; engrave: string; swatch: string }> = {
  gold: { label: "Yellow gold", order: "Yellow gold", light: "#FBEAB4", mid: "#D9B158", dark: "#9C7A2C", edge: "#6E5220", engrave: "#7A5C22", swatch: "linear-gradient(#F6E3A6,#A9822F)" },
  white: { label: "White gold", order: "White gold", light: "#FFFFFF", mid: "#CDD0D2", dark: "#8E9294", edge: "#5E6265", engrave: "#5E6265", swatch: "linear-gradient(#fff,#8E9294)" },
  rose: { label: "Rose gold", order: "Rose gold", light: "#FBE2D6", mid: "#DDA38A", dark: "#A86C55", edge: "#7A4636", engrave: "#7A4636", swatch: "linear-gradient(#F9D9C9,#A86C55)" },
};
const FONTS: Record<Font, { label: string; family: string; weight: number; upper: boolean }> = {
  roman: { label: "Roman", family: "Cinzel, serif", weight: 700, upper: true },
  old: { label: "Old English", family: "'Pirata One', serif", weight: 400, upper: false },
  script: { label: "Script", family: "Yellowtail, cursive", weight: 400, upper: false },
  bold: { label: "Bold", family: "Bungee, sans-serif", weight: 400, upper: true },
  retro: { label: "Retro", family: "Lobster, cursive", weight: 400, upper: false },
  signature: { label: "Signature", family: "Satisfy, cursive", weight: 400, upper: false },
  modern: { label: "Modern", family: "Outfit, sans-serif", weight: 800, upper: true },
};
const FACES: Record<Face, string> = { oval: "Oval", square: "Square", round: "Round" };
const STONES: Record<Stones, string> = { none: "No stones", halo: "Diamond halo", iced: "Iced band" };
const CUTS: Record<Cut, string> = { round: "Round", oval: "Oval", princess: "Princess", pear: "Pear" };
const SETTINGS: Record<Setting, string> = { solitaire: "Solitaire", halo: "Halo", pave: "Pavé band" };
const BASE: RingOpts = { style: "signet", initials: "", metal: "gold", face: "oval", stones: "none", font: "roman", cut: "round", setting: "solitaire" };

export const RING_DEMOS: RingOpts[] = [
  { ...BASE, initials: "OG", metal: "gold", face: "oval", stones: "halo", font: "roman" },
  { ...BASE, style: "engagement", metal: "white", cut: "round", setting: "halo" },
  { ...BASE, initials: "LA", metal: "white", face: "square", stones: "iced", font: "old" },
  { ...BASE, style: "engagement", metal: "rose", cut: "oval", setting: "pave" },
  { ...BASE, initials: "JR", metal: "rose", face: "round", stones: "iced", font: "signature" },
  { ...BASE, style: "engagement", metal: "gold", cut: "pear", setting: "solitaire" },
  { ...BASE, initials: "MV", metal: "gold", face: "square", stones: "none", font: "modern" },
  { ...BASE, style: "engagement", metal: "white", cut: "princess", setting: "pave" },
];

/* ---------- faceted diamonds ---------- */

type Pt = [number, number];
const f2 = (p: Pt) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
const tri = (a: Pt, b: Pt, c: Pt) => `M${f2(a)}L${f2(b)}L${f2(c)}Z`;

/**
 * A diamond seen from above: outline → table → star and girdle facets, light/dark/fire fills
 * and a sparkle. `outline(t)` gives the girdle point for t in [0, 1).
 */
function Gem({ cx, cy, outline, n = 8, sparkle = true, edge = 1 }: { cx: number; cy: number; outline: (t: number) => Pt; n?: number; sparkle?: boolean; edge?: number }) {
  const O = Array.from({ length: n }, (_, k) => outline(k / n));
  const T = Array.from({ length: n }, (_, k) => {
    const p = outline((k + 0.5) / n);
    return [cx + (p[0] - cx) * 0.5, cy + (p[1] - cy) * 0.5] as Pt;
  });
  const size = Math.max(...O.map(p => Math.hypot(p[0] - cx, p[1] - cy)));
  const facets: { d: string; fill: string }[] = [];
  for (let k = 0; k < n; k++) {
    const k1 = (k + 1) % n;
    facets.push({ d: tri(T[k], T[k1], O[k1]), fill: k % 2 ? "url(#rd-dark)" : "url(#rd-light)" });
    facets.push({ d: tri(T[k], O[k1], O[k]), fill: k % 3 === 0 ? "url(#rd-fire)" : k % 2 ? "#E6EEF3" : "#B9CAD5" });
  }
  return (
    <g>
      <path d={`M${O.map(f2).join("L")}Z`} fill="#DCE6EC" stroke="#5E7584" strokeWidth={0.7 * edge} strokeLinejoin="round" />
      {facets.map((f, i) => <path key={i} d={f.d} fill={f.fill} stroke="#8EA2AF" strokeWidth={0.25 * edge} strokeLinejoin="round" />)}
      <path d={`M${T.map(f2).join("L")}Z`} fill="url(#rd-table)" stroke="#9DB0BC" strokeWidth={0.3 * edge} />
      {sparkle && (() => {
        // small star glint; numbers rounded so server and browser render identical markup
        const s = Math.min(size * 0.42, 3 + size * 0.14), x = cx - size * 0.28, y = cy - size * 0.3;
        const P: Pt[] = [[x, y - s], [x + s * 0.18, y - s * 0.18], [x + s, y], [x + s * 0.18, y + s * 0.18], [x, y + s], [x - s * 0.18, y + s * 0.18], [x - s, y], [x - s * 0.18, y - s * 0.18]];
        return <path d={`M${P.map(f2).join("L")}Z`} fill="#fff" opacity=".95" />;
      })()}
    </g>
  );
}

const circle = (cx: number, cy: number, r: number) => (t: number): Pt => [cx + Math.cos(t * 2 * Math.PI - Math.PI / 2) * r, cy + Math.sin(t * 2 * Math.PI - Math.PI / 2) * r];
const Melee = ({ x, y, r }: { x: number; y: number; r: number }) => <Gem cx={x} cy={y} outline={circle(x, y, r)} n={8} edge={r / 7} sparkle={r > 4.5} />;

function centreOutline(cut: Cut, cx: number, cy: number): (t: number) => Pt {
  if (cut === "round") return circle(cx, cy, 44);
  if (cut === "oval") return t => [cx + Math.cos(t * 2 * Math.PI - Math.PI / 2) * 34, cy + Math.sin(t * 2 * Math.PI - Math.PI / 2) * 48];
  if (cut === "princess") {
    const h = 38;
    return t => {
      const d = ((t + 0.125) % 1) * 4, side = Math.floor(d), u = d - side;
      const c: Pt[] = [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
      const a = c[side], b = c[(side + 1) % 4];
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    };
  }
  // pear: round bottom, tapering to a point at the top
  return t => {
    const a = t * 2 * Math.PI - Math.PI / 2, s = Math.sin(a), c = Math.cos(a);
    const up = s < 0;
    return [cx + c * 36 * (up ? 1 + s * 0.55 : 1), cy + 8 + s * (up ? 62 : 36)];
  };
}

/* ---------- ring drawings ---------- */

const CX = 300;

function MetalDefs({ m }: { m: (typeof METALS)[Metal] }) {
  return (
    <defs>
      <linearGradient id="rd-metal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={m.light} /><stop offset=".4" stopColor={m.mid} /><stop offset=".72" stopColor={m.dark} /><stop offset="1" stopColor={m.mid} />
      </linearGradient>
      <linearGradient id="rd-band" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={m.dark} /><stop offset=".25" stopColor={m.light} /><stop offset=".5" stopColor={m.mid} /><stop offset=".78" stopColor={m.light} /><stop offset="1" stopColor={m.dark} />
      </linearGradient>
      <radialGradient id="rd-face" cx=".38" cy=".3" r=".9">
        <stop offset="0" stopColor={m.light} /><stop offset=".55" stopColor={m.mid} /><stop offset="1" stopColor={m.dark} />
      </radialGradient>
      <linearGradient id="rd-light" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#DDE8EF" /></linearGradient>
      <linearGradient id="rd-dark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9FB3C0" /><stop offset="1" stopColor="#6F8796" /></linearGradient>
      <linearGradient id="rd-fire" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E9F6FF" /><stop offset=".45" stopColor="#F6DDF0" /><stop offset="1" stopColor="#FFF0C9" /></linearGradient>
      <linearGradient id="rd-table" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".5" stopColor="#E3EDF3" /><stop offset="1" stopColor="#F7FBFD" /></linearGradient>
      <filter id="rd-shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#000" floodOpacity=".22" /></filter>
      <filter id="rd-engrave" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="-1.2" stdDeviation=".4" floodColor="#fff" floodOpacity=".55" /></filter>
    </defs>
  );
}

function Band({ cy, rOut, rIn, m }: { cy: number; rOut: number; rIn: number; m: (typeof METALS)[Metal] }) {
  return (
    <>
      <path fillRule="evenodd" fill="url(#rd-band)" stroke={m.edge} strokeWidth="1.5"
        d={`M${CX - rOut} ${cy}a${rOut} ${rOut} 0 1 0 ${rOut * 2} 0a${rOut} ${rOut} 0 1 0 ${-rOut * 2} 0zM${CX - rIn} ${cy}a${rIn} ${rIn} 0 1 1 ${rIn * 2} 0a${rIn} ${rIn} 0 1 1 ${-rIn * 2} 0z`} />
      <path d={`M${CX - rOut * 0.6} ${cy + rOut * 0.8}q${rOut * 0.6} ${rOut * 0.27} ${rOut * 1.2} 0`} fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="4" strokeLinecap="round" />
    </>
  );
}

// diamonds set along the visible band, skipping the part hidden behind the head
function bandStones(cy: number, rMid: number, r: number, gapDeg: number) {
  const out: Pt[] = [];
  const step = (r * 2.15 / rMid) * (180 / Math.PI);
  for (let d = -180 + step / 2; d <= 180; d += step) {
    if (Math.abs(d + 90) < gapDeg) continue;
    const a = (d * Math.PI) / 180;
    out.push([CX + Math.cos(a) * rMid, cy + Math.sin(a) * rMid]);
  }
  return out;
}

const SIG = { BAND_Y: 205, R_OUT: 112, R_IN: 86, FACE_Y: 102 };
const FACE_SIZE: Record<Face, { w: number; h: number }> = { oval: { w: 170, h: 112 }, square: { w: 158, h: 112 }, round: { w: 132, h: 132 } };

function faceShape(face: Face, w: number, h: number, dy = 0) {
  if (face === "oval") return <ellipse cx={CX} cy={SIG.FACE_Y + dy} rx={w / 2} ry={h / 2} />;
  if (face === "round") return <circle cx={CX} cy={SIG.FACE_Y + dy} r={w / 2} />;
  return <rect x={CX - w / 2} y={SIG.FACE_Y - h / 2 + dy} width={w} height={h} rx={16} />;
}
function haloPoints(face: Face, w: number, h: number, n: number): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const t = i / n;
    if (face === "square") {
      const P = 2 * (w + h), d = t * P, x0 = CX - w / 2, y0 = SIG.FACE_Y - h / 2;
      if (d < w) return [x0 + d, y0];
      if (d < w + h) return [x0 + w, y0 + (d - w)];
      if (d < 2 * w + h) return [x0 + w - (d - w - h), y0 + h];
      return [x0, y0 + h - (d - 2 * w - h)];
    }
    const a = t * Math.PI * 2;
    return [CX + Math.cos(a) * (w / 2), SIG.FACE_Y + Math.sin(a) * (h / 2)];
  });
}

function Signet({ o }: { o: RingOpts }) {
  const m = METALS[o.metal], f = FONTS[o.font], { w, h } = FACE_SIZE[o.face];
  const text = (f.upper ? o.initials.toUpperCase() : o.initials) || "OG";
  const fontSize = Math.min(h * 0.62, (w * 1.25) / Math.max(text.length, 1.6));
  const halo = o.stones === "halo" ? haloPoints(o.face, w + 17, h + 17, o.face === "square" ? 44 : 40) : [];
  const iced = o.stones === "iced" ? bandStones(SIG.BAND_Y, (SIG.R_OUT + SIG.R_IN) / 2, 9.5, 40) : [];
  return (
    <g filter="url(#rd-shadow)">
      <Band cy={SIG.BAND_Y} rOut={SIG.R_OUT} rIn={SIG.R_IN} m={m} />
      {iced.map(([x, y], i) => <Melee key={i} x={x} y={y} r={9.5} />)}
      <g fill={m.dark} stroke={m.edge} strokeWidth="1.5">{faceShape(o.face, w + 26, h + 26, 12)}</g>
      <g fill="url(#rd-metal)" stroke={m.edge} strokeWidth="1.5">{faceShape(o.face, w + 26, h + 26)}</g>
      {halo.map(([x, y], i) => <Melee key={i} x={x} y={y} r={5.6} />)}
      <g fill="url(#rd-face)" stroke={m.edge} strokeWidth="1.2">{faceShape(o.face, w, h)}</g>
      <text x={CX} y={SIG.FACE_Y} dominantBaseline="central" textAnchor="middle" fontFamily={f.family} fontWeight={f.weight} fontSize={fontSize}
        fill={m.engrave} filter="url(#rd-engrave)">{text}</text>
    </g>
  );
}

function Engagement({ o }: { o: RingOpts }) {
  const m = METALS[o.metal];
  const BY = 222, RO = 104, RI = 92, SY = 96; // band centre / radii, centre-stone y
  const outline = centreOutline(o.cut, CX, SY);
  const haloPts = o.setting === "halo"
    ? Array.from({ length: 30 }, (_, i) => {
        const p = outline(i / 30), dx = p[0] - CX, dy = p[1] - SY, len = Math.hypot(dx, dy) || 1;
        return [p[0] + (dx / len) * 9, p[1] + (dy / len) * 9] as Pt;
      })
    : [];
  const pave = o.setting === "pave" || o.setting === "halo" ? bandStones(BY, (RO + RI) / 2, 5.6, 24) : [];
  const prongAt = [0.08, 0.42, 0.58, 0.92].map(t => outline(t));
  return (
    <g filter="url(#rd-shadow)">
      <Band cy={BY} rOut={RO} rIn={RI} m={m} />
      {pave.map(([x, y], i) => <Melee key={i} x={x} y={y} r={5.6} />)}
      {/* basket / gallery under the stone */}
      <path d={`M${CX - 26} ${BY - RO + 6}L${CX - 34} ${SY + 22}L${CX + 34} ${SY + 22}L${CX + 26} ${BY - RO + 6}Z`} fill="url(#rd-metal)" stroke={m.edge} strokeWidth="1.3" />
      <path d={`M${CX - 30} ${SY + 40}h60`} stroke={m.edge} strokeWidth="1" opacity=".6" />
      {haloPts.map(([x, y], i) => <Melee key={i} x={x} y={y} r={6.2} />)}
      <Gem cx={CX} cy={SY} outline={outline} n={o.cut === "princess" ? 12 : 16} edge={2.4} />
      {prongAt.map(([x, y], i) => (
        <ellipse key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} rx="5" ry="6.5" fill="url(#rd-metal)" stroke={m.edge} strokeWidth="1" />
      ))}
    </g>
  );
}

export function RingSvg({ o }: { o: RingOpts }) {
  const m = METALS[o.metal];
  const what = o.style === "engagement"
    ? `${m.label.toLowerCase()} engagement ring with a ${CUTS[o.cut].toLowerCase()} diamond`
    : `${m.label.toLowerCase()} signet ring engraved ${o.initials || "OG"}`;
  return (
    // zoomed out so a ring appears about as big as the pendants and earrings in the same preview
    <svg viewBox="-170 -60 940 470" role="img" aria-label={`Preview of a ${what}`}>
      <MetalDefs m={m} />
      {o.style === "engagement" ? <Engagement o={o} /> : <Signet o={o} />}
    </svg>
  );
}

/* ---------- the window ---------- */

type Props = { onPick?: (kind: "pendant" | "earrings") => void; demoIndex?: number; onTouch?: () => void };

export default function RingDesigner({ onPick, demoIndex, onTouch }: Props) {
  const router = useRouter();
  const [o, setO] = useState<RingOpts>(BASE);
  const [touched, setTouched] = useState(false);
  const demo = demoIndex !== undefined && !touched;
  const shown = demo ? RING_DEMOS[demoIndex % RING_DEMOS.length] : { ...o, initials: o.initials || "OG" };

  const set = <K extends keyof RingOpts>(k: K, v: RingOpts[K]) => {
    if (!touched) { setTouched(true); onTouch?.(); }
    setO(p => ({ ...p, [k]: v }));
  };

  function order() {
    const p = shown;
    const prefill: DesignPrefill = p.style === "engagement"
      ? {
          piece: "Ring", name: "",
          desc: `Engagement ring: ${CUTS[p.cut].toLowerCase()} centre diamond, ${SETTINGS[p.setting].toLowerCase()} setting, ${METALS[p.metal].label.toLowerCase()}.`,
          metal: METALS[p.metal].order, stones: "Diamonds",
        }
      : {
          piece: "Ring", name: p.initials,
          desc: `Signet ring with ${FACES[p.face].toLowerCase()} face, initials "${p.initials || "OG"}" in ${FONTS[p.font].label} lettering, ${STONES[p.stones].toLowerCase()}.`,
          metal: METALS[p.metal].order, stones: p.stones === "none" ? "No stones" : "Diamonds",
        };
    try { sessionStorage.setItem(DESIGN_KEY, JSON.stringify(prefill)); } catch {}
    router.push("/order");
  }

  const seg = <K extends keyof RingOpts>(k: K, opts: Record<string, string>, label: string) => {
    const n = Object.keys(opts).length;
    return (
      <div>
        <p className="opt-label">{label}</p>
        <div className={"seg" + (n === 2 ? " c2" : n >= 4 ? " c4" : "")} role="group" aria-label={label}>
          {Object.entries(opts).map(([v, l]) => (
            <button key={v} type="button" aria-pressed={!demo && o[k] === v} onClick={() => set(k, v as RingOpts[K])}>
              {k === "metal" && <i style={{ background: METALS[v as Metal].swatch }} />}{l}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="np ring-np">
      <div className="np-head"><p className="label">Ring designer</p><span className="live">Live preview</span></div>
      <div className="stage">
        <div className={"ring-art" + (demo ? " demo" : "")} key={demo ? `d${demoIndex}` : "u"}><RingSvg o={shown} /></div>
      </div>
      <div className="np-body">
        <div className="seg kind" role="group" aria-label="Piece">
          <button type="button" aria-pressed="false" onClick={() => onPick?.("pendant")}>Pendant</button>
          <button type="button" aria-pressed="false" onClick={() => onPick?.("earrings")}>Earrings</button>
          <button type="button" aria-pressed="true">Ring</button>
        </div>
        {seg("style", { signet: "Signet ring", engagement: "Engagement ring" }, "Style")}
        {(demo ? shown.style : o.style) === "signet" ? (
          <>
            <div className="np-field">
              <label htmlFor="ring-initials">Initials <span>{o.initials.length} / 3</span></label>
              <input id="ring-initials" maxLength={3} autoComplete="off" spellCheck={false} placeholder="Your initials"
                value={o.initials} onChange={e => set("initials", e.target.value.replace(/[^\p{L}&]/gu, "").slice(0, 3))} />
            </div>
            {seg("metal", Object.fromEntries(Object.entries(METALS).map(([k, v]) => [k, v.label])), "Metal")}
            {seg("face", FACES, "Ring face")}
            {seg("stones", STONES, "Stones")}
            {seg("font", Object.fromEntries(Object.entries(FONTS).map(([k, v]) => [k, v.label])), "Lettering")}
          </>
        ) : (
          <>
            {seg("metal", Object.fromEntries(Object.entries(METALS).map(([k, v]) => [k, v.label])), "Metal")}
            {seg("cut", CUTS, "Centre diamond")}
            {seg("setting", SETTINGS, "Setting")}
          </>
        )}
        <div className="np-foot">
          <small>Preview only. Your final ring is designed by hand in 3D and sized to your finger.</small>
          <button type="button" className="btn" onClick={order}>Order this ring</button>
        </div>
      </div>
    </div>
  );
}
