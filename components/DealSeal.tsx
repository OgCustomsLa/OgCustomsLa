/** Discount tag on a piece's photo: a red brush-stroke swoosh with the discount painted on it. */
export default function DealSeal({ deal, big = false }: { deal: number; big?: boolean }) {
  return (
    <span className={"deal-swoosh" + (big ? " big" : "")} role="img" aria-label={`${deal}% off`}>
      <svg viewBox="0 0 200 92" aria-hidden="true">
        {/* brush stroke: thin start on the left, thick across, hooking down into a tapered tail */}
        <path className="ds-stroke" d="M4 34C34 15 104 9 160 17C186 21 199 33 193 47C187 61 161 69 124 86C150 67 170 58 174 47C178 37 164 34 142 35C100 37 52 46 4 34Z" />
        {/* lighter streaks so it reads as paint */}
        <path d="M18 31C54 21 110 17 156 22" fill="none" stroke="#FF6A5C" strokeWidth="2.2" strokeLinecap="round" opacity=".55" />
        <path d="M40 39C80 33 120 30 150 31" fill="none" stroke="#8E1A12" strokeWidth="1.6" strokeLinecap="round" opacity=".45" />
        <text x="92" y="35" textAnchor="middle" transform="rotate(-3 92 31)">{deal}% OFF</text>
      </svg>
    </span>
  );
}
