"use client";

import { useEffect, useRef, useState } from "react";
import NameDesigner from "./NameDesigner";

const STEP_MS = 3200;
const RESUME_MS = 8000; // idle this long with no name typed → the showcase starts again
const DEMO_COUNT = 6; // the name designer's showcase: pendant (even index) / earrings (odd index), 3 of each

/**
 * One designer window with a Pendant | Earrings switch.
 * Until the visitor touches it, the preview rotates through example pendants and earrings
 * (the window and its controls stay put, so nothing jumps). If the visitor leaves it without typing a
 * name or initials, the showcase picks up again after a short idle.
 */
export default function JewelryDesigner() {
  const [mode, setMode] = useState<"pendant" | "earrings">("pendant");
  const [auto, setAuto] = useState(true);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  stepRef.current = step;

  useEffect(() => {
    if (!auto) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setAuto(false); return; }
    const t = setInterval(() => setStep(s => s + 1), STEP_MS);
    return () => clearInterval(t);
  }, [auto]);

  useEffect(() => {
    if (auto || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = Date.now();
    const busy = () => { last = Date.now(); };
    const evs = ["keydown", "pointerdown", "input"] as const;
    evs.forEach(e => document.addEventListener(e, busy, true));
    const iv = setInterval(() => {
      if (Date.now() - last < RESUME_MS) return;
      const a = document.activeElement;
      if (a instanceof HTMLInputElement || a instanceof HTMLTextAreaElement) return;
      const field = document.querySelector<HTMLInputElement>("#np-name");
      if (field && field.value.trim()) return; // they made something of their own: leave it on screen
      setStep(s => s + 1); // pick up on the next example, with a single crossfade
      setAuto(true);
    }, 1000);
    return () => { clearInterval(iv); evs.forEach(e => document.removeEventListener(e, busy, true)); };
  }, [auto]);

  if (auto) {
    return <NameDesigner key="name" demoIndex={step % DEMO_COUNT} onTouch={() => { setAuto(false); setMode("pendant"); }} />;
  }

  return <NameDesigner key="name" startKind={mode} />;
}
