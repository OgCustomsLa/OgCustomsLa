"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Piece } from "@/lib/available";
import { DESIGN_KEY, mailto, type DesignPrefill } from "@/lib/site";
import { PayBadges } from "./Trust";

const METALS: [string, string][] = [
  ["Yellow gold", "linear-gradient(#F6E3A6,#A9822F)"],
  ["White gold", "linear-gradient(#fff,#B9BDBF)"],
  ["Rose gold", "linear-gradient(#F9D9C9,#A86C55)"],
  ["Sterling silver", "linear-gradient(#fff,#8E9294)"],
];
const RING_SIZES = ["5", "6", "7", "8", "9", "10", "11", "12", "13"];

/** One available piece: photo gallery, details, choices, order / offer buttons and how to pay (laid out like a jewelry shop product page). */
export default function PieceView({ p, others }: { p: Piece; others: Piece[] }) {
  const router = useRouter();
  const photos = [p.image!, ...(p.more ?? [])];
  const [shot, setShot] = useState(0);
  const [metal, setMetal] = useState(p.metal ?? "Yellow gold");
  const ring = p.category === "Rings";
  const [size, setSize] = useState("");
  const [needSize, setNeedSize] = useState(false);
  const [open, setOpen] = useState<string>("desc");
  const kind = p.category.replace(/s$/, "");
  const price = p.price ? "$" + p.price.toLocaleString("en-US") : "Price on request";
  const ask = mailto(`About: ${p.title}`, `Hi! I'm interested in "${p.title}" (${kind}, ${metal}${size ? `, size ${size}` : ""}). Is it still available, and what's the price?`);

  function order() {
    if (ring && !size) { setNeedSize(true); return; }
    const prefill: DesignPrefill = {
      piece: kind,
      name: "",
      desc: `Available piece: ${p.title} in ${metal.toLowerCase()}${ring ? `, ring size ${size}` : ""}.`,
      metal,
      stones: p.stones && p.stones !== "None" ? "Not sure — advise me" : "No stones",
    };
    try { sessionStorage.setItem(DESIGN_KEY, JSON.stringify(prefill)); } catch {}
    router.push("/order");
  }

  const section = (id: string, title: string, body: React.ReactNode) => (
    <div className={"pv-acc" + (open === id ? " open" : "")}>
      <button type="button" aria-expanded={open === id} onClick={() => setOpen(open === id ? "" : id)}>{title}<span aria-hidden="true">{open === id ? "−" : "+"}</span></button>
      {open === id && <div className="pv-acc-body">{body}</div>}
    </div>
  );

  return (
    <div className="pv">
      <div className="wrap">
        <nav className="pv-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span><Link href="/available">Available now</Link><span>/</span><b>{p.title}</b>
        </nav>

        <div className="pv-grid">
          <div className="pv-gallery">
            <div className="pv-main">
              {photos.map((src, k) => (
                <img key={src} src={src} alt={k === shot ? `${p.title}${k ? ` (view ${k + 1})` : ""}` : ""} aria-hidden={k !== shot} className={k === shot ? "on" : ""} decoding="async" />
              ))}
              <span className={"pv-badge " + p.status}>{p.status === "available" ? "Available" : p.status === "sold" ? "Sold" : "Coming soon"}</span>
            </div>
            {photos.length > 1 && (
              <div className="pv-thumbs" role="group" aria-label="Photos">
                {photos.map((src, k) => (
                  <button key={src} type="button" aria-pressed={k === shot} aria-label={`Photo ${k + 1}`} onClick={() => setShot(k)}><img src={src} alt="" /></button>
                ))}
              </div>
            )}
          </div>

          <div className="pv-info">
            <p className="label">{kind} · One of one</p>
            <h1 className="pv-title">{p.title}</h1>
            <p className="pv-price">{price}</p>
            <p className="pv-bnpl">
              Pay in 4 interest-free payments with <b className="kl">Klarna</b>, <b className="af">Affirm</b> or <b className="ap">Afterpay</b>
            </p>
            {p.description && <p className="pv-desc">{p.description}</p>}

            <div className="pv-opt">
              <p className="pv-opt-h">Metal <span>{metal}</span></p>
              <div className="pv-metals" role="group" aria-label="Metal">
                {METALS.map(([m, bg]) => (
                  <button key={m} type="button" aria-pressed={metal === m} onClick={() => setMetal(m)} title={m}><i style={{ background: bg }} /><span>{m}</span></button>
                ))}
              </div>
              {metal !== (p.metal ?? "Yellow gold") && <p className="pv-note">Shown in {p.metal?.toLowerCase()}. In {metal.toLowerCase()} it&apos;s made to order.</p>}
            </div>

            {ring && (
              <div className="pv-opt">
                <p className="pv-opt-h">Ring size <Link href="/#sizes">Size guide</Link></p>
                <div className={"pv-sizes" + (needSize ? " need" : "")} role="group" aria-label="Ring size">
                  {RING_SIZES.map(s => (
                    <button key={s} type="button" aria-pressed={size === s} onClick={() => { setSize(s); setNeedSize(false); }}>{s}</button>
                  ))}
                </div>
                {needSize && <p className="pv-note warn" role="alert">Pick your ring size first.</p>}
              </div>
            )}

            <div className="pv-actions">
              <button type="button" className="btn pv-buy" onClick={order} disabled={p.status !== "available"}>
                {p.status === "available" ? "Order this piece" : "Sold"}
              </button>
              <a className="btn ghost" href={ask}>Make an offer</a>
            </div>

            <div className="pv-pay">
              <p><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></svg>Secure payments · pay in full or over time</p>
              <PayBadges />
            </div>

            <div className="pv-accs">
              {section("desc", "Details", (
                <dl className="pv-dl">
                  <dt>Piece</dt><dd>{kind}</dd>
                  <dt>Metal</dt><dd>{p.metal ?? "Yellow gold"}</dd>
                  {p.stones && <><dt>Stones</dt><dd>{p.stones}</dd></>}
                  <dt>Made in</dt><dd>Los Angeles, designed in 3D and finished by hand</dd>
                </dl>
              ))}
              {section("pay", "Payment & ordering", (
                <p>Tap &ldquo;Order this piece&rdquo; and we&apos;ll confirm the price and send a secure payment link. Pay by card, Apple Pay, Google Pay, PayPal, Zelle or Cash App, or split it over time with Klarna, Affirm or Afterpay.</p>
              ))}
              {section("custom", "Want it different?", (
                <p>Change the metal, size, stones or details: every piece can be remade your way. <Link href="/order">Start a custom order</Link>.</p>
              ))}
            </div>
          </div>
        </div>

        {others.length > 0 && (
          <section className="pv-more" aria-label="More available pieces">
            <h2 className="pv-more-h">You may also like</h2>
            <ul>
              {others.map(o => (
                <li key={o.id}>
                  <Link href={`/available/${o.id}`} className="aw-tile">
                    <span className="aw-pic"><img src={o.image} alt={o.title} loading="lazy" decoding="async" /></span>
                    <span className="aw-name">{o.title}</span>
                    <span className="aw-meta">{o.price ? "$" + o.price.toLocaleString("en-US") : "Price on request"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
