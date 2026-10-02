export default function HeroTitle() {
  return (
    <div className="hero-title">
      <p className="label">Made to order · Los Angeles</p>
      <h1 aria-label="Custom Jewelry" className="intro">
        <span className="w1" aria-hidden="true">
          {"Custom".split("").map((c, i) => (
            <span key={i} className="ch" style={{ "--i": i } as React.CSSProperties}>{c}</span>
          ))}
        </span>{" "}
        <span className="g" aria-hidden="true">Jewelry</span>
      </h1>
      <hr className="rule" />
    </div>
  );
}
