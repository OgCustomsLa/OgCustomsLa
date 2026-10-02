import { BILL_BACK, BILL_FRONT } from "@/lib/site";

/*
 * $100 bills fluttering down across the full width of the top bar, behind the logo and links.
 * Positions are fixed (not random) so server and client render the same bills. They loop
 * forever; the mixed durations keep the rain from falling in sync.
 */
const BILLS = [
  { x: 1, w: 46, d: 3.4, delay: 0.4, drift: 18, tilt: -18 },
  { x: 7, w: 38, d: 3.9, delay: 2.1, drift: -14, tilt: 24 },
  { x: 13, w: 50, d: 3.1, delay: 0.9, drift: 12, tilt: -30 },
  { x: 19.5, w: 40, d: 3.7, delay: 2.8, drift: -18, tilt: 14 },
  { x: 26, w: 48, d: 3.3, delay: 0.1, drift: 16, tilt: -12 },
  { x: 32, w: 36, d: 4.0, delay: 1.6, drift: -12, tilt: 32 },
  { x: 38, w: 50, d: 3.0, delay: 2.4, drift: 18, tilt: -26 },
  { x: 44, w: 40, d: 3.8, delay: 0.6, drift: -16, tilt: 20 },
  { x: 50, w: 46, d: 3.5, delay: 1.9, drift: 12, tilt: -16 },
  { x: 56, w: 38, d: 3.2, delay: 3.0, drift: -18, tilt: 26 },
  { x: 62, w: 50, d: 3.6, delay: 0.3, drift: 16, tilt: -22 },
  { x: 68, w: 40, d: 3.1, delay: 1.3, drift: -14, tilt: 18 },
  { x: 74, w: 46, d: 3.9, delay: 2.6, drift: 14, tilt: -28 },
  { x: 80, w: 38, d: 3.4, delay: 0.8, drift: -16, tilt: 12 },
  { x: 86, w: 50, d: 3.0, delay: 2.0, drift: 18, tilt: -20 },
  { x: 92, w: 42, d: 3.7, delay: 1.1, drift: -12, tilt: 28 },
  { x: 97, w: 44, d: 3.3, delay: 2.9, drift: 10, tilt: -14 },
];

export default function HeaderBills() {
  return (
    <div className="top-bills" aria-hidden="true">
      {BILLS.map((b, i) => (
        <span
          key={i}
          className="bill"
          style={{
            "--x": `${b.x}%`, "--w": `${b.w}px`, "--d": `${b.d}s`,
            "--delay": `${b.delay}s`, "--drift": `${b.drift}px`, "--tilt": `${b.tilt}deg`,
          } as React.CSSProperties}
        >
          <img src={i % 2 ? BILL_BACK : BILL_FRONT} alt="" draggable={false} />
        </span>
      ))}
    </div>
  );
}
