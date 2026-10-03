"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Scroll animations.
 * - data-reveal on an element: it animates in when scrolled into view. Value picks the motion:
 *   "" (rise), "left", "right" or "zoom".
 * - data-stagger on a container: each child animates in turn. Value is the motion for the
 *   children; "alt" alternates left / right.
 * Everything stays visible without JavaScript or with reduced motion: the hiding style only
 * applies once <html> has the "reveal-on" class, and anything already on screen is shown first.
 */
export default function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach(box => {
      const motion = box.dataset.stagger ?? "";
      Array.from(box.children).forEach((child, i) => {
        const el = child as HTMLElement;
        if (el.hasAttribute("data-reveal")) return;
        el.dataset.reveal = motion === "alt" ? (i % 2 ? "right" : "left") : motion;
        el.style.setProperty("--rd", String(i % 6));
      });
    });

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    const vh = window.innerHeight;
    els.forEach(el => { if (el.getBoundingClientRect().top < vh * 0.9) el.classList.add("is-in"); });
    document.documentElement.classList.add("reveal-on");

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    els.forEach(el => { if (!el.classList.contains("is-in")) io.observe(el); });
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
