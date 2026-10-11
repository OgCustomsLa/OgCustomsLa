import type { Metadata } from "next";
import Link from "next/link";
import CollectionView from "@/components/CollectionView";
import { PIECES } from "@/lib/available";
import { priceList } from "@/lib/gold";
import { SITE_SALE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop — ready to ship",
  description: "One-of-a-kind OG Customs LA pieces, finished and ready to ship from Los Angeles.",
};

export const revalidate = 3600; // prices follow the gold price, checked hourly

export default async function AvailablePage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const pieces = PIECES.filter(p => p.status === "available" && p.image);
  // category links from the menu: /available?cat=Pendants
  const asked = (await searchParams).cat;
  const cat = pieces.some(p => p.category === asked) ? asked : undefined;
  const prices = await priceList(pieces);
  return (
    <div className="shop">
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><b>Shop</b></nav>
        <div className="shop-head">
          <h1>{cat ?? "Ready to ship"}</h1>
          <p>One-of-a-kind pieces, finished in our Los Angeles studio.{SITE_SALE ? <> <b>{SITE_SALE}% off everything</b> right now.</> : null}</p>
        </div>
        <CollectionView key={cat ?? "all"} pieces={pieces} prices={prices} initialCat={cat} />

        <div className="custom-banner" data-reveal>
          <div className="cb-thumbs" aria-hidden="true">
            <img src="/images/elena-sketch.jpg" alt="" loading="lazy" />
            <img src="/images/elena-3d-print.jpg" alt="" loading="lazy" />
            <img src="/images/elena-gold.jpg" alt="" loading="lazy" />
          </div>
          <div className="cb-text">
            <h2>Want something one of a kind?</h2>
            <p>Send a sketch or an idea · we design it in 3D · cast in gold or silver</p>
          </div>
          <Link href="/order" className="btn">Start a custom order</Link>
        </div>
      </div>
    </div>
  );
}
