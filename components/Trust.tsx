import { PAY_PATHS } from "@/lib/payLogos";

const Mark = ({ d, fill, size = 20 }: { d: string; fill: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path fill={fill} d={d} /></svg>
);

/** The payment methods we accept, as current brand logos on clean white cards. */
export function PayBadges({ className = "" }: { className?: string }) {
  return (
    <ul className={"pay-badges " + className} aria-label="Payment methods we accept">
      <li className="pb" aria-label="Visa"><Mark d={PAY_PATHS.visa} fill="#1A1F71" size={34} /></li>
      <li className="pb" aria-label="Mastercard">
        <svg viewBox="0 0 38 24" width={34} height={22} aria-hidden="true">
          <circle cx="14" cy="12" r="9" fill="#EB001B" /><circle cx="24" cy="12" r="9" fill="#F79E1B" />
          <path d="M19 4.5a9 9 0 0 1 0 15 9 9 0 0 1 0-15z" fill="#FF5F00" />
        </svg>
      </li>
      <li className="pb" aria-label="American Express"><Mark d={PAY_PATHS.amex} fill="#2E77BC" size={28} /></li>
      <li className="pb" aria-label="Apple Pay"><Mark d={PAY_PATHS.applepay} fill="#000" size={36} /></li>
      <li className="pb" aria-label="Google Pay"><Mark d={PAY_PATHS.googlepay} fill="#3C4043" size={36} /></li>
      <li className="pb pb-wide" aria-label="PayPal"><Mark d={PAY_PATHS.paypal} fill="#003087" size={15} /><b style={{ color: "#003087" }}>PayPal</b></li>
      <li className="pb pb-wide" aria-label="Zelle" style={{ background: "#6D1ED4", borderColor: "#6D1ED4" }}><Mark d={PAY_PATHS.zelle} fill="#fff" size={14} /><b style={{ color: "#fff" }}>Zelle</b></li>
      <li className="pb pb-wide" aria-label="Cash App"><Mark d={PAY_PATHS.cashapp} fill="#00D632" size={17} /><b style={{ color: "#111" }}>Cash App</b></li>
      <li className="pb pb-wide" aria-label="Klarna" style={{ background: "#FFB3C7", borderColor: "#FFB3C7" }}><b style={{ color: "#0B051D", fontSize: ".8rem" }}>Klarna.</b></li>
      <li className="pb pb-wide" aria-label="Affirm">
        <svg viewBox="0 0 48 22" width={44} height={20} aria-hidden="true">
          <path d="M23.5 5.2c5.6-4 14.6-4 20.4.6" fill="none" stroke="#4A4AF4" strokeWidth="2.4" strokeLinecap="round" />
          <text x="0" y="19" fontFamily="Helvetica Neue,Arial,sans-serif" fontWeight="700" fontSize="15" fill="#060809" letterSpacing="-.4">affirm</text>
        </svg>
      </li>
      <li className="pb pb-wide" aria-label="Afterpay" style={{ background: "#B2FCE4", borderColor: "#B2FCE4" }}><Mark d={PAY_PATHS.afterpay} fill="#000" size={15} /><b style={{ color: "#000" }}>afterpay</b></li>
    </ul>
  );
}
