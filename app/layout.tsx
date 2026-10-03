import type { Metadata, Viewport } from "next";
import Link from "next/link";
import DiscountOffer from "@/components/DiscountOffer";
import HeaderBills from "@/components/HeaderBills";
import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";
import RevealOnScroll from "@/components/RevealOnScroll";
import { EMAIL } from "@/lib/site";
import "./globals.css";

const TITLE = "OG Customs LA — 3D Jewelry Studio, Los Angeles";
const DESCRIPTION =
  "Custom jewelry made to order in Los Angeles. Send a sketch, a photo or an idea — we design it in 3D and cast it in gold or silver.";

// Absolute base for share images: set NEXT_PUBLIC_SITE_URL once the domain is live (Vercel's URL is used otherwise).
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s — OG Customs LA" },
  description: DESCRIPTION,
  applicationName: "OG Customs LA",
  keywords: ["custom jewelry", "Los Angeles", "name pendant", "3D jewelry design", "gold pendant", "grillz", "custom chains", "cast-ready 3D files"],
  openGraph: { type: "website", siteName: "OG Customs LA", locale: "en_US", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F1F1EC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Loaded by family name (not next/font) because the name designer draws these fonts on a canvas by name. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&family=Yellowtail&family=Pirata+One&family=Lobster&family=Satisfy&family=Bungee&family=Outfit:wght@600;700;800&family=UnifrakturMaguntia&family=Sedgwick+Ave+Display&family=Great+Vibes&family=Kaushan+Script&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <header className="top">
          <HeaderBills />
          <div className="wrap">
            <Logo />
            <nav className="main" aria-label="Main">
              <Link href="/available" className="nav-avail"><span className="live-dot" aria-hidden="true" />Available</Link>
              <Link href="/#make">What we make</Link>
              <Link href="/#sizes">Size guide</Link>
              <Link href="/#contact">Contact</Link>
            </nav>
            <div className="top-actions">
              <Link href="/order" className="btn">Start an order</Link>
              <MobileMenu />
            </div>
          </div>
        </header>

        <div id="main">{children}</div>

        <footer className="site-foot">
          <div className="wrap foot-grid" data-stagger="">
            <div className="foot-brand">
              <Logo />
              <p className="label">Your vision. Our expertise.</p>
              <p className="foot-blurb">One-of-a-kind jewelry, designed in 3D and cast in gold or silver in Los Angeles. Shipped worldwide.</p>
            </div>
            <nav className="foot-col" aria-label="Footer">
              <p className="foot-h">Explore</p>
              <Link href="/available">Available now</Link>
              <Link href="/#make">What we make</Link>
              <Link href="/#work">Our work</Link>
              <Link href="/#sizes">Size guide</Link>
              <Link href="/about">About us</Link>
              <Link href="/order">Start an order</Link>
            </nav>
            <div className="foot-col">
              <p className="foot-h">Get in touch</p>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a href="https://www.instagram.com/ogcustomsla" target="_blank" rel="noopener">Instagram · @OgCustomsLa</a>
              <a href="https://www.facebook.com/ogcustomsla" target="_blank" rel="noopener">Facebook</a>
              <span>Los Angeles, CA · By appointment</span>
            </div>
          </div>
          <div className="wrap foot-base">
            <small>© {year} OG Customs LA · 3D Jewelry Studio</small>
            <small>Designed in 3D. Finished by hand.</small>
          </div>
        </footer>
        <RevealOnScroll />
        <DiscountOffer />
      </body>
    </html>
  );
}
