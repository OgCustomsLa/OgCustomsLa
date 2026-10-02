"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Fades elements marked with data-reveal up into place as they scroll into view.
 * Everything stays visible without JavaScript or with reduced motion: the hiding style only
 * applies once <html> has the "reveal-on" class, and anything already on screen is marked
 * visible first so nothing flickers.
 */
export default function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    const vh = window.innerHeight;
    els.forEach(el => { if (el.getBoundingClientRect().top < vh) el.classList.add("is-in"); });
    document.documentElement.classList.add("reveal-on");

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(el => { if (!el.classList.contains("is-in")) io.observe(el); });
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
