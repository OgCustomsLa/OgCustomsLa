"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { subscribe, type SubmitResult } from "@/app/actions";
import { WHEEL_PRIZES } from "@/lib/site";

const SPUN_KEY = "og-wheel"; // localStorage: { pct, code } once the visitor has spun
const OLD_JOINED_KEY = "og-offer-joined"; // signed up to the old 5% offer: don't show again either
const DELAY_MS = 5000;
const IDLE_MS = 2500;

// two slices per prize, mixed around the wheel
const SLICES = [0, 2, 1, 3, 0, 2, 1, 3].map(i => WHEEL_PRIZES[i]);
const SEG = 360 / SLICES.length;

function pickSlice(): number {
  const total = WHEEL_PRIZES.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  let prize: (typeof WHEEL_PRIZES)[number] = WHEEL_PRIZES[0];
  for (const p of WHEEL_PRIZES) { if ((r -= p.weight) < 0) { prize = p; break; } }
  const options = SLICES.map((s, i) => (s.pct === prize.pct ? i : -1)).filter(i => i >= 0);
  return options[Math.floor(Math.random() * options.length)];
}

const arc = (i: number) => {
  const a0 = ((i * SEG - SEG / 2 - 90) * Math.PI) / 180, a1 = ((i * SEG + SEG / 2 - 90) * Math.PI) / 180, R = 100;
  return `M0 0L${(Math.cos(a0) * R).toFixed(2)} ${(Math.sin(a0) * R).toFixed(2)}A${R} ${R} 0 0 1 ${(Math.cos(a1) * R).toFixed(2)} ${(Math.sin(a1) * R).toFixed(2)}Z`;
};

