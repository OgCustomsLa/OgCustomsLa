"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DESIGN_KEY, type DesignPrefill } from "@/lib/site";

/*
 * Live name pendant / earrings preview.
 * The drawing relies on measuring real SVG text and canvas pixels (getBBox, getPointAtLength,
 * getImageData), so the preview is driven imperatively inside one effect. The component
 * itself never re-renders, which keeps React and the DOM in sync.
 */

const OCT = "M1.39 .57L.57 1.39L-.57 1.39L-1.39 .57L-1.39 -.57L-.57 -1.39L.57 -1.39L1.39 -.57Z";
const RAYS =
  "M1.39 .57L3.2 0M.57 1.39L2.26 2.26M-.57 1.39L0 3.2M-1.39 .57L-2.26 2.26M-1.39 -.57L-3.2 0M-.57 -1.39L-2.26 -2.26M.57 -1.39L0 -3.2M1.39 -.57L2.26 -2.26";

function PaveStone({ x, y, edge, sparkle }: { x: number; y: number; edge: string; sparkle?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="3.3" fill="url(#m-dia)" stroke={edge} strokeWidth=".45" />
      <path d={OCT} fill="#F4F8FB" stroke="#9DB0BC" strokeWidth=".2" />
      <path d={RAYS} stroke="#8FA3B0" strokeWidth=".18" fill="none" />
      {sparkle && <circle cx="-1" cy="-1" r=".8" fill="#fff" />}
    </g>
  );
}

function PavePattern({ id, base, edge }: { id: string; base: string; edge: string }) {
  return (
    <pattern id={id} width="7" height="12.12" patternUnits="userSpaceOnUse">
      <rect width="7" height="12.12" fill={base} />
      <PaveStone x={3.5} y={3.03} edge={edge} />
      <PaveStone x={0} y={9.09} edge={edge} sparkle />
      <PaveStone x={7} y={9.09} edge={edge} sparkle />
    </pattern>
  );
}

type Font = [family: string, style: string, weight: string, label: string, upper: boolean];

const METALS: Record<string, [string, string]> = {
  gold: ["url(#m-gold)", "#8A6A2A"],
  silver: ["url(#m-silver)", "#6E7274"],
  rose: ["url(#m-rose)", "#8E5642"],
};
const FONTS: Record<string, Font> = {
  script: ["Yellowtail", "normal", "400", "Script", false],
  gothic: ["Pirata One", "normal", "400", "Gothic", false],
  retro: ["Lobster", "normal", "400", "Retro", false],
  signature: ["Satisfy", "normal", "400", "Signature", false],
  roman: ["Cinzel", "normal", "700", "Roman", true],
  bold: ["Bungee", "normal", "400", "Bold", true],
};

// demoIndex: when set, the parent drives the showcase (which example to show); onTouch fires on first interaction
type Props = { onRing?: () => void; startKind?: "pendant" | "earrings"; demoIndex?: number; onTouch?: () => void; overlay?: React.ReactNode };

