import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/about" className="logo" aria-label="About OG Customs LA">
      <span className="og">OG</span>
      <span className="bar"></span>
      <span className="cu">
        Customs
        <span className="cu-pend" aria-hidden="true">
          <svg className="chains" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path d="M17 0 L50 19 M88 0 L50 19" fill="none" stroke="#A8854F" strokeWidth="1.2" strokeDasharray="1.2 2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          <svg className="ak" viewBox="0 0 60 20">
            <defs>
              <linearGradient id="akg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F3DC93" />
                <stop offset=".5" stopColor="#C29A3E" />
                <stop offset="1" stopColor="#8C6A22" />
              </linearGradient>
            </defs>
            <circle cx="30" cy="2.6" r="1.8" fill="none" stroke="#A8854F" strokeWidth=".9" />
            <g fill="url(#akg)" stroke="#7E6233" strokeWidth=".35">
              <path d="M1 7.5L12 5.5l2.5 2.5-.8 3.2L3 12.6z" />
              <rect x="14" y="5.8" width="22" height="4.4" rx=".6" />
              <rect x="36" y="6.6" width="22" height="1.5" />
              <rect x="36" y="5" width="11" height="1.3" />
              <rect x="52.5" y="4.6" width="1.2" height="2" />
              <path d="M26 10.2q1 5 5 7.8l3-1.6q-2.8-2.6-3.4-6.2z" />
              <path d="M19.5 10.2l-2 5h3l2-5z" />
            </g>
          </svg>
        </span>
      </span>
      <span className="la">LA</span>
    </Link>
  );
}
