import type { Metadata } from "next";
import Link from "next/link";
import { EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: "About — OG Customs LA" };

export default function AboutPage() {
  return (
    <section className="ab">
      <div className="wrap">
        <Link href="/" className="op-back">← Back to site</Link>
        <div className="ab-hero">
          <div>
            <p className="label">About us</p>
            <h1 className="op-title">OG Customs LA <span className="g">3D Jewelry Studio</span></h1>
            <p className="ab-lead">We&apos;re a custom jewelry studio in Los Angeles. We take your sketch, your photo or just your idea, design it in 3D, and turn it into a real piece in gold or silver.</p>
            <Link href="/order" className="btn">Start an order</Link>
          </div>
        </div>

        <div className="ab-values">
          <div>
            <svg viewBox="0 0 32 32" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 25l3-1 13-13-2-2L8 22z" stroke="#141414" /><path d="M6 28h20" stroke="#A8854F" /></svg>
            <h3>Made for one person</h3>
            <p>No catalog and no copies. Every piece starts from your idea and is made only for you.</p>
          </div>
          <div>
            <svg viewBox="0 0 32 32" fill="none" strokeWidth="1.6" strokeLinejoin="round"><path d="M16 4l11 6v12l-11 6-11-6V10z" stroke="#141414" /><path d="M5 10l11 6 11-6M16 16v12" stroke="#A8854F" /></svg>
            <h3>Designed in 3D</h3>
            <p>We model every detail digitally, so you see your piece and approve it before anything is cast.</p>
          </div>
          <div>
            <svg viewBox="0 0 32 32" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="18" r="9" stroke="#141414" /><path d="M12 6l2-3h4l2 3-4 4zM12 6h8" stroke="#A8854F" /></svg>
            <h3>Finished in metal</h3>
            <p>Cast in gold or silver, set with stones if you want them, and polished by hand.</p>
          </div>
        </div>

        <div className="ab-two">
          <div>
            <p className="label">Who we work with</p>
            <h2>People <span className="g">and jewelers</span></h2>
          </div>
          <div className="ab-list">
            <p><b>For you.</b> Name pendants, portraits, rings, earrings and bracelets — gifts, memorials, or something just for yourself.</p>
            <p><b>For jewelers.</b> Cast-ready 3D files and castable prints, so you can offer custom work without designing it yourself.</p>
            <p><b>From anywhere.</b> Based in Los Angeles, shipping across the US and worldwide.</p>
          </div>
        </div>

        <div className="ab-cta">
          <h2>Your vision. <span className="g">Our expertise.</span></h2>
          <div className="ab-cta-row">
            <Link href="/order" className="btn">Start an order</Link>
            <a href={`mailto:${EMAIL}`} className="btn ghost">Email us</a>
          </div>
          <p className="ab-social">Follow our work <b>@OgCustomsLa</b> on Instagram and Facebook</p>
        </div>
      </div>
    </section>
  );
}
