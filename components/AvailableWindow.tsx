"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PIECES, type Piece } from "@/lib/available";
import DealSeal from "./DealSeal";

const ready = PIECES.filter(p => p.status === "available" && p.image);
const pool = ready;
const MOVING = Math.min(6, pool.length);
const STEP_MS = 1600; // one tile changes this often

function Tile({ p, prev }: { p: Piece; prev?: Piece }) {
  return (
    <li>
      <Link href={`/available/${p.id}`} className="aw-tile">
        <span className="aw-pic">
          {prev && prev !== p && <img className="aw-prev" src={prev.image} alt="" aria-hidden="true" />}
          <img key={p.id} className="aw-cur" src={p.image} alt={p.title} decoding="async" />
        </span>
        {/* the discount shows on whichever tile the deal piece is in */}
        {p.deal && <DealSeal deal={p.deal} />}
        <span className="aw-cap"><span className="aw-name">{p.title}</span></span>
      </Link>
    </li>
  );
}

/**
 * "Buy now" window beside the designer: six same-size tiles. Every so often one tile, picked at random
 * (never the same one twice in a row), fades to a piece that isn't on screen, so the tiles change at
 * different times. A piece with a deal carries its discount tag wherever it shows up. Tap a tile for its page.
 */
export default function AvailableWindow() {
  // each tile: the piece showing now (index into pool) and the one it is fading from
  const [tiles, setTiles] = useState(() => Array.from({ length: MOVING }, (_, i) => ({ cur: i, prev: -1 })));
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || pool.length <= MOVING || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = -1;
    const t = setInterval(() => {
      // pick the tile here (not inside the state update, which React may run twice)
      let k = Math.floor(Math.random() * MOVING);
      if (k === last) k = (k + 1 + Math.floor(Math.random() * (MOVING - 1))) % MOVING;
      last = k;
      setTiles(ts => {
        const shown = new Set(ts.map(x => x.cur));
        const off = pool.map((_, i) => i).filter(i => !shown.has(i));
        const next = off[Math.floor(Math.random() * off.length)];
        return ts.map((x, i) => (i === k ? { cur: next, prev: x.cur } : x));
      });
    }, STEP_MS);
    return () => clearInterval(t);
  }, [paused]);

  if (!ready.length) return null;
  return (
    <div className="aw" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="aw-head">
        <p className="aw-title">Buy now<span>Ready to ship, one of each</span></p>
      </div>
      <ul className="aw-grid">
        {tiles.map(({ cur, prev }, i) => (
          <Tile key={i} p={pool[cur]} prev={prev >= 0 ? pool[prev] : undefined} />
        ))}
      </ul>
      <div className="aw-foot">
        <Link href="/available" className="btn">Shop all available →</Link>
      </div>
    </div>
  );
}
