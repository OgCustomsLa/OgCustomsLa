"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PIECES, type Piece } from "@/lib/available";
import DealSeal from "./DealSeal";
import { dealPrice, money } from "@/lib/gold";

const ready = PIECES.filter(p => p.status === "available" && p.image);
const pool = ready;
const MOVING = Math.min(6, pool.length);
const STEP_MS = 1800; // one tile changes this often, the next one after it

function Tile({ p, prev, price }: { p: Piece; prev?: Piece; price?: number }) {
  return (
    <li>
      <Link href={`/available/${p.id}`} className="aw-tile">
        <span className="aw-pic">
          {prev && prev !== p && <img className="aw-prev" src={prev.image} alt="" aria-hidden="true" />}
          <img key={p.id} className="aw-cur" src={p.image} alt={p.title} decoding="async" />
        </span>
        {/* the discount shows on whichever tile the deal piece is in */}
        {p.deal && <DealSeal deal={p.deal} />}
        <span className="aw-cap">
          <span className="aw-name">{p.title}</span>
          {price && (
            <span className="aw-price">
              {p.deal ? <><s>{money(price)}</s> <b>{money(dealPrice(price, p.deal))}</b></> : money(price)}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}

// tiles change one after another along a snake path through the 2-across grid:
// top row left → right, middle row right → left, bottom row left → right
const SNAKE = [0, 1, 3, 2, 4, 5];

/**
 * "Buy now" window beside the designer: six same-size tiles with name and price. Like dominoes, one tile
 * at a time (following SNAKE) fades to the piece that is off screen, so pieces travel along the grid.
 * A piece with a deal carries its discount tag wherever it shows up. Tap a tile for its page.
 */
export default function AvailableWindow({ prices = {} }: { prices?: Record<string, number> }) {
  // each tile: the piece showing now (index into pool) and the one it is fading from
  const [tiles, setTiles] = useState(() => Array.from({ length: MOVING }, (_, i) => ({ cur: i, prev: -1 })));
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (paused || pool.length <= MOVING || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setStep(s => s + 1), STEP_MS);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    if (step === 0) return;
    const order = SNAKE.filter(i => i < MOVING);
    const k = order[(step - 1) % order.length];
    setTiles(ts => {
      const shown = new Set(ts.map(x => x.cur));
      const next = pool.findIndex((_, i) => !shown.has(i)); // the piece that's off screen moves in
      return next < 0 ? ts : ts.map((x, i) => (i === k ? { cur: next, prev: x.cur } : x));
    });
  }, [step]);

  if (!ready.length) return null;
  return (
    <div className="aw" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="aw-head">
        <p className="aw-title">Buy now<span>Ready to ship, one of each</span></p>
      </div>
      <ul className="aw-grid">
        {tiles.map(({ cur, prev }, i) => (
          <Tile key={i} p={pool[cur]} prev={prev >= 0 ? pool[prev] : undefined} price={prices[pool[cur].id]} />
        ))}
      </ul>
      <div className="aw-foot">
        <Link href="/available" className="btn">Shop all available →</Link>
      </div>
    </div>
  );
}
