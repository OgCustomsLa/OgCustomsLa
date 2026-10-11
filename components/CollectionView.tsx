"use client";

import { useMemo, useState } from "react";
import type { Piece } from "@/lib/available";
import { dealPrice } from "@/lib/gold";
import ProductCard from "./ProductCard";

type Sort = "rec" | "low" | "high";

/** Shop collection: filter sidebar (category, metal, diamonds, price), sort and a grid of product cards. */
export default function CollectionView({ pieces, prices, initialCat }: { pieces: Piece[]; prices: Record<string, number>; initialCat?: string }) {
  const sale = (p: Piece) => (prices[p.id] ? dealPrice(prices[p.id], p.deal) : undefined);
  const cats = useMemo(() => Array.from(new Set(pieces.map(p => p.category))), [pieces]);
  const metals = useMemo(() => Array.from(new Set(pieces.map(p => p.metal ?? "Yellow gold"))), [pieces]);
  const top = Math.max(0, ...pieces.map(p => sale(p) ?? 0));

  const [cat, setCat] = useState<string[]>(initialCat ? [initialCat] : []);
  const [metal, setMetal] = useState<string[]>([]);
  const [stones, setStones] = useState<"" | "yes" | "no">("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sort, setSort] = useState<Sort>("rec");
  const [open, setOpen] = useState(false); // filter drawer on phones

  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
  const shown = pieces
    .filter(p => !cat.length || cat.includes(p.category))
    .filter(p => !metal.length || metal.includes(p.metal ?? "Yellow gold"))
    .filter(p => !stones || (stones === "yes") === !!p.diamonds)
    .filter(p => { const v = sale(p); return (!min || (v ?? 0) >= +min) && (!max || (v ?? Infinity) <= +max); });
  if (sort !== "rec") shown.sort((a, b) => ((sale(a) ?? 0) - (sale(b) ?? 0)) * (sort === "low" ? 1 : -1));
  const active = cat.length + metal.length + (stones ? 1 : 0) + (min || max ? 1 : 0);
  const clear = () => { setCat([]); setMetal([]); setStones(""); setMin(""); setMax(""); };

  return (
    <div className="cv">
      <aside className={"cv-filters" + (open ? " open" : "")} aria-label="Filters">
        <div className="cv-f-head">
          <p>Filters{active ? ` (${active})` : ""}</p>
          {active > 0 && <button type="button" onClick={clear}>Clear all</button>}
          <button type="button" className="cv-close" aria-label="Close filters" onClick={() => setOpen(false)}>×</button>
        </div>
        <details open>
          <summary>Category</summary>
          {cats.map(c => (
            <label key={c}><input type="checkbox" checked={cat.includes(c)} onChange={() => toggle(cat, setCat, c)} />{c}<span>{pieces.filter(p => p.category === c).length}</span></label>
          ))}
        </details>
        <details open>
          <summary>Price</summary>
          <div className="cv-price">
            <input type="number" inputMode="numeric" min={0} placeholder="Min" value={min} onChange={e => setMin(e.target.value)} aria-label="Minimum price" />
            <span>–</span>
            <input type="number" inputMode="numeric" min={0} placeholder={top ? `${top}` : "Max"} value={max} onChange={e => setMax(e.target.value)} aria-label="Maximum price" />
          </div>
        </details>
        <details open>
          <summary>Metal color</summary>
          {metals.map(m => (
            <label key={m}><input type="checkbox" checked={metal.includes(m)} onChange={() => toggle(metal, setMetal, m)} /><i className={"cv-sw " + m.split(" ")[0].toLowerCase()} />{m}</label>
          ))}
        </details>
        <details open>
          <summary>Stones</summary>
          <label><input type="radio" name="stones" checked={stones === ""} onChange={() => setStones("")} />All</label>
          <label><input type="radio" name="stones" checked={stones === "yes"} onChange={() => setStones("yes")} />With diamonds</label>
          <label><input type="radio" name="stones" checked={stones === "no"} onChange={() => setStones("no")} />Solid gold</label>
        </details>
        <button type="button" className="btn cv-apply" onClick={() => setOpen(false)}>Show {shown.length} items</button>
      </aside>

      <div className="cv-main">
        <div className="cv-bar">
          <button type="button" className="cv-open" onClick={() => setOpen(true)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>Filters{active ? ` (${active})` : ""}
          </button>
          <p className="cv-count">{shown.length} items</p>
          <label className="cv-sort">
            <span>Sort by</span>
            <select value={sort} onChange={e => setSort(e.target.value as Sort)}>
              <option value="rec">Recommended</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
        </div>
        {shown.length ? (
          <ul className="pc-grid">
            {shown.map(p => <li key={p.id}><ProductCard p={p} price={prices[p.id]} /></li>)}
          </ul>
        ) : (
          <div className="cv-empty"><p>No pieces match these filters.</p><button type="button" className="btn ghost" onClick={clear}>Clear filters</button></div>
        )}
      </div>
      {open && <div className="cv-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
    </div>
  );
}
