"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PIECES, type Piece } from "@/lib/available";
import DealSeal from "./DealSeal";

const ready = PIECES.filter(p => p.status === "available" && p.image);
const pool = ready;
const MOVING = Math.min(6, pool.length);
const STEP_MS = 3200;

function Tile({ p, prev, k }: { p: Piece; prev?: Piece; k: number }) {
  return (
    <li>
      <Link href={`/available/${p.id}`} className="aw-tile">
        <span className="aw-pic">
          {prev && prev !== p && <img className="aw-prev" src={prev.image} alt="" aria-hidden="true" />}
          {/* each tile fades in a little after the one before it */}
          <img key={p.id} className="aw-cur" src={p.image} alt={p.title} decoding="async" style={{ animationDelay: `${k * 90}ms` }} />
        </span>
        {/* the discount shows on whichever tile the deal piece is in */}
        {p.deal && <DealSeal deal={p.deal} />}
        <span className="aw-cap"><span className="aw-name">{p.title}</span></span>
      </Link>
    </li>
  );
}

/**
 * "Buy now" window beside the designer: six same-size tiles that all fade to the next pieces every
 * few seconds; a piece with a deal carries its discount seal wherever it shows up. Tap a tile for its page.
 */
export default function AvailableWindow() {
  const [pos, setPos] = useState({ cur: 0, prev: -1 });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || pool.length <= MOVING || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      setPos(p => ({ cur: (p.cur + 1) % pool.length, prev: p.cur }));
    }, STEP_MS);
    return () => clearInterval(t);
  }, [paused]);

  if (!ready.length) return null;
  const at = (o: number, i: number) => pool[(o + i) % pool.length];
  return (
    <div className="aw" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="aw-head">
        <p className="aw-title">Buy now<span>Ready to ship, one of each</span></p>
      </div>
      <ul className="aw-grid">
        {Array.from({ length: MOVING }, (_, i) => (
          <Tile key={i} p={at(pos.cur, i)} prev={pos.prev >= 0 ? at(pos.prev, i) : undefined} k={i} />
        ))}
      </ul>
      <div className="aw-foot">
        <Link href="/available" className="btn">Shop all available →</Link>
      </div>
    </div>
  );
}
