"use client";

import { useEffect, useRef, useState } from "react";

/** An <ol> that gets the "in" class once it scrolls into view (used for the how-it-works chat reveal). */
export default function RevealList({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) { setInView(true); return; }
    const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: .35 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  return <ol ref={ref} className={className + (inView ? " in" : "")}>{children}</ol>;
}
