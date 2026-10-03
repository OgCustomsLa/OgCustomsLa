/** Shared bits of the designer window: the dark header strip and small option icons. */

export function DesignerHead() {
  return (
    <div className="np-head">
      <span className="np-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><path d="M7 5h10l3.5 4L12 20 3.5 9z M3.5 9h17 M9.5 5L8 9l4 11 4-11-1.5-4" /></svg>
      </span>
      <p className="np-title">Design your piece<span>See it as you build it</span></p>
      <span className="live">Live</span>
    </div>
  );
}

const ICON = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export function PieceIcon({ kind }: { kind: "pendant" | "earrings" | "ring" }) {
  if (kind === "pendant") return (
    <svg {...ICON}><path d="M3 2.5c3 5.5 6 7.5 9 7.5s6-2 9-7.5" strokeDasharray="1.6 1.8" /><circle cx="12" cy="11" r="1.3" /><path d="M12 12.5l4.5 4-4.5 6-4.5-6z M7.5 16.5h9" /></svg>
  );
  if (kind === "earrings") return (
    <svg {...ICON}><path d="M7 2.5c2 0 2 3 0 3M17 2.5c2 0 2 3 0 3" /><circle cx="7" cy="7.5" r="1.1" /><circle cx="17" cy="7.5" r="1.1" /><path d="M7 8.8l2.6 4.2L7 21l-2.6-8z M17 8.8l2.6 4.2L17 21l-2.6-8z" /></svg>
  );
  return (
    <svg {...ICON}><circle cx="12" cy="15.5" r="6" /><circle cx="12" cy="15.5" r="4.2" /><path d="M9 4.5h6l2 2.5-5 4-5-4z M7 7h10" /></svg>
  );
}

export function IceIcon({ kind }: { kind: "none" | "line" | "all" }) {
  if (kind === "none") return <svg {...ICON}><path d="M4 16q8 4 16-2" /></svg>;
  if (kind === "line") return <svg {...ICON}><path d="M4 16q8 4 16-2" /><circle cx="7" cy="16.6" r="1.3" fill="currentColor" /><circle cx="12" cy="17.3" r="1.3" fill="currentColor" /><circle cx="17" cy="15.6" r="1.3" fill="currentColor" /></svg>;
  return <svg {...ICON}><path d="M7 5h10l3.5 4L12 20 3.5 9z M3.5 9h17 M9.5 5L8 9l4 11 4-11-1.5-4" /></svg>;
}
