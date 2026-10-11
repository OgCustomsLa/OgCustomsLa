import Link from "next/link";
import type { Piece } from "@/lib/available";
import { dealPrice, money, offPct, onSale } from "@/lib/gold";

/** Shop card: photo (second view on hover), % OFF badge, name, sale price with the regular price crossed out. */
export default function ProductCard({ p, price }: { p: Piece; price?: number }) {
  const alt = p.more?.[0];
  const sale = price && onSale(p.deal);
  return (
    <Link href={`/available/${p.id}`} className="pc">
      <span className={"pc-pic" + (alt ? " has-alt" : "")}>
        <img src={p.image} alt={p.title} loading="lazy" decoding="async" />
        {alt && <img className="pc-alt" src={alt} alt="" aria-hidden="true" loading="lazy" decoding="async" />}
        {sale && <span className="pc-off">{offPct(p.deal)}% OFF</span>}
        {p.diamonds && <span className="pc-tag">Diamonds</span>}
      </span>
      <span className="pc-body">
        <span className="pc-name">{p.title}</span>
        <span className="pc-price">
          {price ? (sale ? <><b>{money(dealPrice(price, p.deal))}</b> <s>{money(price)}</s></> : <b>{money(price)}</b>) : <b>Price on request</b>}
        </span>
        <span className="pc-meta">{p.karat ?? 14}K {p.metal?.toLowerCase() ?? "gold"}{p.grams ? ` · ${p.grams} g` : ""}</span>
      </span>
    </Link>
  );
}
