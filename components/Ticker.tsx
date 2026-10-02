/** Scrolling band of materials and promises between the hero and "What we make". */
const ITEMS = [
  "14K & 18K Gold",
  "Sterling Silver 925",
  "Natural & Lab Diamonds",
  "Moissanite",
  "Designed in 3D",
  "Cast & Hand-Polished",
  "Made in Los Angeles",
  "Ships Worldwide",
];

export default function Ticker() {
  const row = (hidden: boolean) => (
    <ul className="ticker-row" aria-hidden={hidden || undefined}>
      {ITEMS.map(t => <li key={t}>{t}</li>)}
    </ul>
  );
  return (
    <div className="ticker" role="region" aria-label="Materials and services">
      <div className="ticker-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
