import type { Metadata, Viewport } from "next";
import Link from "next/link";
import HeaderBills from "@/components/HeaderBills";
import Logo from "@/components/Logo";
import "./globals.css";

export const metadata: Metadata = {
  title: "OG Customs LA — 3D Jewelry Studio, Los Angeles",
  description:
    "Custom jewelry made to order in Los Angeles. Send a sketch, a photo or an idea — we design it in 3D and cast it in gold or silver.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Loaded by family name (not next/font) because the name designer draws these fonts on a canvas by name. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&family=Yellowtail&family=Pirata+One&family=Lobster&family=Satisfy&family=Cinzel:wght@700&family=Bungee&family=Outfit:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="top">
          <HeaderBills />
          <div className="wrap">
            <Logo />
            <nav className="main" aria-label="Main">
              <Link href="/#make">What we make</Link>
              <Link href="/#process">How it works</Link>
              <Link href="/#sizes">Size guide</Link>
              <Link href="/#contact">Contact</Link>
            </nav>
            <Link href="/order" className="btn">Start an order</Link>
          </div>
        </header>

        {children}

        <footer>
          <div className="wrap">
            <Logo />
            <p className="label">Your vision. Our expertise.</p>
            <small>© {new Date().getFullYear()} OG Customs LA · 3D Jewelry Studio · Los Angeles</small>
          </div>
        </footer>
      </body>
    </html>
  );
}
