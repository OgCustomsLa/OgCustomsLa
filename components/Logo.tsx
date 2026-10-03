"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** The gold-and-emerald LA emblem. */
export function BrandMark({ className = "brand-mark" }: { className?: string }) {
  // wrapper carries the size and the animated light sweep (masked to the emblem shape)
  return (
    <span className={"mark " + className} aria-hidden="true">
      <img src="/images/logo-la-160.png" alt="" width={160} height={160} decoding="async" />
    </span>
  );
}

/**
 * Brand mark: the LA emblem plus the OG CUSTOMS wordmark.
 * Works as a toggle: on the home page it opens About us, anywhere else it goes back home.
 */
export default function Logo() {
  const home = usePathname() === "/";
  return (
    <Link href={home ? "/about" : "/"} className="brand" aria-label={home ? "OG Customs LA — about us" : "OG Customs LA — home"}>
      <BrandMark />
      <span className="brand-text">
        <span className="brand-name">OG Customs</span>
        <span className="brand-sub">3D Jewelry Studio · Los Angeles</span>
      </span>
    </Link>
  );
}
