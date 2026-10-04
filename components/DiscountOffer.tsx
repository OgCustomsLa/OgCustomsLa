"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { subscribe, type SubmitResult } from "@/app/actions";
import { DISCOUNT_CODE } from "@/lib/site";
import { BrandMark } from "./Logo";

const JOINED_KEY = "og-offer-joined"; // localStorage: signed up, never show again
// glints around the angel: [left %, top %, size px, delay s]
const SPARKS: [number, number, number, number][] = [[18, 30, 18, 0], [80, 22, 14, 1.1], [72, 62, 20, 2.2], [24, 70, 12, 0.6], [55, 12, 12, 1.7]];
const DELAY_MS = 5000;
const IDLE_MS = 2500;

/**
 * "Unlock 5% off" window (about 70% of the screen) that opens a few seconds after the site is opened or
 * reloaded (not again while moving between pages); never once the visitor has signed up.
 */
export default function DiscountOffer() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [state, setState] = useState<{ sending?: boolean; error?: string; done?: boolean }>({});

  useEffect(() => {
    let skip = false;
    try { skip = localStorage.getItem(JOINED_KEY) === "1"; } catch {}
    if (skip) return;
    // don't cut in while someone is typing or tapping (e.g. building a piece in the designer):
    // wait until they've been idle for a moment
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
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("offer-open"); // stop the page scrolling behind the window
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.classList.remove("offer-open"); };
  }, [open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ sending: true });
    const res = await subscribe(email).catch((): SubmitResult => ({ ok: false, error: "Couldn’t reach our server — refresh the page and try again." }));
    if (res.ok) {
      setState({ done: true });
      try { localStorage.setItem(JOINED_KEY, "1"); } catch {}
      return;
    }
    setState({ error: res.fallback ? "We couldn’t sign you up right now. Please try again later." : res.error });
  }

  async function copy() {
    try { await navigator.clipboard.writeText(DISCOUNT_CODE); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  }

  if (!open) return null;

  return (
    <div className="offer-backdrop" onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="offer-card" role="dialog" aria-modal="true" aria-labelledby="offer-title">
        <button type="button" className="offer-close" aria-label="Close" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
        </button>
        <div className="offer-photo" aria-hidden="true">
          <img src="/images/angel-gold-cut.png" alt="" />
          {/* little diamond glints twinkling around the pendant */}
          {SPARKS.map(([x, y, s, d], i) => (
            <svg key={i} className="offer-spark" viewBox="0 0 20 20" style={{ left: x + "%", top: y + "%", width: s, height: s, animationDelay: d + "s" }}>
              <path d="M10 0C11 7 13 9 20 10 13 11 11 13 10 20 9 13 7 11 0 10 7 9 9 7 10 0Z" />
            </svg>
          ))}
        </div>
        <div className="offer-body">
          <BrandMark className="offer-mark" />
          {state.done ? (
            <h2 id="offer-title" className="offer-title">You’re In</h2>
          ) : (
            <h2 id="offer-title" className="offer-title"><span className="offer-unlock">Unlock</span><span className="offer-big">5% Off</span></h2>
          )}
          <p className="offer-kicker">{state.done ? "Your code" : "Your first order"}</p>
          {state.done ? (
            <>
              <p className="offer-code">{DISCOUNT_CODE}</p>
              <button type="button" className="offer-copy" onClick={copy}>{copied ? "Copied ✓" : "Copy code"}</button>
              <p className="offer-perks">Mention this code when you order and we&apos;ll take 5% off your first piece.</p>
              <Link href="/order" className="btn" onClick={() => setOpen(false)}>Start an order</Link>
            </>
          ) : (
            <>
              <ul className="offer-list">
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-2-4-6-4-6-1.5S10 7 12 7zm0 0c2-4 6-4 6-1.5S14 7 12 7z" /></svg>Exclusive offers</li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" /><circle cx="12" cy="12" r="2.5" /></svg>Early access to new drops</li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h10l3.5 4L12 20 3.5 9zM3.5 9h17M9.5 5L8 9l4 11 4-11-1.5-4" /></svg>And more</li>
              </ul>
              <form onSubmit={onSubmit} noValidate>
                <input type="email" required autoComplete="email" placeholder="Enter your email" aria-label="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <button type="submit" className="btn" disabled={state.sending}>{state.sending ? "Sending…" : "Continue"}</button>
                {state.error && <p className="offer-error" role="alert">{state.error}</p>}
              </form>
              <button type="button" className="offer-later" onClick={() => setOpen(false)}>No thanks</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
