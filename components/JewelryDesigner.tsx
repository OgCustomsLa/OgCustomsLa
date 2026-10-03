"use client";

import { useEffect, useRef, useState } from "react";
import NameDesigner, { FADE_MS } from "./NameDesigner";
import RingDesigner, { RING_DEMOS, RingSvg, preloadRingDemoFonts } from "./RingDesigner";

const STEP_MS = 3200;
const RESUME_MS = 8000; // idle this long with no name typed → the showcase starts again
// the name designer's showcase alternates pendant (even index) / earrings (odd index), 3 of each
const NAME_PAIRS = 3;

/**
 * One designer window with a Pendant | Earrings | Ring switch.
 * Until the visitor touches it, only the preview picture rotates ring → pendant → earrings → …
 * (the window and its controls stay put, so nothing jumps). If the visitor leaves it without typing a
 * name or initials, the showcase picks up again after a short idle.
 */
export default function JewelryDesigner() {
  const [mode, setMode] = useState<"pendant" | "earrings" | "ring">("pendant");
  const [auto, setAuto] = useState(true);
  const [step, setStep] = useState(0);
  const [nameIndex, setNameIndex] = useState(0);
  const stepRef = useRef(0);
  stepRef.current = step;

  useEffect(() => {
    if (!auto) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setAuto(false); return; }
    preloadRingDemoFonts();
    const t = setInterval(() => setStep(s => s + 1), STEP_MS);
    return () => clearInterval(t);
  }, [auto]);

  const slot = step % 3, round = Math.floor(step / 3);
  // which pendant / earrings sit under the ring layer. On the ring step the pendant only switches once the
  // ring has fully faded in, so the swap is never seen; the ring then fades away to reveal it.
  useEffect(() => {
    const next = (round % NAME_PAIRS) * 2 + (slot === 2 ? 1 : 0);
    if (slot !== 0) { setNameIndex(next); return; }
    const t = setTimeout(() => setNameIndex(next), FADE_MS + 50);
    return () => clearTimeout(t);
  }, [slot, round]);

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
      const field = document.querySelector<HTMLInputElement>("#np-name, #ring-initials");
      if (field && field.value.trim()) return; // they made something of their own: leave it on screen
      // pick up on a pendant (the ring comes round next); set the matching pendant in the same update,
      // so the showcase comes back with a single crossfade
      const next = (Math.floor(stepRef.current / 3) + 1) * 3 + 1;
      setStep(next); setNameIndex((Math.floor(next / 3) % NAME_PAIRS) * 2);
      setAuto(true);
    }, 1000);
    return () => { clearInterval(iv); evs.forEach(e => document.removeEventListener(e, busy, true)); };
  }, [auto]);

  if (auto) {
    const stop = (m: "pendant" | "earrings" | "ring") => { setAuto(false); setMode(m); };
    // the ring layer is always there and only fades in and out; its ring changes only on the step when it is fully hidden
    const ringIdx = (slot === 2 ? round + 1 : round) % RING_DEMOS.length;
    const ring = (
      <div className={"stage-overlay" + (slot === 0 ? " on" : "")} aria-hidden="true">
        <div className="ring-art"><RingSvg o={RING_DEMOS[ringIdx]} /></div>
      </div>
    );
    return <NameDesigner key="name" demoIndex={nameIndex} overlay={ring} onTouch={() => stop("pendant")} onRing={() => stop("ring")} />;
  }

  return mode === "ring"
    ? <RingDesigner onPick={k => setMode(k)} />
    : <NameDesigner key="name" startKind={mode} onRing={() => setMode("ring")} />;
}
