/*
 * Prices for available pieces, worked out from the live gold price:
 *   price = grams × (gold $ per troy ounce ÷ 31.1035) × karat purity × MARKUP  (+ DIAMOND_FEE with diamonds)
 * The gold price is fetched at most once an hour. To change the margin, change MARKUP.
 */
import type { Piece } from "./available";

export const MARKUP = 1.2; // 20% on top of the gold value
export const DIAMOND_FEE = 200; // added to pieces set with diamonds

const GRAMS_PER_OZ = 31.1034768;
const PURITY: Record<number, number> = { 10: 0.417, 14: 0.585, 18: 0.75, 24: 0.999 };
const FALLBACK_USD_PER_OZ = 4100; // used only if the live price can't be fetched

/** Live gold price in US dollars per troy ounce (refreshed hourly). */
export async function goldUsdPerOz(): Promise<number> {
  try {
    const res = await fetch("https://api.gold-api.com/price/XAU", { next: { revalidate: 3600 } });
    const data = await res.json();
    if (typeof data?.price === "number" && data.price > 500) return data.price;
  } catch {}
  return FALLBACK_USD_PER_OZ;
}

/** Price of a piece in whole dollars: a set price wins, otherwise grams × gold value + MARKUP, plus DIAMOND_FEE with diamonds. */
export function piecePrice(p: Piece, usdPerOz: number): number | undefined {
  if (p.price) return p.price;
  if (!p.grams) return undefined;
  const perGram = (usdPerOz / GRAMS_PER_OZ) * (PURITY[p.karat ?? 14] ?? PURITY[14]);
  return Math.round(p.grams * perGram * MARKUP) + (p.diamonds ? DIAMOND_FEE : 0);
}

/** Price after the piece's deal (if any). */
export const dealPrice = (price: number, deal?: number) => (deal ? Math.round(price * (1 - deal / 100)) : price);

export const money = (n: number) => "$" + n.toLocaleString("en-US");

/** Prices for every piece, keyed by id, for client components. */
export async function priceList(pieces: Piece[]): Promise<Record<string, number>> {
  const usd = await goldUsdPerOz();
  const out: Record<string, number> = {};
  for (const p of pieces) { const v = piecePrice(p, usd); if (v) out[p.id] = v; }
  return out;
}
