"use client";

import { useEffect, useRef, useState } from "react";

// sketch -> print -> gold, looping
export default function Morph() {
  const l2 = useRef<HTMLImageElement>(null);
  const l3 = useRef<HTMLImageElement>(null);
  const hd = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const a = l2.current!, b = l3.current!, h = hd.current!;
    const wipe = (el: HTMLElement, p: number) => { el.style.clipPath = `inset(0 ${100 - p * 100}% 0 0)`; };
    const ease = (p: number) => (1 - Math.cos(p * Math.PI)) / 2;

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let s = 0;
      const show = () => { wipe(a, s >= 1 ? 1 : 0); wipe(b, s >= 2 ? 1 : 0); h.style.opacity = "0"; setStep(s); s = (s + 1) % 3; };
      show();
      const id = setInterval(show, 2500);
      return () => clearInterval(id);
    }

    // timeline (ms): hold sketch, wipe to print, hold, wipe to gold, hold, fade back
    const T: [number, string][] = [[1200, "hold0"], [1400, "w1"], [1300, "hold1"], [1400, "w2"], [1800, "hold2"], [600, "reset"]];
    const total = T.reduce((acc, t) => acc + t[0], 0);
    let start: number | null = null, raf = 0;
    function frame(t: number) {
      start = start ?? t; let x = (t - start) % total;
      for (const [d, k] of T) {
        if (x < d) {
          const p = ease(x / d);
          if (k === "hold0") { wipe(a, 0); wipe(b, 0); a.style.opacity = b.style.opacity = "1"; h.style.opacity = "0"; setStep(0); }
          if (k === "w1") { wipe(a, p); wipe(b, 0); h.style.opacity = "1"; h.style.left = p * 100 + "%"; setStep(p < .5 ? 0 : 1); }
          if (k === "hold1") { wipe(a, 1); h.style.opacity = "0"; setStep(1); }
          if (k === "w2") { wipe(b, p); h.style.opacity = "1"; h.style.left = p * 100 + "%"; setStep(p < .5 ? 1 : 2); }
          if (k === "hold2") { wipe(b, 1); h.style.opacity = "0"; setStep(2); }
          if (k === "reset") { a.style.opacity = b.style.opacity = String(1 - p); h.style.opacity = "0"; if (p > .5) setStep(0); }
          break;
        }
        x -= d;
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const steps: [string, string, React.ReactNode][] = [
    ["Sketch", "Your idea on paper", <path key="p" d="M5 19l1.2-4.2L15.5 5.5a2 2 0 0 1 2.9 0l.1.1a2 2 0 0 1 0 2.9L9.2 17.8z M13.5 7.5l3 3" />],
    ["3D print", "Modeled and printed", <path key="c" d="M12 3l8 4.5v9L12 21l-8-4.5v-9z M4 7.5l8 4.5 8-4.5 M12 12v9" />],
    ["Gold", "Cast and polished", <path key="d" d="M7 4h10l4 5-9 11L3 9z M3 9h18 M9 4l-1.5 5L12 20l4.5-11L15 4" />],
  ];

  return (
    <div className="morph-wrap">
      <div className="morph">
        <img src="/images/elena-anim-sketch.jpg" alt="Elena pendant as a colored pencil sketch" />
        <img ref={l2} className="l2" src="/images/elena-anim-3d-print.jpg" alt="Elena pendant as a blue 3D printed model" />
        <img ref={l3} className="l3" src="/images/elena-anim-gold.jpg" alt="Elena pendant finished in gold" />
        <div ref={hd} className="handle" aria-hidden="true"></div>
      </div>
      <div className="morph-side">
        <p className="opt-label">From sketch to gold</p>
        <ol className="morph-steps" style={{ "--fill": step / (steps.length - 1) } as React.CSSProperties}>
          {steps.map(([b, s, icon], i) => (
            <li key={b} className={i === step ? "on" : i < step ? "done" : undefined}>
              <span className="ms-dot" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
              </span>
              <span className="ms-text"><b>{b}</b><span>{s}</span></span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