export default function NameDesigner({ onRing, startKind = "pendant", demoIndex, onTouch, overlay }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const onRingRef = useRef(onRing), onTouchRef = useRef(onTouch), demoIndexRef = useRef(demoIndex);
  onRingRef.current = onRing; onTouchRef.current = onTouch; demoIndexRef.current = demoIndex;
  const showRef = useRef<((i: number) => void) | null>(null);
  useEffect(() => { if (demoIndex !== undefined) showRef.current?.(demoIndex); }, [demoIndex]);

  useEffect(() => {
    const box = root.current!;
    const $ = <T extends Element>(sel: string) => box.querySelector(sel) as T;
    const $$ = <T extends Element>(sel: string) => Array.from(box.querySelectorAll(sel)) as T[];
    const ac = new AbortController();
    const on = (el: EventTarget, ev: string, fn: EventListener) => el.addEventListener(ev, fn, { signal: ac.signal });
    let alive = true;

    const NS = "http://www.w3.org/2000/svg", FS = 150;
    const svg = $<SVGSVGElement>("#np-svg"), text = $<SVGTextElement>("#np-text"),
      swash = $<SVGPathElement>("#np-swash"), beads = $<SVGGElement>("#np-beads"),
      input = $<HTMLInputElement>("#np-name"), count = $<HTMLSpanElement>("#np-count"),
      // outline copy drawn behind the name, so joined script letters get one outline with no seams between them
      edgeText = $<SVGTextElement>("#np-text-edge");
    let metal = "gold", font = "script", line = "line", ice = "none", kind = "pendant";
    // showcase: until the visitor types or picks an option, rotate through example pieces
    // alternates pendant / earrings
    const DEMOS = [
      { kind: "pendant", name: "Sofia", font: "signature", metal: "gold", ice: "none" },
      { kind: "earrings", name: "OG", font: "bold", metal: "gold", ice: "all" },
      { kind: "pendant", name: "Marco", font: "gothic", metal: "silver", ice: "line" },
      { kind: "earrings", name: "Mia", font: "script", metal: "rose", ice: "none" },
      { kind: "pendant", name: "Jayden", font: "bold", metal: "gold", ice: "all" },
      { kind: "earrings", name: "LA", font: "gothic", metal: "silver", ice: "all" },
    ];
    let demo = true, demoI = (demoIndexRef.current ?? 0) % DEMOS.length, demoTimer = 0;
    const demoOn = () => demo && !input.value.trim() && kind === "pendant";
    function stopDemo() {
      if (!demo) return;
      demo = false; clearInterval(demoTimer); svg.classList.remove("swap");
      onTouchRef.current?.();
    }
    let bottomCanvas: HTMLCanvasElement | null = null, hookCtx: CanvasRenderingContext2D | null = null, hookCanvas: HTMLCanvasElement | null = null;

    function clean(v: string) {
      v = v.replace(/[^\p{L}\s'’-]/gu, "").replace(/\s{2,}/g, " ").replace(/^[\s'’-]+/, "");
      return v.slice(0, input.maxLength || 24);
    }
    function letterBottom(ch: string, f: Font) {
      try {
        const W2 = Math.ceil(FS * 1.8), H2 = Math.ceil(FS * 1.8), cv = bottomCanvas || (bottomCanvas = document.createElement("canvas"));
        cv.width = W2; cv.height = H2; const g = cv.getContext("2d", { willReadFrequently: true })!;
        g.font = `${f[1]} ${f[2]} ${FS}px "${f[0]}"`; g.fillStyle = "#000"; g.textBaseline = "alphabetic";
        const ox = Math.round(FS * 0.4), oy = Math.round(FS * 1.1); g.clearRect(0, 0, W2, H2); g.fillText(ch, ox, oy);
        const d = g.getImageData(0, 0, W2, H2).data;
        for (let y = H2 - 1; y >= 0; y--) { for (let x = 0; x < W2; x++) { if (d[(y * W2 + x) * 4 + 3] > 120) {
          // take the left-most ink on that lowest row band
          let bx = x; for (let yy = y; yy > y - 4 && yy >= 0; yy--) { for (let xx = 0; xx < bx; xx++) { if (d[(yy * W2 + xx) * 4 + 3] > 120) { bx = xx; break; } } }
          return { x: bx - ox, y: y - oy };
        } } }
      } catch {}
      return null;
    }
    // a small brilliant-cut diamond seen from above: girdle, table, facets and a sparkle
    function stone(x: number, y: number, r: number, i: number) {
      const g = document.createElementNS(NS, "g"); g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${((i || 0) * 17) % 45})`);
      const mk = (t: string, a: Record<string, string | number>) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, String(a[k])); g.appendChild(e); return e; };
      const P = (rad: number, ang: number) => [Math.cos(ang) * rad, Math.sin(ang) * rad], f2 = (p: number[]) => p[0].toFixed(2) + " " + p[1].toFixed(2);
      const T = [...Array(8)].map((_, k) => P(r * .52, Math.PI / 8 + k * Math.PI / 4)), G = [...Array(8)].map((_, k) => P(r, k * Math.PI / 4)), M = [...Array(8)].map((_, k) => P(r, Math.PI / 8 + k * Math.PI / 4));
      mk("circle", { r, class: "st-base", "stroke-width": .9 });
      for (let k = 0; k < 8; k++) {
        const a = T[k], b = T[(k + 1) % 8], c = G[(k + 1) % 8];
        mk("path", { class: k % 2 ? "st-dark" : "st-light", d: `M${f2(a)}L${f2(b)}L${f2(c)}Z` }); // star facets
        mk("path", { class: (k + i) % 3 === 0 ? "st-fire" : "st-mid", d: `M${f2(a)}L${f2(M[k])}L${f2(G[k])}Z` }); // upper girdle facets
      }
      mk("path", { class: "st-table", d: "M" + T.map(f2).join("L") + "Z" });
      mk("path", { class: "st-hi", d: `M${(-r * .3).toFixed(2)} ${(-r * .62).toFixed(2)}l${(r * .1).toFixed(2)} ${(r * .26).toFixed(2)}l${(r * .26).toFixed(2)} ${(r * .1).toFixed(2)}l${(-r * .26).toFixed(2)} ${(r * .1).toFixed(2)}l${(-r * .1).toFixed(2)} ${(r * .26).toFixed(2)}l${(-r * .1).toFixed(2)} ${(-r * .26).toFixed(2)}l${(-r * .26).toFixed(2)} ${(-r * .1).toFixed(2)}l${(r * .26).toFixed(2)} ${(-r * .1).toFixed(2)}z` });
      return g;
    }
    function paint() {
      const [fill, edge] = METALS[metal];
      text.setAttribute("fill", ice === "all" ? `url(#pave-${metal})` : fill);
      text.setAttribute("stroke", "none");
      edgeText.setAttribute("fill", edge);
      edgeText.setAttribute("stroke", edge);
      edgeText.setAttribute("stroke-width", ice === "all" ? "5" : "4");
      swash.setAttribute("stroke", fill);
      $("#np-hooks").setAttribute("stroke", fill);
      beads.querySelectorAll(".st-base").forEach(c => { c.setAttribute("fill", "url(#m-dia)"); c.setAttribute("stroke", edge); });
      const fx = (sel: string, f: string) => beads.querySelectorAll(sel).forEach(c => { c.setAttribute("fill", f); c.setAttribute("stroke", "#8EA2AF"); c.setAttribute("stroke-width", ".25"); });
      fx(".st-light", "#F7FBFE"); fx(".st-dark", "#9FB3C0"); fx(".st-mid", "#D5E2EA"); fx(".st-fire", "url(#m-fire)"); fx(".st-table", "url(#m-table)");
      beads.querySelectorAll(".st-hi").forEach(c => { c.setAttribute("fill", "#fff"); });
    }
    let showing: (typeof DEMOS)[number] | null = null; // showcase piece being drawn right now
    function layout() {
      if (!demoOn()) return drawLayout();
      const d = DEMOS[demoI], saved = [metal, font, ice, line, kind] as const;
      metal = d.metal; font = d.font; ice = d.ice; kind = d.kind; line = d.kind === "earrings" ? "none" : "line";
      showing = d;
      drawLayout();
      showing = null;
      [metal, font, ice, line, kind] = saved;
    }
    function drawLayout() {
      if (!alive) return;
      // nothing typed yet: show a faded sample name so the preview is never just a line
      const sample = !input.value.trim();
      let name = sample ? (showing ? showing.name : kind === "earrings" ? "OG" : "Sofia") : input.value.trim();
      const empty = false;
      svg.classList.toggle("sample", sample && !showing);
      name = name.charAt(0).toUpperCase() + name.slice(1);
      const f = FONTS[font];
      if (f[4]) name = name.toUpperCase();
      text.setAttribute("font-family", `'${f[0]}', cursive`); text.setAttribute("font-style", f[1]); text.setAttribute("font-weight", f[2]);
      text.textContent = name;
      for (const a of ["font-family", "font-style", "font-weight"]) edgeText.setAttribute(a, text.getAttribute(a)!);
      edgeText.textContent = name;
      // horizontal size from the real letters; vertical shape from the font size, so letters like g, j, y never break it
      // no name yet: draw only the underline, sized like a medium name
      const bb = empty ? { x: -260, y: -FS * 0.62, width: 520, height: FS * 0.8 } : text.getBBox();
      const L = bb.x, R = bb.x + bb.width, W = bb.width;
      const base = FS * 0.16;
      const sx = L - FS * 0.10, ex = R + FS * 0.06;
      // with a line: start the line from the bottom of the first letter so they're joined
      let startD = `M${sx} ${base + FS * 0.02} C ${L + W * 0.30} ${base + FS * 0.12}`;
      if (!empty && line !== "none") {
        const lb = letterBottom(text.textContent.charAt(0), f);
        if (lb) {
          let o = L; try { o = text.getStartPositionOfChar(0).x; } catch {}
          const bx = o + lb.x, by = Math.min(lb.y, base + FS * 0.06);
          startD = `M${(bx - 2).toFixed(1)} ${(by - 5).toFixed(1)} C ${(bx + W * 0.06).toFixed(1)} ${(base + FS * 0.16).toFixed(1)}`;
        }
      }
      const d = `${startD}, ${R - W * 0.25} ${base + FS * 0.06}, ${ex} ${base - FS * 0.14} S ${ex + FS * 0.04} ${base - FS * 0.38}, ${ex - FS * 0.06} ${base - FS * 0.36}`;
      swash.setAttribute("d", d);
      swash.style.display = line === "none" ? "none" : "";
      const stones = line !== "none" && ice !== "none";
      swash.setAttribute("stroke-width", stones ? "18" : "15");
      while (beads.firstChild) beads.removeChild(beads.firstChild);
      const len = swash.getTotalLength();
      if (stones) {
        const r0 = 6.6, step = r0 * 2 + 0.6, n = Math.floor(len / step);
        const off = (len - n * step) / 2;
        for (let i = 0; i <= n; i++) {
          const p = swash.getPointAtLength(Math.min(len, off + i * step));
          beads.appendChild(stone(p.x, p.y, r0, i));
        }
      }
      // fit into a fixed 16:9 frame, centered
      const top = bb.y - FS * 0.06, bottom = line === "none" ? bb.y + bb.height + FS * 0.04 : Math.max(base + FS * 0.22, bb.y + bb.height);
      const sb = line === "none" ? bb : swash.getBBox();
      let left = Math.min(sb.x, L) - 24, right = Math.max(sb.x + sb.width, R) + 24;
      const piece = $<SVGGElement>("#np-piece"), clone = $<SVGUseElement>("#np-clone"), hooks = $<SVGGElement>("#np-hooks");
      let tp = top, bt = bottom;
      if (kind === "earrings") {
        const s = .62, px0 = Math.min(sb.x, L), px1 = Math.max(sb.x + sb.width, R), pw = (px1 - px0) * s, gap = Math.max(70, pw * .22);
        const tx = -px0 * s, dx = pw + gap;
        piece.setAttribute("transform", `translate(${tx.toFixed(1)} 0) scale(${s})`);
        clone.setAttribute("transform", `translate(${dx.toFixed(1)} 0)`); clone.style.display = "";
        // where the wire attaches (measured from the real font): 1 letter → its top centre,
        // 2 letters → the middle where they meet, 3 letters → the top of the middle one
        const ctx = hookCtx || (hookCtx = document.createElement("canvas").getContext("2d")!);
        ctx.font = `${f[1]} ${f[2]} ${FS}px "${f[0]}"`;
        const txt = (text.textContent || "").trim(), ci = txt.length === 3 ? 1 : 0;
        const ch = txt.length === 2 ? txt : txt.charAt(ci) || "A", m = ctx.measureText(ch);
        const cTop = -(m.actualBoundingBoxAscent || FS * 0.7);
        let cMid = bb.x + ((m.actualBoundingBoxRight || FS * 0.5) - (m.actualBoundingBoxLeft || 0)) / 2;
        try { if (txt) { const o = text.getStartPositionOfChar(ci).x; cMid = o + ((m.actualBoundingBoxRight || 0) - (m.actualBoundingBoxLeft || 0)) / 2; } } catch {}
        // find the real top of the ink in the letter's center column (works for V, W, Y, U too)
        let inkTop = cTop, bar: { y: number; x1: number; x2: number } | null = null;
        try {
          const W2 = Math.ceil(FS * 1.6), H2 = Math.ceil(FS * 1.6), cv = hookCanvas || (hookCanvas = document.createElement("canvas"));
          cv.width = W2; cv.height = H2; const g = cv.getContext("2d", { willReadFrequently: true })!;
          g.font = ctx.font; g.textBaseline = "alphabetic"; g.fillStyle = "#000";
          const ox = Math.round(FS * 0.3), oy = Math.round(FS * 1.1); g.clearRect(0, 0, W2, H2); g.fillText(ch, ox, oy);
          const colX = Math.round(ox + ((m.actualBoundingBoxRight || 0) - (m.actualBoundingBoxLeft || 0)) / 2);
          const col = g.getImageData(colX - 1, 0, 3, H2).data;
          let found = false;
          for (let y = 0; y < H2; y++) { const k = y * 12; if (col[k + 3] > 110 || col[k + 7] > 110 || col[k + 11] > 110) { inkTop = y - oy; found = true; break; } }
          // open tops (V, W, Y, U…) or the gap between two letters: bridge them with a small bar near the top
          if (!found || inkTop - cTop > FS * 0.12) {
            const ry = Math.round(oy + cTop + FS * 0.05), row = g.getImageData(0, ry, W2, 1).data;
            let lx = -1, rx = -1;
            for (let x = colX; x >= 0; x--) { if (row[x * 4 + 3] > 110) { lx = x; break; } }
            for (let x = colX; x < W2; x++) { if (row[x * 4 + 3] > 110) { rx = x; break; } }
            if (lx >= 0 && rx >= 0) { bar = { y: ry - oy, x1: lx - ox, x2: rx - ox }; inkTop = ry - oy; }
          }
        } catch {}
        const hx = tx + cMid * s, y0 = inkTop * s + 2; // wire starts just inside the top of the letters
        const org = (() => { try { return text.getStartPositionOfChar(ci).x; } catch { return bb.x; } })();
        const barD = (off: number) => bar ? ` M${(off + (org + bar.x1) * s).toFixed(1)} ${(bar.y * s).toFixed(1)} H${(off + (org + bar.x2) * s).toFixed(1)}` : "";
        // French wire: straight up, sweeping back over the ear, finished with a small ball tip.
        // dir mirrors it so the two wires of the pair curl toward each other.
        const hook = (x: number, off: number, dir: -1 | 1) => {
          const top = y0 - 18, ex = x + dir * 30, ey = y0 - 20;
          return `M${x.toFixed(1)} ${y0.toFixed(1)} V${top.toFixed(1)} C${x.toFixed(1)} ${(top - 30).toFixed(1)} ${(x + dir * 34).toFixed(1)} ${(top - 30).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`
            + ` M${(ex - 2).toFixed(1)} ${ey.toFixed(1)} a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0` + barD(off);
        };
        $("#np-h1").setAttribute("d", hook(hx, tx, 1)); $("#np-h2").setAttribute("d", hook(hx + dx, tx + dx, -1));
        hooks.style.display = "";
        left = -24; right = pw * 2 + gap + 24; tp = y0 - 52; bt = bottom * s;
      } else {
        piece.removeAttribute("transform"); clone.style.display = "none"; hooks.style.display = "none";
      }
      let w = right - left, hgt = bt - tp + 40;
      if (w / hgt < 2) w = hgt * 2; else hgt = w / 2;
      const cx = (left + right) / 2, cy = (tp + bt) / 2;
      svg.setAttribute("viewBox", `${(cx - w * 0.58).toFixed(1)} ${(cy - hgt * 0.58).toFixed(1)} ${(w * 1.16).toFixed(1)} ${(hgt * 1.16).toFixed(1)}`);
      paint();
      svg.classList.add("ready");
    }
    // font buttons preview the typed name (or the style name when empty)
    function samples() {
      const raw = input.value.trim(); let t = raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : "";
      if (t.length > 8) t = t.slice(0, 7) + "…";
      $$<HTMLButtonElement>("#np-fonts button").forEach(b => {
        const s = b.querySelector<HTMLSpanElement>(".fs")!, f = FONTS[b.dataset.f!], show = t || f[3];
        s.textContent = f[4] ? show.toUpperCase() : show; s.hidden = false;
        b.querySelector("small")!.hidden = !t;
      });
    }
    function group(id: string, fn: (b: HTMLButtonElement) => void) {
      const btns = $$<HTMLButtonElement>("#" + id + " button");
      btns.forEach(b => on(b, "click", () => { stopDemo(); btns.forEach(x => x.setAttribute("aria-pressed", String(x === b))); fn(b); }));
    }

    on(input, "input", () => {
      stopDemo();
      const v = clean(input.value);
      if (v !== input.value) input.value = v;
      count.textContent = `${input.value.length} / ${input.maxLength}`;
      samples();
      layout();
    });
    group("np-metals", b => { metal = b.dataset.m!; paint(); });
    const iceLineBtn = $<HTMLButtonElement>('#np-ice [data-i="line"]');
    group("np-lines", b => {
      line = b.dataset.u!;
      iceLineBtn.disabled = line === "none";
      if (line === "none" && ice === "line") { ice = "none"; $$("#np-ice button").forEach(x => x.setAttribute("aria-pressed", String((x as HTMLElement).dataset.i === "none"))); }
      layout();
    });
    group("np-ice", b => { ice = b.dataset.i!; layout(); });
    let savedLine = "line", savedIce = "none", savedName = "";
    group("np-kind", b => {
      const k = b.dataset.k!;
      if (k === "ring") { onRingRef.current?.(); return; }
      if (k === kind) return;
      if (k === "earrings") {
        savedLine = line; savedIce = ice;
        savedName = input.value; input.maxLength = 3; input.value = input.value.slice(0, 3);
        $<HTMLButtonElement>('#np-lines [data-u="none"]').click();
        $<HTMLDivElement>("#np-line-wrap").hidden = true;
      } else {
        input.maxLength = 24; if (savedName.startsWith(input.value)) input.value = savedName;
        $<HTMLDivElement>("#np-line-wrap").hidden = false;
        $<HTMLButtonElement>(`#np-lines [data-u="${savedLine}"]`).click();
        const ib = $<HTMLButtonElement>(`#np-ice [data-i="${savedIce}"]`); ib.disabled = false; ib.click();
      }
      kind = k; count.textContent = `${input.value.length} / ${input.maxLength}`; samples(); layout();
      input.placeholder = k === "earrings" ? "Up to 3 letters" : "Type your name";
    });
    group("np-fonts", b => {
      font = b.dataset.f!; layout();
      const f = FONTS[font];
      if (document.fonts) document.fonts.load(`${f[1]} ${f[2]} 150px "${f[0]}"`).then(layout, () => {});
    });
    on($("#np-order"), "click", () => {
      const name = input.value.trim();
      const u = line === "none" ? "no underline" : "an underline";
      const s = ({ none: "no stones", line: "iced underline", all: "fully iced (stones on letters and underline)" } as Record<string, string>)[ice];
      const desc = `Name ${kind === "earrings" ? "earrings" : "pendant"}${name ? ` "${name}"` : ""} in ${FONTS[font][3]} font, with ${u}, ${s}.`;
      const m = ({ gold: "Yellow gold", silver: "Sterling silver", rose: "Rose gold" } as Record<string, string>)[metal];
      const prefill: DesignPrefill = { piece: kind === "earrings" ? "Earrings" : "Name pendant", name, desc, metal: m, stones: ice === "none" ? "No stones" : "Not sure — advise me" };
      try { sessionStorage.setItem(DESIGN_KEY, JSON.stringify(prefill)); } catch {}
      router.push("/order");
    });

    samples();
    layout();
    if (document.fonts) { document.fonts.load("150px Yellowtail").then(layout, () => {}); document.fonts.ready.then(layout); }

    // load the showcase fonts, then start rotating (not for visitors who prefer reduced motion)
    if (document.fonts) DEMOS.forEach(d => { const f = FONTS[d.font]; document.fonts.load(`${f[1]} ${f[2]} 150px "${f[0]}"`).then(layout, () => {}); });
    // parent-driven showcase: jump to the requested example with the same fade
    showRef.current = (i: number) => {
      if (!demoOn()) return;
      svg.classList.add("swap");
      setTimeout(() => { if (!alive || !demoOn()) return; demoI = i % DEMOS.length; layout(); svg.classList.remove("swap"); }, 380);
    };
    if (demoIndexRef.current === undefined && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      demoTimer = window.setInterval(() => {
        if (!demoOn()) return;
        svg.classList.add("swap");
        setTimeout(() => { if (!alive || !demoOn()) return; demoI = (demoI + 1) % DEMOS.length; layout(); svg.classList.remove("swap"); }, 380);
      }, 2800);
    }

    // coming back from the ring designer with earrings picked
    if (startKind === "earrings") $<HTMLButtonElement>('#np-kind [data-k="earrings"]').click();

    return () => { alive = false; clearInterval(demoTimer); ac.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div className="np" ref={root}>
      <div className="np-head"><p className="label">Name jewelry designer</p><span className="live">Live preview</span></div>
      <div className="stage">
        <svg id="np-svg" viewBox="0 0 600 340" role="img" aria-label="Preview of a script name pendant">
          <defs>
            <linearGradient id="m-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F6E3A6" /><stop offset=".38" stopColor="#D9B158" /><stop offset=".62" stopColor="#A9822F" /><stop offset="1" stopColor="#E7C977" /></linearGradient>
            <linearGradient id="m-silver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".4" stopColor="#C9CCCD" /><stop offset=".65" stopColor="#8E9294" /><stop offset="1" stopColor="#E3E5E6" /></linearGradient>
            <linearGradient id="m-rose" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F9D9C9" /><stop offset=".4" stopColor="#DDA38A" /><stop offset=".65" stopColor="#A86C55" /><stop offset="1" stopColor="#EDBFA9" /></linearGradient>
            <radialGradient id="m-dia" cx=".4" cy=".35" r=".75"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".35" stopColor="#EAF2F7" /><stop offset=".7" stopColor="#B9CAD5" /><stop offset="1" stopColor="#7F95A3" /></radialGradient>
            <linearGradient id="m-fire" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E9F6FF" /><stop offset=".45" stopColor="#F9E6F3" /><stop offset="1" stopColor="#FFF4D6" /></linearGradient>
            <linearGradient id="m-table" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".5" stopColor="#DDE8EF" /><stop offset="1" stopColor="#F7FBFD" /></linearGradient>
            <radialGradient id="m-ice" cx=".35" cy=".35" r=".8"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".5" stopColor="#E8F1F6" /><stop offset="1" stopColor="#9FB3BF" /></radialGradient>
            <PavePattern id="pave-gold" base="#C9A24E" edge="#8A6A2A" />
            <PavePattern id="pave-silver" base="#B9BDBF" edge="#6E7274" />
            <PavePattern id="pave-rose" base="#D29A82" edge="#8E5642" />
            {/* Fixed region in user space: a %-of-bbox region clips script letters on iOS Safari, whose text bbox is narrower than the ink */}
            <filter id="np-shadow" filterUnits="userSpaceOnUse" x="-1500" y="-1000" width="6000" height="2500"><feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#000" floodOpacity=".2" /></filter>
          </defs>
          {/* earring wires first, so the letters sit on top of them */}
          <g id="np-hooks" fill="none" strokeWidth="4" strokeLinecap="round" style={{ display: "none" }}><path id="np-h1" /><path id="np-h2" /></g>
          <g id="np-piece" filter="url(#np-shadow)">
            <path id="np-swash" fill="none" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
            <g id="np-beads"></g>
            <text id="np-text-edge" x="0" y="0" fontSize="150" fontFamily="Yellowtail, cursive" fontWeight="400" strokeLinejoin="round" aria-hidden="true">Sofia</text>
            <text id="np-text" x="0" y="0" fontSize="150" fontFamily="Yellowtail, cursive" fontWeight="400">Sofia</text>
          </g>
          <use id="np-clone" href="#np-piece" style={{ display: "none" }} />
        </svg>
        {overlay && <div className="stage-overlay" aria-hidden="true">{overlay}</div>}
      </div>
      <div className="np-body">
        <div className="seg kind" role="group" aria-label="Piece" id="np-kind">
          <button type="button" data-k="pendant" aria-pressed="true">Pendant</button>
          <button type="button" data-k="earrings" aria-pressed="false">Earrings</button>
          <button type="button" data-k="ring" aria-pressed="false">Ring</button>
        </div>
        <div className="np-field">
          <label htmlFor="np-name">Name <span id="np-count">0 / 24</span></label>
          <input id="np-name" maxLength={24} defaultValue="" autoComplete="off" spellCheck={false} placeholder="Type your name" />
        </div>
        <div>
          <p className="opt-label">Metal</p>
          <div className="seg" role="group" aria-label="Metal" id="np-metals">
            <button type="button" data-m="gold" aria-pressed="true"><i style={{ background: "linear-gradient(#F6E3A6,#A9822F)" }}></i>Gold</button>
            <button type="button" data-m="silver" aria-pressed="false"><i style={{ background: "linear-gradient(#fff,#8E9294)" }}></i>Silver</button>
            <button type="button" data-m="rose" aria-pressed="false"><i style={{ background: "linear-gradient(#F9D9C9,#A86C55)" }}></i>Rose gold</button>
          </div>
        </div>
        <div>
          <p className="opt-label">Iced</p>
          <div className="seg" role="group" aria-label="Iced" id="np-ice">
            <button type="button" data-i="none" aria-pressed="true">No stones</button>
            <button type="button" data-i="line" aria-pressed="false">Underline</button>
            <button type="button" data-i="all" aria-pressed="false">Full piece</button>
          </div>
        </div>
        <div id="np-line-wrap">
          <p className="opt-label">Underline</p>
          <div className="seg c2" role="group" aria-label="Underline" id="np-lines">
            <button type="button" data-u="line" aria-pressed="true">With line</button>
            <button type="button" data-u="none" aria-pressed="false">No line</button>
          </div>
        </div>
        <div>
          <p className="opt-label">Font</p>
          <div className="seg fonts" role="group" aria-label="Font" id="np-fonts">
            {Object.entries(FONTS).map(([key, f], i) => (
              <button key={key} type="button" data-f={key} aria-pressed={i === 0}>
                <span style={{ fontFamily: `'${f[0]}', ${f[4] ? "sans-serif" : "cursive"}`, fontWeight: f[2] === "700" ? 700 : undefined }} className="fs" hidden></span>
                <small>{f[3]}</small>
              </button>
            ))}
          </div>
          <p className="font-note">These are just a few examples — we have many more fonts. Tell us any style you like when you order. This preview is only a rough idea; your finished piece will look much better.</p>
        </div>
        <div className="np-foot">
          <small>Preview only. Your final piece is designed by hand in 3D.</small>
          <button type="button" className="btn" id="np-order">Order this design</button>
        </div>
      </div>
    </div>
  );
}
