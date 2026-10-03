"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { subscribe, type SubmitResult } from "@/app/actions";
import { DISCOUNT_CODE } from "@/lib/site";
import { BrandMark } from "./Logo";

const JOINED_KEY = "og-offer-joined"; // localStorage: signed up, never show again
const SEEN_KEY = "og-offer-seen"; // sessionStorage: already shown during this visit
const DELAY_MS = 4000;

/**
 * "Unlock 5% off" window (about 70% of the screen) that opens a few seconds into each visit.
 * Shown once per visit; never again once the visitor has signed up.
 */
export default function DiscountOffer() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ sending?: boolean; error?: string; done?: boolean }>({});

  useEffect(() => {
    let skip = false;
    try { skip = localStorage.getItem(JOINED_KEY) === "1" || sessionStorage.getItem(SEEN_KEY) === "1"; } catch {}
    if (skip) return;
    const t = setTimeout(() => {
      setOpen(true);
      try { sessionStorage.setItem(SEEN_KEY, "1"); } catch {}
    }, DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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

  if (!open) return null;

  return (
    <div className="offer-backdrop" onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="offer-card" role="dialog" aria-modal="true" aria-labelledby="offer-title">
        <button type="button" className="offer-close" aria-label="Close" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
        </button>
        <div className="offer-photo" aria-hidden="true">
          <img src="/images/jesus-gold-cut.png" alt="" />
        </div>
        <div className="offer-body">
          <BrandMark className="offer-mark" />
          <h2 id="offer-title" className="offer-title">{state.done ? "You’re In" : "Unlock 5% Off"}</h2>
          <p className="offer-kicker">{state.done ? "Your code" : "Your first order"}</p>
          {state.done ? (
            <>
              <p className="offer-code">{DISCOUNT_CODE}</p>
              <p className="offer-perks">Mention this code when you order and we&apos;ll take 5% off your first piece.</p>
              <Link href="/order" className="btn" onClick={() => setOpen(false)}>Start an order</Link>
            </>
          ) : (
            <>
              <p className="offer-plus" aria-hidden="true">+</p>
              <p className="offer-perks">Get exclusive offers<br />Early access to new drops<br />And more</p>
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
