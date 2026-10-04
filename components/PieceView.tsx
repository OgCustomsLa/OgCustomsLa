"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Piece } from "@/lib/available";
import { DESIGN_KEY, type DesignPrefill } from "@/lib/site";
import DealSeal from "./DealSeal";
import { PayBadges } from "./Trust";

/** One available piece, marketplace style: photo, name, price, buy button and the ways to pay. */
export default function PieceView({ p }: { p: Piece }) {
  const router = useRouter();
  const photos = [p.image!, ...(p.more ?? [])];
  const [shot, setShot] = useState(0);
  const price = p.price ? "$" + p.price.toLocaleString("en-US") : "Price on request";

  function buy() {
    const prefill: DesignPrefill = {
      piece: p.category.replace(/s$/, ""),
      name: "",
      desc: `Available piece: ${p.title}.`,
      metal: p.metal ?? "Yellow gold",
      stones: p.stones && p.stones !== "None" ? "Not sure — advise me" : "No stones",
    };
    try { sessionStorage.setItem(DESIGN_KEY, JSON.stringify(prefill)); } catch {}
    router.push("/order");
  }

  return (
    <div className="pv">
      <div className="wrap">
        <Link href="/available" className="pv-back">← Back to available</Link>
        <div className="pv-grid">
          <div className="pv-gallery">
            <div className="pv-main">
              {photos.map((src, k) => (
                <img key={src} src={src} alt={k === shot ? p.title : ""} aria-hidden={k !== shot} className={k === shot ? "on" : ""} decoding="async" />
              ))}
              {p.deal && <DealSeal deal={p.deal} big />}
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
            <h1 className="pv-title">{p.title}</h1>
            <p className="pv-price">{price}</p>
            <button type="button" className="btn pv-buy" onClick={buy} disabled={p.status !== "available"}>
              {p.status === "available" ? "Buy now" : "Sold"}
            </button>
            <div className="pv-pay">
              <p>We accept</p>
              <PayBadges />
            </div>
            {p.specs && (
              <div className="pv-specs">
                <dl>
                  {p.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                </dl>
                <p>Example piece: we can make it in any metal, karat, size or weight.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
