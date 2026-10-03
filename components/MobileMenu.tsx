"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS: { href: string; label: string; hidePhone?: boolean; live?: boolean }[] = [
  { href: "/available", label: "Available now", live: true },
  { href: "/#make", label: "What we make" },
  { href: "/#process", label: "How it works", hidePhone: true },
  { href: "/#work", label: "Our work" },
  { href: "/#sizes", label: "Size guide" },
  { href: "/#faq", label: "FAQ", hidePhone: true },
  { href: "/#contact", label: "Contact" },
  { href: "/about", label: "About us" },
];

/** Menu button + slide-down panel for screens where the header links don't fit (under 900px). */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // close on page change and on Escape
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className={"menu-btn" + (open ? " open" : "")}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(o => !o)}
      >
        <span /><span /><span />
      </button>
      <div id="mobile-menu" className={"menu-panel" + (open ? " open" : "")} inert={!open}>
        <nav aria-label="Mobile">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={close} className={l.hidePhone ? "hide-phone" : l.live ? "nav-avail" : undefined}>
              {l.live && <span className="live-dot" aria-hidden="true" />}{l.label}
            </Link>
          ))}
        </nav>
        <Link href="/order" className="btn" onClick={close}>Start an order</Link>
      </div>
    </>
  );
}
