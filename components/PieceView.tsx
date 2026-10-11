"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Piece } from "@/lib/available";
import { DESIGN_KEY, mailto, type DesignPrefill } from "@/lib/site";
import { PayBadges } from "./Trust";
import { dealPrice, money, offPct, onSale } from "@/lib/gold";

const METALS: [string, string][] = [
  ["Yellow gold", "linear-gradient(#F6E3A6,#A9822F)"],
  ["White gold", "linear-gradient(#fff,#B9BDBF)"],
  ["Rose gold", "linear-gradient(#F9D9C9,#A86C55)"],
];
const RING_SIZES = ["5", "6", "7", "8", "9", "10", "11", "12", "13"];

/** Product page: gallery, sale price, Klarna line, metal / ring size, Buy now, perks, payments, description and specs. */
export default function PieceView({ p, price: base }: { p: Piece; price?: number }) {
  const router = useRouter();
  const photos = [p.image!, ...(p.more ?? [])];
  const [shot, setShot] = useState(0);
  const shownMetal = p.metal ?? "Yellow gold";
  const [metal, setMetal] = useState(shownMetal);
  const ring = p.category === "Rings";
  const [size, setSize] = useState("");
  const [needSize, setNeedSize] = useState(false);
  const sale = base && onSale(p.deal) ? dealPrice(base, p.deal) : base;
  const ask = mailto(`About: ${p.title}`, `Hi! I'm interested in "${p.title}" (${metal}${size ? `, size ${size}` : ""}). Is it still available?`);

  function buy() {
    if (ring && !size) { setNeedSize(true); return; }
    const prefill: DesignPrefill = {
      piece: p.category.replace(/s$/, ""),
      name: "",
      desc: `Available piece: ${p.title} in ${metal.toLowerCase()}${ring ? `, ring size ${size}` : ""}${sale ? ` (${money(sale)})` : ""}.`,
      metal,
      stones: p.diamonds ? "Not sure — advise me" : "No stones",
    };
    try { sessionStorage.setItem(DESIGN_KEY, JSON.stringify(prefill)); } catch {}
    router.push("/order");
  }

  return (
    <div className="pv">
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/available">Shop</Link><span>/</span><b>{p.title}</b></nav>
        <div className="pv-grid">
          <div className={"pv-gallery" + (photos.length > 1 ? " multi" : "")}>
            {photos.length > 1 && (
              <div className="pv-thumbs" role="group" aria-label="Photos">
                {photos.map((src, k) => (
                  <button key={src} type="button" aria-pressed={k === shot} aria-label={`Photo ${k + 1}`} onClick={() => setShot(k)}><img src={src} alt="" /></button>
                ))}
              </div>
            )}
            <div className="pv-main">
              {photos.map((src, k) => (
                <img key={src} src={src} alt={k === shot ? p.title : ""} aria-hidden={k !== shot} className={k === shot ? "on" : ""} decoding="async" />
              ))}
              {base && onSale(p.deal) && <span className="pc-off big">{offPct(p.deal)}% OFF</span>}
            </div>
          </div>

          <div className="pv-info">
            <h1 className="pv-title">{p.title}</h1>
            <div className="pv-pricebox">
              {sale ? (
                <>
                  <p className="pv-now">{money(sale)}</p>
                  {base !== sale && <><s className="pv-was">{money(base!)}</s><span className="pv-badge">Save {money(base! - sale)}</span></>}
                </>
              ) : <p className="pv-now">Price on request</p>}
            </div>
            {sale && <p className="pv-klarna">or 4 interest-free payments of <b>{money(Math.ceil(sale / 4))}</b> with <span>Klarna.</span></p>}

            <div className="pv-opt">
              <p className="pv-opt-h">Metal: <b>{metal}</b></p>
              <div className="pv-chips" role="group" aria-label="Metal">
                {METALS.map(([m, bg]) => (
                  <button key={m} type="button" aria-pressed={metal === m} onClick={() => setMetal(m)}><i style={{ background: bg }} />{m}</button>
                ))}
              </div>
              {metal !== shownMetal && <p className="pv-note">Shown in {shownMetal.toLowerCase()}; in {metal.toLowerCase()} it&apos;s made to order.</p>}
            </div>

            {ring && (
              <div className="pv-opt">
                <p className="pv-opt-h">Ring size: <b>{size || "choose"}</b> <Link href="/#sizes">Size guide</Link></p>
                <div className={"pv-chips sizes" + (needSize ? " need" : "")} role="group" aria-label="Ring size">
                  {RING_SIZES.map(s => (
                    <button key={s} type="button" aria-pressed={size === s} onClick={() => { setSize(s); setNeedSize(false); }}>{s}</button>
                  ))}
                </div>
                {needSize && <p className="pv-note warn" role="alert">Please choose your ring size.</p>}
              </div>
            )}

            <button type="button" className="btn pv-buy" onClick={buy} disabled={p.status !== "available"}>{p.status === "available" ? "Buy now" : "Sold out"}</button>
            <a className="pv-ask" href={ask}>Ask about this piece</a>

            <ul className="pv-perks">
              <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></svg>Handmade in Los Angeles</li>
              <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></svg>Designed in 3D</li>
              <li><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></svg>Secure payments</li>
            </ul>

            <div className="pv-pay"><PayBadges /></div>

            {p.description && (
              <section className="pv-sec">
                <h2>Description</h2>
                <p>{p.description}</p>
              </section>
            )}
            {p.specs && (
              <section className="pv-sec">
                <h2>Specifications</h2>
                <dl className="pv-spec">
                  {p.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                </dl>
                <p className="pv-small">Example piece: we can make it in any metal, karat, size or weight.{base && !p.price ? ` Price follows today's ${p.karat ?? 14}K gold price.` : ""}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
