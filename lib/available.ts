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
};

export const SHELVES = {
  new: { title: "New drops", sub: "Fresh off the bench in Los Angeles — finished, polished and ready to ship." },
  top: { title: "Top shelf: heavy gold & iced out", sub: "Statement chains, iced pendants and grillz. One of each, made by hand." },
} as const;

// Real pieces first, then placeholders until more photos arrive.
const REAL: Piece[] = [
  { id: "angel-ak", title: "Masked Angel Pendant", category: "Pendants", shelf: "new", image: "/images/available/angel-ak-pendant.jpg", status: "available" },
  { id: "three-angels", title: "Three Wise Angels Pendant", category: "Pendants", shelf: "new", image: "/images/available/three-angels-pendant.jpg", status: "available" },
  { id: "drama-masks", title: "Laugh Now Cry Later Masks Pendant", category: "Pendants", shelf: "new", image: "/images/available/drama-masks-pendant.jpg", status: "available" },
];
const CATS: Category[] = ["Rings", "Chains", "Earrings"];
export const PIECES: Piece[] = [
  ...REAL,
  ...CATS.map((category, i): Piece => ({ id: `new-${i}`, title: `New ${category.toLowerCase().replace(/s$/, "")} drop`, category, shelf: "new", status: "coming" })),
  ...["Chains", "Pendants", "Grillz", "Chains", "Rings", "Bracelets"].map((category, i): Piece => ({ id: `top-${i}`, title: "Top shelf piece", category: category as Category, shelf: "top", status: "coming" })),
];
