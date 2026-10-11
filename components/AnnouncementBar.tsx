"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE_SALE, WHEEL_PRIZES } from "@/lib/site";

const TOP = Math.max(...WHEEL_PRIZES.map(p => p.pct));

/** Thin bar above the header: short offers that take turns (all side by side on wide screens). */
export default function AnnouncementBar() {
  const [i, setI] = useState(0);
  const items = [
    <button key="wheel" type="button" onClick={() => window.dispatchEvent(new Event("og-open-wheel"))}>🎁 Spin the wheel — win up to <b>{TOP}% off</b></button>,
    ...(SITE_SALE ? [<Link key="sale" href="/available"><b>{SITE_SALE}% off everything</b> · ready to ship</Link>] : []),
    <span key="la">Handmade in Los Angeles · Ships worldwide</span>,
  ];

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI(n => (n + 1) % items.length), 3800);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div className="announce" role="region" aria-label="Offers">
      <ul>
        {items.map((it, k) => <li key={k} className={k === i ? "on" : ""}>{it}</li>)}
      </ul>
    </div>
  );
}
