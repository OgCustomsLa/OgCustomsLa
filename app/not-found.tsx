import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="nf">
      <div className="wrap">
        <p className="label">404 · Page not found</p>
        <h1 className="op-title">This piece doesn&apos;t <span className="g">exist yet.</span></h1>
        <p className="nf-sub">The page you&apos;re looking for isn&apos;t here — but if you can imagine it, we can make it.</p>
        <div className="nf-ctas">
          <Link href="/order" className="btn">Start an order</Link>
          <Link href="/" className="btn ghost">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
