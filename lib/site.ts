export const EMAIL = "OGcustomsLA@gmail.com";

/** Code for the old 5% offer (kept for anyone who already has it). */
export const DISCOUNT_CODE = "OGLA5";

/** Site-wide sale in percent, taken off every available piece's regular (gold-based) price. 0 = no sale. */
export const SITE_SALE = 15;

/**
 * Discount wheel: each prize, its code (honour these at checkout) and how likely it is (weights add up to 100).
 * The wheel shows two slices of each prize.
 */
export const WHEEL_PRIZES = [
  { pct: 5, code: "OGLA5", weight: 40 },
  { pct: 10, code: "OGLA10", weight: 35 },
  { pct: 15, code: "OGLA15", weight: 20 },
  { pct: 20, code: "OGLA20", weight: 5 },
] as const;

/** Cut-out photos of a $100 bill, used for every bit of money on the site. */
export const BILL_FRONT = "/images/bill-100-front.png";
export const BILL_BACK = "/images/bill-100-back.png";

/** Key used to hand a design from the name designer over to the order page. */
export const DESIGN_KEY = "og-design";

export type DesignPrefill = {
  piece: string;
  name: string;
  desc: string;
  metal: string;
  stones: string;
};

export function mailto(subject: string, body: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
