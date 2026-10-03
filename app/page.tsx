import { Fragment } from "react";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Ticker from "@/components/Ticker";
import JewelryDesigner from "@/components/JewelryDesigner";
import SizeFinder from "@/components/SizeFinder";
import { EMAIL } from "@/lib/site";

const strokeIcon = { fill: "none", strokeWidth: 1.4 } as const;
const roundIcon = { ...strokeIcon, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const MAKE = [
  { t: "Rings", p: "Signet, engagement, statement and band rings, sized to your finger.", icon: <svg viewBox="0 0 56 56" {...strokeIcon} aria-hidden="true"><circle cx="28" cy="34" r="15" stroke="currentColor" /><circle cx="28" cy="34" r="11.5" stroke="currentColor" /><path d="M21 12h14l4 5-11 9-11-9z" stroke="#A8854F" /><path d="M17 17h22M24 12l4 14 4-14" stroke="#A8854F" /></svg> },
  { t: "Pendants", p: "Name plates, portraits, religious pieces and logos, any size or depth.", icon: <svg viewBox="0 0 56 56" {...strokeIcon} aria-hidden="true"><path d="M8 6c4 12 12 18 20 19M48 6c-4 12-12 18-20 19" stroke="currentColor" strokeDasharray="2 3" /><circle cx="28" cy="27" r="2" stroke="currentColor" /><path d="M28 29l7 8-7 15-7-15z M21 37h14 M28 29v23" stroke="#A8854F" /></svg> },
  { t: "Earrings", p: "Studs, drops and hoops, made as a matched pair.", icon: <svg viewBox="0 0 56 56" {...strokeIcon} aria-hidden="true"><path d="M17 8c4 0 4 6 0 6M39 8c4 0 4 6 0 6" stroke="currentColor" /><circle cx="17" cy="17" r="2" stroke="currentColor" /><circle cx="39" cy="17" r="2" stroke="currentColor" /><path d="M17 19l5 9-5 18-5-18z M12 28h10 M39 19l5 9-5 18-5-18z M34 28h10" stroke="#A8854F" /></svg> },
  { t: "Bracelets", p: "Bangles, cuffs, chains and charm bracelets, made to your wrist.", icon: <svg viewBox="0 0 56 56" {...strokeIcon} aria-hidden="true"><ellipse cx="28" cy="28" rx="20" ry="12" stroke="currentColor" /><ellipse cx="28" cy="28" rx="16" ry="9" stroke="#A8854F" strokeDasharray="3 3" /></svg> },
  { t: "Chains", p: "Cuban, rope, tennis and custom links, in any length.", icon: <svg viewBox="0 0 56 56" {...roundIcon} aria-hidden="true"><path d="M10 8c0 10 8 14 18 14s18-4 18-14" stroke="currentColor" /><g stroke="#A8854F"><ellipse cx="12" cy="20" rx="3" ry="2" /><ellipse cx="18" cy="25" rx="3" ry="2" /><ellipse cx="25" cy="28" rx="3" ry="2" /><ellipse cx="31" cy="28" rx="3" ry="2" /><ellipse cx="38" cy="25" rx="3" ry="2" /><ellipse cx="44" cy="20" rx="3" ry="2" /></g><path d="M28 30v6" stroke="currentColor" /><path d="M28 36l5 6-5 8-5-8z" stroke="#A8854F" /></svg> },
  { t: "Grillz", p: "Fitted to your teeth from a mold, plain or iced.", icon: <svg viewBox="0 0 56 56" {...roundIcon} aria-hidden="true"><path d="M10 22c4-6 32-6 36 0v8c-4 8-32 8-36 0z" stroke="currentColor" /><path d="M16 21v14M22 19v18M28 18.5v19M34 19v18M40 21v14" stroke="#A8854F" /></svg> },
  { t: "Everything", p: "Cufflinks, watches, keychains, anything else. If you can imagine it, we can make it.", icon: <svg viewBox="0 0 56 56" {...roundIcon} aria-hidden="true"><circle cx="17" cy="38" r="9" stroke="currentColor" /><circle cx="17" cy="38" r="6.5" stroke="currentColor" /><path d="M14 28l3-4 3 4-3 3z" stroke="#A8854F" /><path d="M28 8h12l5 6-11 13-11-13z" stroke="#A8854F" /><path d="M23 14h22M28 8l3 6 3 13M40 8l-3 6" stroke="#A8854F" /><path d="M42 33l1.8 4.7 4.7 1.8-4.7 1.8-1.8 4.7-1.8-4.7-4.7-1.8 4.7-1.8z" stroke="currentColor" /></svg> },
];

const FAQ: { group: string; items: { q: string; a: React.ReactNode; open?: boolean }[] }[] = [
  {
    group: "Ordering",
    items: [
      { q: "What do I need to start an order?", a: "Just your idea. A sketch, a photo or a short description is enough. If you know your size and preferred metal, add them too.", open: true },
      { q: "How much does a custom piece cost?", a: "It depends on the design, size, metal and stones. Send us your idea and we'll reply with a free quote. There's no commitment until you approve the design." },
      { q: "Will I see the design before it's made?", a: "Yes. We send you 3D renders to review, and we revise them until you're happy. Nothing is cast until you approve." },
      { q: "How long does it take?", a: "Depending on the design, an order takes from 1 to 14 days. We confirm the exact timeline with your quote." },
    ],
  },
  {
    group: "Materials & sizing",
    items: [
      { q: "Which metals and stones can I choose?", a: "Yellow, white and rose gold in 10k, 14k or 18k, and sterling silver. For stones: natural or lab-grown diamonds, moissanite, CZ and colored stones." },
      { q: "How do I find my size?", a: <>Use the <a href="#sizes">size guide</a> above for bracelets. For rings, any jeweler can measure you for free. Not sure? Send us your measurement and we&apos;ll size it for you.</> },
    ],
  },
  {
    group: "Jewelers & shipping",
    items: [
      { q: "I'm a jeweler. Can I order only the 3D file?", a: "Yes. We deliver cast-ready 3D models and castable prints, so you can cast and finish the piece yourself." },
      { q: "Do you ship outside Los Angeles?", a: "Yes, across the US and worldwide. You can also pick up your piece in Los Angeles." },
    ],
  },
];

// Business details for search engines (Google rich results).
const BUSINESS_LD = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: "OG Customs LA",
  description: "Custom jewelry made to order in Los Angeles: designed in 3D and cast in gold or silver, or delivered as cast-ready 3D files.",
  email: EMAIL,
  address: { "@type": "PostalAddress", addressLocality: "Los Angeles", addressRegion: "CA", addressCountry: "US" },
  areaServed: "Worldwide",
  sameAs: ["https://www.instagram.com/ogcustomsla", "https://www.facebook.com/ogcustomsla"],
};


