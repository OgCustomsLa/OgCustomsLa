import type { Metadata } from "next";
import Link from "next/link";
import AvailableGallery from "@/components/AvailableGallery";
import { PIECES } from "@/lib/available";
import { priceList } from "@/lib/gold";

export const metadata: Metadata = {
  title: "Available now",
  description: "One-of-a-kind OG Customs LA pieces, finished and ready to ship from Los Angeles.",
};

const TRUST = [
  ["Made in", "Los Angeles"],
  ["Designed in 3D", "approved before casting"],
  ["Ships worldwide", "or pick up in LA"],
  ["Free quote", "on any custom piece"],
];

export const revalidate = 3600; // prices follow the gold price, checked hourly

export default async function AvailablePage() {
  const prices = await priceList(PIECES);
  return (
    <div className="av">
      <div className="wrap">
        <div className="av-hero" data-reveal>
          <p className="label"><span className="live-dot" aria-hidden="true" />Ready to wear</p>
          <h1 className="op-title">Available <span className="g">now</span></h1>
          <p className="av-sub">One-of-a-kind pieces, finished and polished in our Los Angeles studio. When it&apos;s gone, it&apos;s gone.</p>
        </div>
      </div>

      <AvailableGallery prices={prices} />

      <div className="wrap">
        <div className="custom-banner" data-reveal>
          <div className="cb-thumbs" aria-hidden="true">
            <img src="/images/elena-sketch.jpg" alt="" loading="lazy" />
            <img src="/images/elena-3d-print.jpg" alt="" loading="lazy" />
            <img src="/images/elena-gold.jpg" alt="" loading="lazy" />
          </div>
          <div className="cb-text">
            <h2>Start your custom piece</h2>
            <p>Sketch · 3D design · cast in gold or silver</p>
          </div>
          <Link href="/order" className="btn">Start project</Link>
        </div>
      </div>

      <div className="trust-bar" aria-label="Why OG Customs LA">
        <div className="wrap">
          {TRUST.map(([b, s]) => <p key={b}><b>{b}</b> {s}</p>)}
        </div>
      </div>
    </div>
  );
}
