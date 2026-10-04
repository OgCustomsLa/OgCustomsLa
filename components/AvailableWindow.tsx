"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PIECES } from "@/lib/available";

const ready = PIECES.filter(p => p.status === "available" && p.image);
const SLOTS = Math.min(4, ready.length);
const STEP_MS = 2600;

/**
 * "Available now" window beside the designer: four same-size tiles. Every few seconds one tile
 * (taking turns) fades to the next piece not on screen, so all pieces come round. Tap a tile for its page.
 */
export default function AvailableWindow() {
  // each slot: the piece showing now, and the one it is fading from
  const [slots, setSlots] = useState(() => Array.from({ length: SLOTS }, (_, k) => ({ cur: k, prev: -1 })));
  const [turn, setTurn] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || ready.length <= SLOTS || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      setSlots(s => {
        const shown = new Set(s.map(x => x.cur));
        const k = turn % SLOTS;
        let next = (Math.max(...s.map(x => x.cur)) + 1) % ready.length;
        while (shown.has(next)) next = (next + 1) % ready.length;
        return s.map((x, i) => (i === k ? { cur: next, prev: x.cur } : x));
      });
      setTurn(n => n + 1);
    }, STEP_MS);
    return () => clearInterval(t);
  }, [paused, turn]);

  if (!ready.length) return null;
  return (
    <div className="aw" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="aw-head">
        <span className="live-dot" aria-hidden="true" />
        <p className="aw-title">Available now<span>Finished, ready to ship</span></p>
        <span className="aw-count">{ready.length} pieces</span>
      </div>
      <ul className="aw-grid">
        {slots.map(({ cur, prev }, k) => {
          const p = ready[cur];
          return (
            <li key={k}>
              <Link href={`/available/${p.id}`} className="aw-tile">
                <span className="aw-pic">
                  {prev >= 0 && <img className="aw-prev" src={ready[prev].image} alt="" aria-hidden="true" />}
                  <img key={p.id} className="aw-cur" src={p.image} alt={p.title} decoding="async" />
                </span>
                <span className="aw-cap">
                  <span className="aw-name">{p.title}</span>
                  <span className="aw-meta">{p.price ? "$" + p.price.toLocaleString("en-US") : "Price on request"}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="aw-foot">
        <Link href="/available" className="btn">Shop all available →</Link>
      </div>
    </div>
  );
}
