/**
 * Faint street-life backdrop behind the whole site: cash stacks, $100 bills, dice, gold chain links
 * and diamonds slowly drifting up. Pure CSS animation, no JavaScript; fewer pieces on phones and
 * standing still for visitors who prefer reduced motion.
 */

type Kind = "bill" | "stack" | "die" | "link" | "gem";
// [kind, left %, size px, duration s, delay s, start rotation deg, hidden on phones]
const ITEMS: [Kind, number, number, number, number, number, boolean?][] = [
  ["stack", 4, 70, 46, -4, -12],
  ["die", 14, 38, 38, -20, 18, true],
  ["bill", 24, 96, 52, -33, 24],
  ["gem", 35, 30, 40, -9, 0, true],
  ["link", 46, 56, 48, -27, -30],
  ["die", 57, 34, 42, -2, -8],
  ["bill", 66, 88, 56, -15, -20, true],
  ["gem", 76, 26, 36, -24, 10],
  ["stack", 86, 64, 50, -38, 14, true],
  ["die", 94, 30, 44, -12, 30],
];

function Art({ kind }: { kind: Kind }) {
  if (kind === "bill") return <img src="/images/bill-100-front.png" alt="" />;
  if (kind === "stack") return (
    <svg viewBox="0 0 80 52">
      {[0, 1, 2, 3].map(i => <rect key={i} x={4 + i * 1.5} y={30 - i * 7} width="70" height="16" rx="2" fill="#7FA36B" stroke="#3F5E33" strokeWidth="1.2" />)}
      <rect x="8.5" y="9" width="70" height="16" rx="2" fill="#9CC287" stroke="#3F5E33" strokeWidth="1.2" />
      <rect x="38" y="9" width="10" height="16" fill="#E9DFC0" stroke="#A8854F" strokeWidth="1" />
      <circle cx="22" cy="17" r="4" fill="none" stroke="#3F5E33" strokeWidth="1.2" />
    </svg>
  );
  if (kind === "die") return (
    <svg viewBox="0 0 40 40">
      <rect x="3" y="3" width="34" height="34" rx="7" fill="#FBFAF6" stroke="#141414" strokeWidth="1.6" />
      {[[12, 12], [28, 12], [20, 20], [12, 28], [28, 28]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill={i === 2 ? "#B4442F" : "#141414"} />)}
    </svg>
  );
  if (kind === "link") return (
    <svg viewBox="0 0 64 30" fill="none" strokeWidth="5">
      <rect x="3" y="5" width="30" height="20" rx="10" stroke="#C9A24E" />
      <rect x="31" y="5" width="30" height="20" rx="10" stroke="#E2C27A" />
    </svg>
  );
  return (
    <svg viewBox="0 0 30 26">
      <path d="M7 2h16l6 7-14 15L1 9z" fill="#EAF2F7" stroke="#7F95A3" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M1 9h28M11 2l-3 7 7 15 7-15-3-7" fill="none" stroke="#9FB3BF" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

export default function StreetBackdrop() {
  return (
    <div className="street-bg" aria-hidden="true">
      {ITEMS.map(([kind, left, size, dur, delay, rot, phoneHide], i) => (
        <span
          key={i}
          className={"sb " + kind + (phoneHide ? " sb-wide" : "")}
          style={{ left: `${left}%`, width: size, animationDuration: `${dur}s`, animationDelay: `${delay}s`, ["--r" as string]: `${rot}deg` }}
        >
          <Art kind={kind} />
        </span>
      ))}
    </div>
  );
}
