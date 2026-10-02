"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DESIGN_KEY, EMAIL, mailto, sendRequest, type DesignPrefill } from "@/lib/site";

type Option = { v: string; content: React.ReactNode; className?: string };

function Tiles({ q, options, value, onPick, className = "tiles small" }: {
  q?: string; options: Option[]; value?: string; onPick: (v: string) => void; className?: string;
}) {
  return (
    <div className={className}>
      {q && <p className="q">{q}</p>}
      {options.map(o => (
        <button key={o.v} type="button" className={o.v === value ? "sel" : undefined} onClick={() => onPick(o.v)}>{o.content}</button>
      ))}
    </div>
  );
}

const ICON = { fill: "none", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const PIECES: Option[] = [
  { v: "Ring", content: <><b className="tn">Ring<svg className="ti" viewBox="0 0 32 32" {...ICON} aria-hidden="true"><circle cx="16" cy="19" r="9" stroke="currentColor" /><circle cx="16" cy="19" r="6.5" stroke="currentColor" /><path d="M12 7l2-3h4l2 3-4 4z M12 7h8" stroke="#A8854F" /></svg></b><span>Signet, band, engagement, statement</span></> },
  { v: "Pendant", content: <><b className="tn">Pendant<svg className="ti" viewBox="0 0 32 32" {...ICON} aria-hidden="true"><path d="M5 3c3 6 7 8 11 8s8-2 11-8" stroke="currentColor" strokeDasharray="1.5 2.5" /><circle cx="16" cy="12.5" r="1.5" stroke="currentColor" /><path d="M16 14l6 5-6 10-6-10z M10 19h12" stroke="#A8854F" /></svg></b><span>Portrait, logo, religious, custom shape</span></> },
  { v: "Name pendant", content: <><b className="tn">Name pendant<svg className="ti" viewBox="0 0 32 32" {...ICON} aria-hidden="true"><text x="5" y="20" fontFamily="Yellowtail, cursive" fontSize="15" fill="#A8854F">Ana</text><path d="M4 24c8 3 17 2 24-3" stroke="currentColor" /></svg></b><span>Script, gothic, block letters</span></> },
  { v: "Earrings", content: <><b className="tn">Earrings<svg className="ti" viewBox="0 0 32 32" {...ICON} aria-hidden="true"><path d="M10 4c2 0 2 3 0 3M22 4c2 0 2 3 0 3" stroke="currentColor" /><circle cx="10" cy="9" r="1.3" stroke="currentColor" /><circle cx="22" cy="9" r="1.3" stroke="currentColor" /><path d="M10 10.5l3.5 5-3.5 12-3.5-12z M22 10.5l3.5 5-3.5 12-3.5-12z" stroke="#A8854F" /></svg></b><span>Studs, drops, hoops — as a pair</span></> },
  { v: "Bracelet", content: <><b className="tn">Bracelet<svg className="ti" viewBox="0 0 32 32" {...ICON} aria-hidden="true"><ellipse cx="16" cy="16" rx="12" ry="7" stroke="currentColor" /><ellipse cx="16" cy="16" rx="9.5" ry="5" stroke="#A8854F" strokeDasharray="2 2" /></svg></b><span>Bangle, cuff, chain, charm</span></> },
  { v: "Something else", content: <><b className="tn">Something else<svg className="ti" viewBox="0 0 32 32" {...ICON} aria-hidden="true"><path d="M16 4v6M16 22v6M4 16h6M22 16h6" stroke="#A8854F" /><path d="M16 11l1.6 3.4L21 16l-3.4 1.6L16 21l-1.6-3.4L11 16l3.4-1.6z" stroke="currentColor" /></svg></b><span>Grillz, cufflinks, anything</span></> },
];
const plain = (items: [string, string?, string?][]): Option[] =>
  items.map(([v, label, sub]) => ({ v, content: <><b>{label ?? v}</b>{sub && <span>{sub}</span>}</> }));
const DELIVER = plain([["Finished piece", undefined, "Cast in metal and polished"], ["3D file only", undefined, "Cast-ready model for your jeweler"], ["Castable print", undefined, "Printed pattern for your caster"]]);
const START = plain([["My own sketch", undefined, "We'll make it exactly as drawn"], ["A photo / reference", "A photo or reference", "Something you saw and want customized"], ["Just an idea", undefined, "We'll design it from scratch"]]);
const METALS: Option[] = [
  ["Yellow gold", "Yellow gold", "linear-gradient(#F6E3A6,#A9822F)"],
  ["White gold", "White gold", "linear-gradient(#fff,#B9BDBF)"],
  ["Rose gold", "Rose gold", "linear-gradient(#F9D9C9,#A86C55)"],
  ["Sterling silver", "Silver 925", "linear-gradient(#fff,#8E9294)"],
].map(([v, label, bg]) => ({ v, content: <><i style={{ background: bg }}></i><b>{label}</b></> }));
const BUDGETS = plain([["Under $300"], ["$300 – $800"], ["$800 – $2,000"], ["$2,000+"]]);
const CONTACT_BY = plain([["Email"], ["Text"], ["Call"], ["Instagram"]]);
const DELIVERY = plain([["Pick up in LA"], ["Ship in the US"], ["Ship internationally"]]);
const STEP_NAMES = ["Piece", "Design", "Details", "Budget", "Contact", "Review"];

function sizeOptions(piece?: string) {
  if (piece === "Ring") {
    const opts = ["Not sure — help me measure"]; for (let x = 3; x <= 13; x += .5) opts.push(String(x));
    return { label: "Ring size (US)", opts, help: "Not sure? A jeweler can measure you for free, or ask us for a ring sizer." };
  }
  if (piece === "Bracelet") return { label: "Bracelet length", opts: ["Not sure — help me measure", "6″ · 15 cm (XS)", "6.5″ · 16.5 cm (S)", "7″ · 18 cm (M)", "7.5″ · 19 cm (L)", "8″ · 20 cm (XL)", "8.5″ · 21.5 cm (XXL)", "Bangle — I’ll send my hand size"], help: "Use the size guide on our home page to find yours." };
  if (piece === "Pendant" || piece === "Name pendant") return { label: "Chain", opts: ["Pendant only — no chain", "16″ chain", "18″ chain", "20″ chain", "22″ chain", "24″ chain", "Not sure"], help: "" };
  return { label: "Size", opts: ["Not needed", "Not sure"], help: "" };
}

const EMPTY_FIELDS = {
  desc: "", nametext: "", link: "", karat: "Not sure — advise me", stones: "No stones", size: "", dim: "",
  finish: "High polish", engrave: "", date: "", name: "", email: "", phone: "", ig: "", city: "",
};

export default function OrderWizard() {
  const [pick, setPick] = useState<Record<string, string | undefined>>({ deliver: "Finished piece", contactby: "Email", delivery: "Ship in the US" });
  const [f, setF] = useState(EMPTY_FIELDS);
  const [agree, setAgree] = useState(false);
  const [cur, setCur] = useState(0);
  const [err, setErr] = useState<{ msg: string; href?: string }>({ msg: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const prevStep = useRef(0);

  const size = sizeOptions(pick.piece);
  const sizeHidden = size.opts[0] === "Not needed";
  const last = STEP_NAMES.length - 1;

  const set = (key: keyof typeof EMPTY_FIELDS) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF(p => ({ ...p, [key]: e.target.value }));
  const choose = (key: string) => (v: string) => {
    setPick(p => ({ ...p, [key]: v })); setErr({ msg: "" });
    if (key === "piece") setF(p => ({ ...p, size: sizeOptions(v).opts[0] }));
  };

  // a design handed over from the name designer on the home page
  useEffect(() => {
    let o: DesignPrefill | null = null;
    try { o = JSON.parse(sessionStorage.getItem(DESIGN_KEY) || "null"); sessionStorage.removeItem(DESIGN_KEY); } catch {}
    if (!o) return;
    const piece = o.piece || "Name pendant";
    setPick(p => ({ ...p, piece, start: "Just an idea", ...(o.metal ? { metal: o.metal } : {}) }));
    setF(p => ({ ...p, nametext: o.name || "", desc: o.desc || "", size: sizeOptions(piece).opts[0], ...(o.stones ? { stones: o.stones } : {}) }));
  }, []);

  // bring the form into view when the step changes (not on first load)
  useEffect(() => {
    if (prevStep.current === cur) return;
    prevStep.current = cur;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [cur]);

  function check(i: number) {
    const v = (k: keyof typeof EMPTY_FIELDS) => f[k].trim();
    if (i === 0 && !pick.piece) return "Choose what you want made.";
    if (i === 1) {
      if (!pick.start) return "Choose what you are starting with.";
      if (!v("desc") && !(pick.piece === "Name pendant" && v("nametext"))) return "Add a short description of your piece.";
      if (v("link") && !/^https?:\/\//i.test(v("link"))) return "The link should start with http:// or https://";
    }
    if (i === 2 && pick.deliver === "Finished piece" && !pick.metal) return "Choose a metal.";
    if (i === 3 && !pick.budget) return "Choose a budget range.";
    if (i === 4) {
      if (!v("name")) return "Add your name.";
      if (!/^\S+@\S+\.\S+$/.test(v("email"))) return "Add a valid email so we can send your quote.";
      if ((pick.contactby === "Text" || pick.contactby === "Call") && !v("phone")) return "Add your phone number, or choose email.";
      if (pick.contactby === "Instagram" && !v("ig")) return "Add your Instagram, or choose another way.";
    }
    if (i === 5 && !agree) return "Tick the box to confirm.";
    return "";
  }

  function rows(): [string, string, number][] {
    const t = (k: keyof typeof EMPTY_FIELDS) => f[k].trim();
    const metal = pick.deliver === "Finished piece"
      ? (pick.metal || "—") + (pick.metal && pick.metal !== "Sterling silver" ? " · " + t("karat") : "")
      : "Not needed (file / print only)";
    const all: [string, string | undefined, number][] = [
      ["Piece", pick.piece, 0], ["We make", pick.deliver, 0],
      ["Starting from", pick.start, 1], ["Name / text", pick.piece === "Name pendant" ? t("nametext") : "", 1], ["Description", t("desc"), 1], ["Photos", t("link"), 1],
      ["Metal", metal, 2], ["Stones", f.stones, 2],
      [size.label, sizeHidden ? "" : (f.size || size.opts[0]), 2],
      ["Piece size", t("dim"), 2], ["Finish", f.finish, 2], ["Engraving", t("engrave"), 2],
      ["Budget", pick.budget, 3], ["Need by", t("date"), 3],
      ["Name", t("name"), 4], ["Email", t("email"), 4], ["Phone", t("phone"), 4], ["Instagram", t("ig"), 4],
      ["Contact by", pick.contactby, 4], ["Delivery", pick.delivery, 4], ["Location", t("city"), 4],
    ];
    return all.filter((r): r is [string, string, number] => !!r[1]);
  }

  function show(i: number) { setErr({ msg: "" }); setCur(i); }

  async function submit() {
    setSending(true);
    const data = rows(), obj: Record<string, string> = {};
    data.forEach(([k, v]) => { obj[k] = v; });
    const ok = await sendRequest("order", obj);
    setSending(false);
    if (ok) { setDone(true); window.scrollTo(0, 0); return; }
    const body = data.map(([k, v]) => `${k}: ${v}`).join("\n");
    setErr({ msg: "The form couldn’t send from here. ", href: mailto("Order request — " + f.name.trim(), body) });
  }

  function next() {
    const m = check(cur); if (m) { setErr({ msg: m }); return; }
    if (cur < last) show(cur + 1); else submit();
  }

  return (
    <section className="op">
      <div className="wrap op-wrap">
        <Link href="/" className="op-back">← Back to site</Link>
        <div className="op-head">
          <p className="label">Start an order</p>
          <h1 className="op-title">Let&apos;s design <span className="g">your piece</span></h1>
          <p className="op-sub">Takes about 3 minutes. No payment now — we&apos;ll reply with questions, a quote and a timeline.</p>
        </div>

        <ol className="op-steps" hidden={done}>
          {STEP_NAMES.map((s, k) => <li key={s} className={k === cur ? "on" : k < cur ? "done" : undefined}>{s}</li>)}
        </ol>

        <form ref={formRef} className="op-form" noValidate hidden={done} onSubmit={e => e.preventDefault()}>
          {/* 1 piece */}
          <fieldset className="op-step" hidden={cur !== 0}>
            <legend>What would you like made?</legend>
            <Tiles className="tiles" options={PIECES} value={pick.piece} onPick={choose("piece")} />
            <Tiles q="What do you need from us?" options={DELIVER} value={pick.deliver} onPick={choose("deliver")} />
          </fieldset>

          {/* 2 design */}
          <fieldset className="op-step" hidden={cur !== 1}>
            <legend>Tell us about the design</legend>
            <Tiles q="What are you starting with?" options={START} value={pick.start} onPick={choose("start")} />
            <div className="field">
              <label htmlFor="o-desc">Describe your piece</label>
              <textarea id="o-desc" rows={5} value={f.desc} onChange={set("desc")} placeholder="What it should look like, any text or names, style, size, where you'll wear it…"></textarea>
            </div>
            <div className="field" hidden={pick.piece !== "Name pendant"}>
              <label htmlFor="o-nametext">Name or text on the pendant</label>
              <input id="o-nametext" maxLength={24} value={f.nametext} onChange={set("nametext")} placeholder="e.g. Elena" />
              <p className="op-tip">We have many different fonts — not only the ones in our designer. Describe the style you want, or send a picture of a font you like.</p>
            </div>
            <div className="field">
              <label htmlFor="o-link">Link to your sketch or photos <small>(optional)</small></label>
              <input id="o-link" type="url" value={f.link} onChange={set("link")} placeholder="Google Drive, Dropbox, Instagram post…" />
              <p className="help">No link? After you send this, email your pictures to <a href={`mailto:${EMAIL}`}>{EMAIL}</a> with your name in the subject.</p>
            </div>
          </fieldset>

          {/* 3 details */}
          <fieldset className="op-step" hidden={cur !== 2}>
            <legend>Metal, stones and size</legend>
            <Tiles className="tiles small four" q="Metal" options={METALS} value={pick.metal} onPick={choose("metal")} />
            <div className="row2">
              <div className="field" hidden={pick.metal === "Sterling silver"}>
                <label htmlFor="o-karat">Gold karat</label>
                <select id="o-karat" value={f.karat} onChange={set("karat")}>
                  {["Not sure — advise me", "10k", "14k", "18k"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="o-stones">Stones</label>
                <select id="o-stones" value={f.stones} onChange={set("stones")}>
                  {["No stones", "Diamonds", "Lab-grown diamonds", "Moissanite", "CZ", "Colored stones", "Not sure — advise me"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="row2">
              <div className="field" hidden={sizeHidden}>
                <label htmlFor="o-size">{size.label}</label>
                <select id="o-size" value={f.size || size.opts[0]} onChange={set("size")}>
                  {size.opts.map(o => <option key={o}>{o}</option>)}
                </select>
                <p className="help">{size.help}</p>
              </div>
              <div className="field">
                <label htmlFor="o-dim">Approximate size of the piece <small>(optional)</small></label>
                <input id="o-dim" value={f.dim} onChange={set("dim")} placeholder="e.g. 1.5 inch tall, like a quarter" />
              </div>
            </div>
            <div className="row2">
              <div className="field">
                <label htmlFor="o-finish">Finish</label>
                <select id="o-finish" value={f.finish} onChange={set("finish")}>
                  {["High polish", "Matte / brushed", "Mix of both", "Not sure"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="o-engrave">Engraving <small>(optional)</small></label>
                <input id="o-engrave" maxLength={40} value={f.engrave} onChange={set("engrave")} placeholder="Text on the back" />
              </div>
            </div>
          </fieldset>

          {/* 4 budget */}
          <fieldset className="op-step" hidden={cur !== 3}>
            <legend>Budget and timing</legend>
            <Tiles className="tiles small four" q="Your budget" options={BUDGETS} value={pick.budget} onPick={choose("budget")} />
            <p className="help" style={{ marginTop: "-.4rem" }}>Not sure? Pick the closest — we&apos;ll suggest options that fit.</p>
            <div className="field">
              <label htmlFor="o-date">Need it by <small>(optional)</small></label>
              <input id="o-date" type="date" value={f.date} onChange={set("date")} />
            </div>
            <p className="op-warn">Please note: depending on the design, an order can take from 1 to 14 days.</p>
          </fieldset>

          {/* 5 contact */}
          <fieldset className="op-step" hidden={cur !== 4}>
            <legend>How can we reach you?</legend>
            <div className="row2">
              <div className="field"><label htmlFor="o-name">Full name</label><input id="o-name" autoComplete="name" value={f.name} onChange={set("name")} /></div>
              <div className="field"><label htmlFor="o-email">Email</label><input id="o-email" type="email" autoComplete="email" value={f.email} onChange={set("email")} /></div>
            </div>
            <div className="row2">
              <div className="field"><label htmlFor="o-phone">Phone <small>(optional)</small></label><input id="o-phone" type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} /></div>
              <div className="field"><label htmlFor="o-ig">Instagram <small>(optional)</small></label><input id="o-ig" placeholder="@yourname" value={f.ig} onChange={set("ig")} /></div>
            </div>
            <Tiles className="tiles small four" q="Best way to contact you" options={CONTACT_BY} value={pick.contactby} onPick={choose("contactby")} />
            <Tiles q="Delivery" options={DELIVERY} value={pick.delivery} onPick={choose("delivery")} />
            <div className="field"><label htmlFor="o-city">City and country</label><input id="o-city" autoComplete="address-level2" placeholder="e.g. Houston, USA" value={f.city} onChange={set("city")} /></div>
          </fieldset>

          {/* 6 review */}
          <fieldset className="op-step" hidden={cur !== 5}>
            <legend>Check your order</legend>
            <p className="op-warn">Reminder: depending on the design, an order can take from 1 to 14 days.</p>
            {cur === last && (
              <dl className="summary">
                {rows().map(([k, v, s]) => (
                  <div key={k} style={{ display: "contents" }}>
                    <dt>{k}</dt>
                    <dd>{v}<button type="button" onClick={() => show(s)}>Edit</button></dd>
                  </div>
                ))}
              </dl>
            )}
            <label className="check"><input type="checkbox" checked={agree} onChange={e => { setAgree(e.target.checked); setErr({ msg: "" }); }} /> I understand this is a request for a quote. Nothing is made until I approve the design.</label>
          </fieldset>

          <p className="op-error" role="alert">
            {err.msg}
            {err.href && <a href={err.href}>Email this order instead</a>}
          </p>
          <div className="op-nav">
            <button type="button" className="btn ghost" hidden={cur === 0} onClick={() => show(Math.max(0, cur - 1))}>Back</button>
            <button type="button" className="btn" id="op-next" disabled={sending} onClick={next}>
              {sending ? "Sending…" : cur === last ? "Send request" : "Continue"}
            </button>
          </div>
        </form>

        <div className="op-done" hidden={!done}>
          <p className="label">Request sent</p>
          <h2>Thank you — <span className="g">we&apos;re on it.</span></h2>
          <p>We&apos;ll reply within 1–2 business days with questions and a quote. If you have sketches or photos, email them to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
          <Link href="/" className="btn">Back to site</Link>
        </div>
      </div>
    </section>
  );
}
