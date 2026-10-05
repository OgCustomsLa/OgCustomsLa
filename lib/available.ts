/*
 * Ready-made pieces shown on /available, grouped into shelves.
 * To add a piece: put its photo in public/images/available/ and add an entry below
 * (image: "/images/available/your-photo.jpg", price in dollars). Set status to "sold" to keep
 * it on the shelf with a "Sold" tag.
 */

export type PieceStatus = "available" | "sold" | "coming";
export type Category = "Pendants" | "Rings" | "Chains" | "Earrings" | "Bracelets" | "Grillz";

export type Piece = {
  id: string;
  title: string;
  category: Category;
  shelf: "new" | "top";
  price?: number; // leave out for "Price on request"
  image?: string;
  status: PieceStatus;
  /** extra photos shown on the piece's own page (the main image comes first) */
  more?: string[];
  description?: string;
  metal?: string;
  stones?: string;
  /** spec table on the piece page, e.g. ["Metal", "14K yellow gold"]; example values, every piece can be made to order */
  specs?: [string, string][];
  /** percent off, shown as a seal on the photo wherever the piece appears */
  deal?: number;
  /** gold weight and karat: the price is worked out from these and the live gold price (see lib/gold.ts) */
  grams?: number;
  karat?: 10 | 14 | 18;
};

export const SHELVES = {
  new: { title: "New drops", sub: "Fresh off the bench in Los Angeles — finished, polished and ready to ship." },
  top: { title: "Top shelf: heavy gold & iced out", sub: "Statement chains, iced pendants and grillz. One of each, made by hand." },
} as const;

// Real pieces first, then placeholders until more photos arrive.
const REAL: Piece[] = [
  { id: "angel-ak", title: "Masked Angel Pendant", category: "Pendants", shelf: "new", image: "/images/available/angel-ak-pendant.jpg", grams: 6, karat: 14, status: "available",
    metal: "Yellow gold", stones: "1 diamond in the mask",
    specs: [["Metal","14K yellow gold"],["Weight","≈ 6 g"],["Size","2.0 × 1.4 in"],["Stones","1 round diamond in the mask"],["Bail","Fits chains up to 6 mm"],["Finish","High polish, hand detailed"]],
    description: "A street-saint cherub in a bandana, gripping a rifle and floating on carved wings. Sculpted in deep 3D relief from the curls to the toes and cast in solid yellow gold, with a single diamond set in the mask." },
  { id: "three-angels", title: "Three Wise Angels Pendant", category: "Pendants", shelf: "new", image: "/images/available/three-angels-pendant.jpg", grams: 5, karat: 14, status: "available",
    more: ["/images/available/three-angels-pendant-side.jpg"], metal: "Yellow gold", stones: "None",
    specs: [["Metal","14K yellow gold"],["Weight","≈ 5 g"],["Size","1.9 × 0.6 in"],["Stones","None"],["Bail","Fits chains up to 4 mm"],["Finish","High polish, full 3D relief"]],
    description: "See no evil, hear no evil, speak no evil. Three cherubs stacked into one tall pendant, each with its own wings and curls, sculpted in full relief and polished in yellow gold." },
  { id: "drama-masks", title: "Laugh Now Cry Later Masks Pendant", category: "Pendants", shelf: "new", image: "/images/available/drama-masks-pendant.jpg", grams: 4, karat: 14, status: "available", deal: 10,
    metal: "Yellow gold", stones: "None",
    specs: [["Metal","14K yellow gold"],["Weight","≈ 4 g"],["Size","1.3 × 1.5 in"],["Stones","None"],["Bail","Fits chains up to 5 mm"],["Finish","High polish, sunburst engraving"]],
    description: "Laugh now, cry later. Comedy and tragedy masks split down the middle, with sunburst engraving, cut-out eyes, a grill-tooth grin and a heavy bail on top. Polished yellow gold." },
  { id: "iced-initial", title: "Iced Script Initial Pendant", category: "Pendants", shelf: "new", image: "/images/available/iced-initial-pendant.jpg", grams: 4, karat: 14, status: "available",
    more: ["/images/available/iced-initial-pendant-tall.jpg"], metal: "Yellow gold", stones: "Pavé-set throughout",
    specs: [["Metal","14K yellow gold"],["Weight","≈ 4 g"],["Size","1.4 × 1.1 in"],["Stones","≈ 1.5 ctw pavé"],["Bail","Iced, fits chains up to 5 mm"],["Finish","Pavé set by hand"]],
    description: "A bold script initial, fully iced with pavé-set stones in layered rows and outlined in yellow gold, finished with an iced bail to match." },
  { id: "royal-flush", title: "Royal Flush Ring", category: "Rings", shelf: "new", image: "/images/available/royal-flush-ring.jpg", grams: 5, karat: 14, status: "available",
    more: ["/images/available/royal-flush-ring-side.jpg"], metal: "Yellow gold", stones: "Red stones along both edges",
    specs: [["Metal","14K yellow gold"],["Weight","≈ 5 g"],["Ring size","5 – 13"],["Stones","Red stones along both edges"],["Details","Enamel cards, beaded band"],["Finish","High polish"]],
    description: "A fanned hand of enamel cards — A, K, Q, J and 10 — set across a beaded yellow gold band, with a row of red stones running along each edge." },
  { id: "tiger", title: "Roaring Tiger Pendant", category: "Pendants", shelf: "new", image: "/images/available/tiger-pendant.jpg", grams: 7, karat: 14, status: "available",
    metal: "White gold", stones: "Green stone eyes, iced bail",
    specs: [["Metal","14K white gold"],["Weight","≈ 7 g"],["Size","1.8 × 1.3 in"],["Stones","Green stone eyes, pavé bail"],["Bail","Iced, fits chains up to 6 mm"],["Finish","High polish, hand detailed"]],
    description: "A roaring tiger head in polished white gold, every whisker and fang carved in detail, with green stone eyes and a pavé-iced bail." },
  { id: "lion-crown", title: "Crowned Lion Pendant", category: "Pendants", shelf: "new", image: "/images/available/lion-crown-pendant.jpg", grams: 8, karat: 14, status: "available",
    metal: "Yellow gold", stones: "Pavé crown, diamond eyes",
    specs: [["Metal","14K yellow gold"],["Weight","≈ 8 g"],["Size","2.0 × 1.4 in"],["Stones","Pavé crown, diamond eyes"],["Bail","Fits chains up to 6 mm"],["Finish","High polish, hand detailed"]],
    description: "A roaring lion in polished yellow gold wearing an iced pavé crown, with diamond eyes, a carved mane and a heavy bail." },
];
const CATS: Category[] = ["Chains", "Earrings"];
export const PIECES: Piece[] = [
  ...REAL,
  ...CATS.map((category, i): Piece => ({ id: `new-${i}`, title: `New ${category.toLowerCase().replace(/s$/, "")} drop`, category, shelf: "new", status: "coming" })),
  ...["Chains", "Pendants", "Grillz", "Chains", "Rings", "Bracelets"].map((category, i): Piece => ({ id: `top-${i}`, title: "Top shelf piece", category: category as Category, shelf: "top", status: "coming" })),
];
