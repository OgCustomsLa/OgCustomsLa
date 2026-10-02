"use client";

import { useState } from "react";
import { submitInquiry, type SubmitResult } from "@/app/actions";
import { mailto } from "@/lib/site";

type Status = { msg: string; cls?: "ok" | "err"; href?: string };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ msg: "" });
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (!d.name.trim() || !d.email.trim() || !d.message.trim()) { setStatus({ msg: "Add your name, email and a short description to send.", cls: "err" }); return; }
    if (!/^\S+@\S+\.\S+$/.test(d.email.trim())) { setStatus({ msg: "Check the email address — it looks incomplete.", cls: "err" }); return; }
    setSending(true); setStatus({ msg: "Sending…" });
    const res = await submitInquiry({ name: d.name, email: d.email, phone: d.phone, type: d.type, metal: d.metal, message: d.message })
      .catch((): SubmitResult => ({ ok: false, error: "Couldn’t reach our server — refresh the page and send again, or ", fallback: true }));
    setSending(false);
    if (res.ok) { form.reset(); setStatus({ msg: "Request sent. We’ll reply within 1–2 business days.", cls: "ok" }); return; }
    if (!res.fallback) { setStatus({ msg: res.error, cls: "err" }); return; }
    const body = `Name: ${d.name}\nPhone: ${d.phone || "-"}\nEmail: ${d.email}\nPiece: ${d.type}\nMetal: ${d.metal}\n\n${d.message}`;
    setStatus({ msg: res.error.startsWith("Couldn") ? res.error : "The form couldn’t send from here. ", cls: "err", href: mailto("Order request from " + d.name, body) });
  }

  return (
    <form className="inq" noValidate onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="f-name">Name</label>
        <input id="f-name" name="name" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="f-phone">Phone <small>(optional)</small></label>
        <input id="f-phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="field full">
        <label htmlFor="f-email">Email</label>
        <input id="f-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="f-type">Piece</label>
        <select id="f-type" name="type">
          {["Ring", "Pendant", "Earrings", "Bracelet", "3D file only", "Something else"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-metal">Metal</label>
        <select id="f-metal" name="metal">
          {["Gold", "Silver", "Not sure yet"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div className="field full">
        <label htmlFor="f-msg">Describe your idea</label>
        <textarea id="f-msg" name="message" placeholder="What you want made, size, budget, deadline, and a link to any photo or sketch." required></textarea>
      </div>
      <div className="form-foot">
        <button className="btn" type="submit" disabled={sending}>Send request</button>
        <p className={"status" + (status.cls ? " " + status.cls : "")} role="status" aria-live="polite">
          {status.msg}
          {status.href && <a href={status.href}>Email your request instead</a>}
        </p>
      </div>
    </form>
  );
}