function Strip({ label, images }: { label: string; images: [string, string, string][] }) {
  return (
    <div className="strip" aria-label={label} data-stagger="zoom">
      {images.map(([src, alt, cap], i) => (
        <Fragment key={src}>
          {i > 0 && <div className="arrow" aria-hidden="true">→</div>}
          <figure><img src={src} alt={alt} loading="lazy" decoding="async" /><figcaption><span>{i + 1}</span>{cap}</figcaption></figure>
        </Fragment>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main id="home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BUSINESS_LD) }} />
      <section className="hero">
        <div className="wrap">
          <div className="hero-intro" data-reveal>
            <p className="label"><span className="live-dot" aria-hidden="true" />Live jewelry designer</p>
            <h1 className="sr-only">OG Customs LA — custom name pendants, earrings and rings, handmade in Los Angeles</h1>
            <p className="hero-sub">Pick a piece, add your name or initials and choose your diamonds. Our professional team will make it by hand in Los Angeles.</p>
          </div>
          <div className="hero-grid solo">
            <JewelryDesigner />
          </div>
        </div>
      </section>

      <Ticker />

      <section className="block" id="work">
        <div className="wrap">
          <div className="head" data-reveal>
            <div><p className="label">Real orders, real results</p><h2>Sketch it. <span className="g">Wear it.</span></h2></div>
            <p className="sub">Each of these started as something a client sent us. Here&apos;s exactly what it became.</p>
          </div>
          <div className="strip-intro" data-reveal>
            <p className="label">From your drawing</p>
            <h2>Drew it on paper? <span className="g">We&apos;ll cast it in gold.</span></h2>
            <p>Send a sketch, even a rough one, or just describe it. We design the rest.</p>
          </div>
          <Strip
            label="A portrait pendant from sketch to finished gold"
            images={[
              ["/images/jesus-sketch.jpg", "Colored pencil sketch of a pendant portrait", "Your sketch"],
              ["/images/jesus-3d-print.jpg", "The pendant as a detailed blue 3D printed model", "3D model & print"],
              ["/images/jesus-gold.jpg", "The finished pendant cast in polished gold", "Finished in gold"],
            ]}
          />
          <div className="divider" aria-hidden="true"><span></span></div>
          <div className="strip-intro second" data-reveal>
            <p className="label">From a real photo</p>
            <h2>Got a photo? <span className="g">We&apos;ll make it in silver.</span></h2>
            <p>A coin, a logo, a face, anything you can take a picture of.</p>
          </div>
          <Strip
            label="A coin from a real photo to finished silver"
            images={[
              ["/images/coin-photo.jpg", "Photo of a 1922 silver dollar sent by a client", "Your photo"],
              ["/images/coin-3d-print.jpg", "The coin rebuilt as a blue 3D printed model", "3D model & print"],
              ["/images/coin-silver.jpg", "The finished coin piece in polished silver", "Finished in silver"],
            ]}
          />
          <div className="divider" aria-hidden="true"><span></span></div>
          <div className="strip-intro second" data-reveal>
            <p className="label">From your handwriting</p>
            <h2>Wrote a name? <span className="g">We&apos;ll cast it in gold.</span></h2>
            <p>Every curve of the letters and every bead carried from the sketch into the finished pendant.</p>
          </div>
          <Strip
            label="A name pendant from a pencil sketch to finished gold"
            images={[
              ["/images/elena-sketch.jpg", "Pencil sketch of a script name pendant reading Elena", "Your sketch"],
              ["/images/elena-3d-print.jpg", "The Elena pendant as a blue 3D printed model", "3D model & print"],
              ["/images/elena-gold.jpg", "The finished Elena pendant in polished gold", "Finished in gold"],
            ]}
          />
        </div>
      </section>

      <section className="avail-teaser" data-reveal>
        <div className="wrap">
          <div>
            <p className="label"><span className="live-dot" aria-hidden="true" />Available now</p>
            <h2>Ready to wear. <span className="g">One of one.</span></h2>
            <p className="sub">Finished pieces from our studio, ready to ship. When it&apos;s gone, it&apos;s gone.</p>
          </div>
          <Link href="/available" className="btn">Shop available pieces</Link>
        </div>
      </section>

      <section className="block" id="make">
        <div className="wrap">
          <div className="head" data-reveal>
            <div><p className="label">Bespoke design</p><h2>What we <span className="g">make</span></h2></div>
            <p className="sub">Made one at a time, for one person. Your idea, your size, your piece.</p>
          </div>
          <div className="make" data-stagger="zoom">
            {MAKE.map(m => (
              <article key={m.t}>{m.icon}<h3>{m.t}</h3><p>{m.p}</p></article>
            ))}
          </div>
          <div className="choose" data-stagger="alt">
            <div>
              <p className="label">For you</p>
              <h3>The finished piece</h3>
              <p>Cast in gold or silver, with diamonds or stones if you want them, then hand-polished and delivered.</p>
            </div>
            <div>
              <p className="label">For jewelers</p>
              <h3>The cast-ready 3D file</h3>
              <p>Just the design: a precise 3D model or castable print, ready to send to your own caster.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="block" id="sizes">
        <div className="wrap">
          <div className="head" data-reveal>
            <div><p className="label">Size guide</p><h2>How to <span className="g">measure</span></h2></div>
            <p className="sub">Three quick steps with a soft tape. The size finder does the rest.</p>
          </div>

          <ol className="how" data-stagger="">
            <li>
              <svg viewBox="0 0 160 110" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path stroke="#141414" d="M58 108V70c-6-6-12-16-10-24 2-6 8-4 10 2l4 10V18c0-4 6-4 6 0v26M68 16c0-4 6-4 6 0v28M74 18c0-4 6-4 6 0v26M80 22c0-4 6-4 6 0v40c0 8-4 12-6 14v32" />
                <path stroke="#A8854F" fill="#EFE6D6" d="M56 80c8 4 22 4 32 0l2 9c-10 4-26 4-35 0z" />
                <path stroke="#A8854F" d="M90 84l34 12-3 7-33-12" />
                <path stroke="#A8854F" d="M98 88l-1 3M106 91l-1 3M114 94l-1 3" />
              </svg>
              <h3><span>1</span>Wrap</h3>
              <p>Wrap a soft tape just below the wrist bone.</p>
            </li>
            <li>
              <svg viewBox="0 0 160 110" fill="none" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <ellipse stroke="#141414" cx="80" cy="60" rx="34" ry="24" fill="#F1F1EC" />
                <ellipse stroke="#A8854F" cx="80" cy="60" rx="44" ry="33" />
                <ellipse stroke="#A8854F" cx="80" cy="60" rx="41" ry="30" strokeDasharray="2 4" />
                <circle stroke="#141414" cx="80" cy="30" r="6" fill="#F7F7F3" />
                <path stroke="#141414" d="M86 28l26-14h10" />
              </svg>
              <h3><span>2</span>Check</h3>
              <p>Snug, not tight. One finger should slip under the tape.</p>
            </li>
            <li>
              <svg viewBox="0 0 160 110" fill="none" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <rect stroke="#141414" x="18" y="44" width="124" height="22" />
                <rect fill="#EFE6D6" stroke="none" x="104" y="45" width="37" height="20" />
                <path stroke="#141414" d="M28 44v8M38 44v5M48 44v8M58 44v5M68 44v8M78 44v5M88 44v8M98 44v5M108 44v8M118 44v5M128 44v8" />
                <path stroke="#141414" d="M18 34v-6h86v6" />
                <path stroke="#A8854F" d="M104 34v-6h38v6" />
                <path stroke="#A8854F" d="M22 82h116M22 82l6-4M22 82l6 4M138 82l-6-4M138 82l-6 4" />
              </svg>
              <h3><span>3</span>Add your fit</h3>
              <p>Choose how loose you like it. The finder adds the extra room.</p>
            </li>
          </ol>

          <div className="fitrow" data-stagger="alt">
            <SizeFinder />
            <div className="card chart">
              <h3>Quick chart</h3>
              <p className="hint">Bracelet length to order, with comfort fit included.</p>
              <div className="chips">
                {[["XS", "6″", "15 cm"], ["S", "6.5″", "16.5 cm"], ["M", "7″", "18 cm"], ["L", "7.5″", "19 cm"], ["XL", "8″", "20 cm"], ["XXL", "8.5″", "21.5 cm"]].map(([s, i, c]) => (
                  <div key={s}><b>{s}</b><span>{i}</span><small>{c}</small></div>
                ))}
              </div>
              <div className="bangle">
                <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.6" aria-hidden="true"><circle cx="20" cy="20" r="16" stroke="#141414" /><circle cx="20" cy="20" r="12" stroke="#A8854F" /></svg>
                <p><b>Ordering a bangle?</b> It has to slide over your hand. Tuck your thumb in, measure around the widest part of your hand, and send us the number.</p>
              </div>
            </div>
          </div>
          <p className="sub" style={{ marginTop: "1.75rem", color: "var(--muted)" }}>Between sizes? Choose the larger one. Not sure? Send us your measurement and we&apos;ll size it for you.</p>
        </div>
      </section>

      <section className="block faq" id="faq">
        <div className="wrap faq-grid">
          <aside className="faq-side" data-reveal>
            <p className="label">FAQ</p>
            <h2>Questions, <span className="g">answered</span></h2>
            <p className="faq-lead">Everything you need to know before you order. Can&apos;t find your answer? Ask us directly.</p>
            <div className="faq-card">
              <p className="opt-label">Still have a question?</p>
              <a className="faq-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <Link href="/order" className="btn">Start an order</Link>
            </div>
          </aside>
          <div className="faq-list" data-stagger="">
            {FAQ.map(g => (
              <Fragment key={g.group}>
                <p className="faq-group">{g.group}</p>
                {g.items.map(it => (
                  <details key={it.q} open={it.open}>
                    <summary>{it.q}</summary>
                    <div className="ans"><p>{it.a}</p></div>
                  </details>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="contact">
        <div className="wrap contact" data-stagger="alt">
          <div className="info">
            <p className="label">Start an order</p>
            <h2>Tell us your <span className="g">idea</span></h2>
            <p style={{ color: "var(--muted)", maxWidth: "40ch", margin: "1.25rem 0 0" }}>We reply with questions, a quote and a timeline. No commitment until you approve the design.</p>
            <dl>
              <dt>Email</dt>
              <dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd>
              <dt>Studio</dt>
              <dd>Los Angeles, CA<br /><span style={{ color: "var(--muted)" }}>Beverly Hills area</span></dd>
              <dt>Hours</dt>
              <dd>By appointment</dd>
              <dt>Follow</dt>
              <dd>
                <div className="social">
                  <a href="https://www.instagram.com/ogcustomsla" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r=".8" fill="currentColor" /></svg></a>
                  <a href="https://www.facebook.com/ogcustomsla" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="M13.2 19v-5.6h1.9l.3-2.2h-2.2V9.8c0-.6.2-1.1 1.1-1.1h1.2V6.8c-.2 0-.9-.1-1.8-.1-1.8 0-3 1.1-3 3.1v1.6H8.8v2.2h1.9V19z" fill="var(--bg)" /></svg></a>
                  <span>@OgCustomsLa</span>
                </div>
              </dd>
            </dl>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
