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

// Placeholder pieces until the real photos arrive.
const CATS: Category[] = ["Pendants", "Rings", "Chains", "Earrings", "Bracelets", "Grillz"];
export const PIECES: Piece[] = [
  ...CATS.map((category, i): Piece => ({ id: `new-${i}`, title: `New ${category.toLowerCase().replace(/s$/, "")} drop`, category, shelf: "new", status: "coming" })),
  ...["Chains", "Pendants", "Grillz", "Chains", "Rings", "Bracelets"].map((category, i): Piece => ({ id: `top-${i}`, title: "Top shelf piece", category: category as Category, shelf: "top", status: "coming" })),
];
