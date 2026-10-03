"use client";

import { useEffect, useState } from "react";
import NameDesigner from "./NameDesigner";
import RingDesigner, { RING_DEMOS, RingSvg } from "./RingDesigner";

const STEP_MS = 3200;
// the name designer's showcase alternates pendant (even index) / earrings (odd index), 3 of each
const NAME_PAIRS = 3;

/**
 * One designer window with a Pendant | Earrings | Ring switch.
 * Until the visitor touches it, only the preview picture rotates ring → pendant → earrings → …
 * (the window and its controls stay put, so nothing jumps).
 */
export default function JewelryDesigner() {
  const [mode, setMode] = useState<"pendant" | "earrings" | "ring">("pendant");
  const [auto, setAuto] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!auto) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setAuto(false); return; }
    const t = setInterval(() => setStep(s => s + 1), STEP_MS);
    return () => clearInterval(t);
  }, [auto]);

  if (auto) {
    const slot = step % 3, round = Math.floor(step / 3);
    const stop = (m: "pendant" | "earrings" | "ring") => { setAuto(false); setMode(m); };
    // ring step: lay a ring picture over the preview while the pendant underneath already
    // switches to the next one, so it is ready (no flicker) when the ring picture goes away
    const nameIndex = (round % NAME_PAIRS) * 2 + (slot === 2 ? 1 : 0);
    const ring = slot === 0 ? <div className="ring-art demo" key={round}><RingSvg o={RING_DEMOS[round % RING_DEMOS.length]} /></div> : undefined;
    return <NameDesigner key="pendant" demoIndex={nameIndex} overlay={ring} onTouch={() => stop("pendant")} onRing={() => stop("ring")} />;
  }

  return mode === "ring"
    ? <RingDesigner onPick={k => setMode(k)} />
    : <NameDesigner key={mode} startKind={mode} onRing={() => setMode("ring")} />;
}
