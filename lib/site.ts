export const EMAIL = "OGcustomsLA@gmail.com";

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
