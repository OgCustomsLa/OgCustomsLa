"use client";

import Link from "next/link";
import DealSeal from "./DealSeal";
import { useState } from "react";
import { PIECES, SHELVES, type Piece } from "@/lib/available";
import { mailto } from "@/lib/site";
import { dealPrice, money } from "@/lib/gold";

const STATUS_LABEL: Record<Piece["status"], string> = { available: "Available", sold: "Sold", coming: "Coming soon" };

function Card({ p, i, price }: { p: Piece; i: number; price?: number }) {
  const ask = mailto(`About: ${p.title}`, `Hi! I'm interested in "${p.title}" (${p.category}). Is it still available?`);
  return (
    <article className={"sh-card is-" + p.status} style={{ "--n": i } as React.CSSProperties}>
      <div className="sh-img">
        {p.image ? (
          <Link href={`/available/${p.id}`} className="sh-link"><img src={p.image} alt={p.title} loading="lazy" decoding="async" /></Link>
        ) : (
          <div className="sh-empty" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"><path d="M14 8h20l8 10-18 22L6 18z" /><path d="M6 18h36M14 8l4 10 6 22M34 8l-4 10-6 22M18 18l6-10 6 10" /></svg>
            <span>Photo soon</span>
          </div>
        )}
        {p.deal && <DealSeal deal={p.deal} />}
      </div>
      <div className="sh-body">
        <h3>{p.image ? <Link href={`/available/${p.id}`}>{p.title}</Link> : p.title}</h3>
        <p className="sh-price">{price ? (p.deal ? <><s>{money(price)}</s> {money(dealPrice(price, p.deal))}</> : money(price)) : p.status === "coming" ? "Dropping soon" : "Price on request"}</p>
        {p.status === "available" && <a className="sh-offer" href={ask}>Make an offer</a>}
        <span className={"sh-tag " + p.status}>{STATUS_LABEL[p.status]}</span>
      </div>
    </article>
  );
}

/** Category filter + shop shelves of ready-made pieces. */
export default function AvailableGallery({ prices = {} }: { prices?: Record<string, number> }) {
  const categories = ["All", ...Array.from(new Set(PIECES.map(p => p.category)))];
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? PIECES : PIECES.filter(p => p.category === filter);

  return (
    <>
      <div className="wrap av-filters" role="group" aria-label="Filter pieces">
        {categories.map(c => (
          <button key={c} type="button" aria-pressed={filter === c} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      {(Object.keys(SHELVES) as (keyof typeof SHELVES)[]).map(key => {
        const items = shown.filter(p => p.shelf === key);
        return (
          <section key={key} className={"shelf" + (key === "top" ? " dark" : "")} aria-labelledby={`shelf-${key}`}>
            <div className="wrap shelf-inner">
              <div className="shelf-head">
                <div>
                  <h2 id={`shelf-${key}`}>{SHELVES[key].title}</h2>
                  <p>{SHELVES[key].sub}</p>
                </div>
                <span className="shelf-count">{items.length} {items.length === 1 ? "piece" : "pieces"}</span>
              </div>
              {items.length ? (
                <div className="sh-grid" key={filter}>
                  {items.map((p, i) => <Card key={p.id} p={p} i={i} price={prices[p.id]} />)}
                </div>
              ) : (
                <p className="shelf-empty">Nothing in {filter.toLowerCase()} on this shelf right now.</p>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
