"use client";

import Link from "next/link";
import { useState } from "react";

type Unit = "in" | "cm";
type Fit = "snug" | "comfort" | "loose";

const ADD: Record<Fit, number> = { snug: .25, comfort: .5, loose: .875 };
const HINTS: Record<Fit, string> = { snug: "Tennis and bead bracelets.", comfort: "Chains and everyday wear.", loose: "Charm and statement pieces." };
const CHART: [string, number][] = [["XS", 6], ["S", 6.5], ["M", 7], ["L", 7.5], ["XL", 8], ["XXL", 8.5]];

function calc(value: string, unit: Unit, fit: Fit, thick: boolean) {
  const v = parseFloat(value);
  if (!v || v <= 0) return { msg: "Enter your wrist size" };
  const inches = unit === "cm" ? v / 2.54 : v;
  if (inches < 4 || inches > 11) return { msg: unit === "cm" ? "Check the number — wrists are usually 13–23 cm." : "Check the number — wrists are usually 5–9 inches." };
  let len = inches + ADD[fit] + (thick ? .25 : 0);
  len = Math.ceil(len * 4 - 0.001) / 4;
  const cm = Math.round(len * 2.54 * 2) / 2;
  let size = CHART[0][0];
  CHART.forEach(([s, l]) => { if (len >= l - 0.13) size = s; });
  const inTxt = (Number.isInteger(len) ? len : len.toFixed(2).replace(/0$/, "")) + "″";
  return { inTxt, cm, size };
}

export default function SizeFinder() {
  const [wrist, setWrist] = useState("");
  const [unit, setUnit] = useState<Unit>("in");
  const [fit, setFit] = useState<Fit>("comfort");
  const [thick, setThick] = useState(false);
  const r = calc(wrist, unit, fit, thick);

  return (
    <div className="card finder">
      <h3>Size finder</h3>
      <div className="f-grid">
        <div>
          <p className="opt-label">Your wrist</p>
          <div className="wrist-in">
            <input
              id="sz-wrist" type="text" inputMode="decimal" autoComplete="off" aria-label="Wrist measurement"
              placeholder={unit === "cm" ? "16.5" : "6.5"}
              value={wrist}
              onChange={e => setWrist(e.target.value.replace(",", ".").replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1").slice(0, 5))}
            />
            <div className="seg unit" role="group" aria-label="Unit">
              {(["in", "cm"] as Unit[]).map(u => (
                <button key={u} type="button" aria-pressed={unit === u} onClick={() => setUnit(u)}>{u}</button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="opt-label">How should it fit?</p>
          <div className="seg" role="group" aria-label="Fit">
            {(["snug", "comfort", "loose"] as Fit[]).map(f => (
              <button key={f} type="button" aria-pressed={fit === f} onClick={() => setFit(f)}>{f[0].toUpperCase() + f.slice(1)}</button>
            ))}
          </div>
          <p className="hint">{HINTS[fit]}</p>
        </div>
      </div>
      <label className="check"><input type="checkbox" checked={thick} onChange={e => setThick(e.target.checked)} /> Thick or wide links</label>
      <div className="result" aria-live="polite">
        <p className="r-label">Order this length</p>
        {"msg" in r ? (
          <p className="r-val">{r.msg}</p>
        ) : (
          <>
            <p className="r-val on">{r.inTxt}<small>{r.cm} cm</small><span className="r-size">Size {r.size}</span></p>
            <p className="r-note">Write this number down — you&apos;ll need it when you <Link href="/order">start your order</Link>.</p>
          </>
        )}
      </div>
    </div>
  );
}