/** "Spin to win" discount wheel: opens a few seconds into a visit; enter your email, spin, get a code. Once per visitor. */
export default function SpinWheel() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ sending?: boolean; error?: string; spinning?: boolean }>({});
  const [angle, setAngle] = useState(0);
  const [won, setWon] = useState<{ pct: number; code: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let skip = false;
    try { skip = !!localStorage.getItem(SPUN_KEY) || localStorage.getItem(OLD_JOINED_KEY) === "1"; } catch {}
    if (skip) return;
    // don't cut in while someone is typing or tapping: wait until they've been idle for a moment
    let last = 0, t = 0;
    const busy = () => { last = Date.now(); };
    const evs = ["keydown", "pointerdown", "input"] as const;
    evs.forEach(e => document.addEventListener(e, busy, true));
    const tryOpen = () => {
      const typing = document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement;
      if (typing || Date.now() - last < IDLE_MS) { t = window.setTimeout(tryOpen, 1500); return; }
      setOpen(true);
    };
    t = window.setTimeout(tryOpen, DELAY_MS);
    return () => { clearTimeout(t); evs.forEach(e => document.removeEventListener(e, busy, true)); };
  }, []);

  useEffect(() => {
    const show = () => {
      try { const saved = JSON.parse(localStorage.getItem(SPUN_KEY) || "null"); if (saved) setWon(saved); } catch {}
      setOpen(true);
    };
    window.addEventListener("og-open-wheel", show);
    return () => window.removeEventListener("og-open-wheel", show);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !state.spinning) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("offer-open");
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.classList.remove("offer-open"); };
  }, [open, state.spinning]);

  async function spin(e: React.FormEvent) {
    e.preventDefault();
    if (state.spinning || won) return;
    setState({ sending: true });
    const res = await subscribe(email).catch((): SubmitResult => ({ ok: false, error: "Couldn’t reach our server — refresh the page and try again." }));
    if (!res.ok) { setState({ error: res.fallback ? "We couldn’t sign you up right now. Please try again later." : res.error }); return; }
    const k = pickSlice(), prize = SLICES[k];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // land the chosen slice under the pointer at the top, after several full turns
    const jitter = (Math.random() - 0.5) * SEG * 0.6;
    const target = angle + (reduce ? 0 : 360 * 6) + ((360 - k * SEG - (angle % 360)) % 360 + 360) % 360 + jitter;
    setState({ spinning: true });
    setAngle(target);
    const done = () => {
      setWon({ pct: prize.pct, code: prize.code });
      setState({});
      try { localStorage.setItem(SPUN_KEY, JSON.stringify({ pct: prize.pct, code: prize.code })); } catch {}
    };
    if (reduce) done(); else window.setTimeout(done, 5200);
  }

  async function copy() {
    if (!won) return;
    try { await navigator.clipboard.writeText(won.code); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  }

  if (!open) return null;
  const top = Math.max(...WHEEL_PRIZES.map(p => p.pct));

  return (
    <div className="offer-backdrop" onClick={e => { if (e.target === e.currentTarget && !state.spinning) setOpen(false); }}>
      <div className="offer-card wheel-card" role="dialog" aria-modal="true" aria-labelledby="wheel-title">
        <button type="button" className="offer-close" aria-label="Close" onClick={() => setOpen(false)} disabled={state.spinning}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
        </button>

        <div className="wheel-side" aria-hidden="true">
          <div className="wheel-box">
            <svg className="wheel-svg" viewBox="-112 -112 224 224">
              <circle r="110" fill="#C9A24E" />
              <circle r="104" fill="#14120E" />
              <g className="wheel-spin" style={{ transform: `rotate(${angle}deg)` }}>
                {SLICES.map((s, i) => (
                  <g key={i}>
                    <path d={arc(i)} fill={i % 2 ? "#E2C16F" : "#14120E"} stroke="#8A6A2A" strokeWidth=".8" />
                    <g transform={`rotate(${i * SEG})`}>
                      <text y="-64" textAnchor="middle" className={"wheel-pct " + (i % 2 ? "dark" : "light")}>{s.pct}%</text>
                      <text y="-48" textAnchor="middle" className={"wheel-off " + (i % 2 ? "dark" : "light")}>OFF</text>
                    </g>
                  </g>
                ))}
              </g>
              {/* little lights around the rim */}
              {Array.from({ length: 16 }, (_, i) => {
                const a = (i / 16) * Math.PI * 2;
                return <circle key={i} className="wheel-light" style={{ animationDelay: `${(i % 2) * 0.5}s` }} cx={(Math.cos(a) * 107).toFixed(1)} cy={(Math.sin(a) * 107).toFixed(1)} r="2.6" />;
              })}
              <circle r="22" fill="#14120E" stroke="#C9A24E" strokeWidth="3" />
              <image href="/images/logo-la-160.png" x="-17" y="-17" width="34" height="34" />
            </svg>
            <svg className="wheel-pointer" viewBox="0 0 30 36"><path d="M15 34L3 8a12 12 0 1 1 24 0z" fill="#B92D22" stroke="#FFF1C4" strokeWidth="2" /></svg>
          </div>
        </div>

        <div className="offer-body wheel-body">
          {won ? (
            <>
              <p className="wheel-kicker">You won</p>
              <h2 id="wheel-title" className="wheel-title">{won.pct}% OFF</h2>
              <p className="wheel-text">Use this code when you order:</p>
              <p className="offer-code">{won.code}</p>
              <button type="button" className="offer-copy" onClick={copy}>{copied ? "Copied ✓" : "Copy code"}</button>
              <Link href="/available" className="btn wheel-btn" onClick={() => setOpen(false)}>Shop now</Link>
            </>
          ) : (
            <>
              <p className="wheel-kicker">Spin to win</p>
              <h2 id="wheel-title" className="wheel-title">Up to {top}% off</h2>
              <p className="wheel-text">Enter your email and spin the wheel for a discount on your order.</p>
              <form onSubmit={spin} noValidate>
                <input type="email" required autoComplete="email" placeholder="Enter your email" aria-label="Email" value={email} onChange={e => setEmail(e.target.value)} disabled={state.spinning} />
                <button type="submit" className="btn wheel-btn" disabled={state.sending || state.spinning}>{state.sending ? "One moment…" : state.spinning ? "Spinning…" : "Spin the wheel"}</button>
                {state.error && <p className="offer-error" role="alert">{state.error}</p>}
              </form>
              <button type="button" className="offer-later" onClick={() => setOpen(false)} disabled={state.spinning}>No thanks</button>
              <p className="wheel-fine">One spin per customer.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
