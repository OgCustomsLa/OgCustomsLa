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
