import { NextResponse } from "next/server";

/**
 * Receives contact and order requests.
 * Set ORDER_WEBHOOK_URL (e.g. a Zapier / Make / Formspree / Slack webhook) to forward them.
 * Without it the route answers 503 and the page offers an email link instead.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const url = process.env.ORDER_WEBHOOK_URL;
  if (!url) return NextResponse.json({ ok: false, error: "Not configured" }, { status: 503 });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
