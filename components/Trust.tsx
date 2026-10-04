/** Trust signals: the "secure checkout / pay over time" strip and the payment methods we accept. */

const I = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

/** Small badge for each payment method (simple marks in each brand's colours). */
export function PayBadges({ className = "" }: { className?: string }) {
  return (
    <ul className={"pay-badges " + className} aria-label="Payment methods we accept">
      <li className="pb visa" aria-label="Visa"><b>VISA</b></li>
      <li className="pb mc" aria-label="Mastercard"><svg viewBox="0 0 38 24" aria-hidden="true"><circle cx="14" cy="12" r="8" fill="#EB001B" /><circle cx="24" cy="12" r="8" fill="#F79E1B" /><path d="M19 5.8a8 8 0 0 1 0 12.4 8 8 0 0 1 0-12.4z" fill="#FF5F00" /></svg></li>
      <li className="pb amex" aria-label="American Express"><b>AMEX</b></li>
      <li className="pb apple" aria-label="Apple Pay"><svg viewBox="0 0 16 20" aria-hidden="true"><path fill="#fff" d="M13.3 10.6c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.9-.8C4.3 5.5 2.9 6.4 2.1 7.8c-1.6 2.8-.4 6.9 1.1 9.1.8 1.1 1.7 2.3 2.9 2.3 1.1 0 1.6-.7 2.9-.7 1.4 0 1.7.7 2.9.7 1.2 0 2-1.1 2.7-2.2.9-1.3 1.2-2.5 1.2-2.6 0 0-2.4-.9-2.5-3.8zM11.1 3.9c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.7-1 2.8 1 .1 2.1-.5 2.8-1.3z" /></svg><b>Pay</b></li>
      <li className="pb gpay" aria-label="Google Pay"><b><span style={{ color: "#4285F4" }}>G</span> Pay</b></li>
      <li className="pb paypal" aria-label="PayPal"><b><span>Pay</span><span>Pal</span></b></li>
      <li className="pb zelle" aria-label="Zelle"><b>Zelle</b></li>
      <li className="pb cashapp" aria-label="Cash App"><b>$</b><small>Cash App</small></li>
      <li className="pb klarna" aria-label="Klarna"><b>Klarna.</b></li>
      <li className="pb affirm" aria-label="Affirm"><b>affirm</b></li>
      <li className="pb afterpay" aria-label="Afterpay"><b>afterpay</b></li>
    </ul>
  );
}

/** Strip of reasons to trust us, shown under the designer. */
export function TrustBar() {
  return (
    <section className="trust" aria-label="Why order with us">
      <ul className="wrap trust-row" data-stagger="">
        <li>
          <svg {...I}><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15.5" r="1.3" /></svg>
          <div><b>Secure checkout</b><span>Cards, Apple Pay, Google Pay, PayPal</span></div>
        </li>
        <li>
          <svg {...I}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 9.5h17M8 3v4M16 3v4M8 13.5h2M14 13.5h2M8 16.5h2" /></svg>
          <div><b>Pay over time</b><span>Klarna · Affirm · Afterpay</span></div>
        </li>
        <li>
          <svg {...I}><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></svg>
          <div><b>Handmade in Los Angeles</b><span>Designed in 3D, finished by hand</span></div>
        </li>
        <li>
          <svg {...I}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.3 3.6 8.5s-1.1 5.9-3.6 8.5c-2.5-2.6-3.6-5.3-3.6-8.5S9.5 6.1 12 3.5z" /></svg>
          <div><b>Ships worldwide</b><span>From our studio to your door</span></div>
        </li>
      </ul>
    </section>
  );
}
