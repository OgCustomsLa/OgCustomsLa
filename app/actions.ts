"use server";

import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/database.types";

/*
 * Form submissions. Visitors aren't signed in: the server saves rows with the publishable key,
 * and the database only lets that role INSERT (see supabase/migrations). Inputs are checked here
 * for friendly error messages; the table CHECK constraints enforce the same rules again.
 */

/** `fallback` is set when the input was fine but saving failed, so the page can offer email instead. */
export type SubmitResult = { ok: true } | { ok: false; error: string; fallback?: boolean };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const URL_RE = /^https?:\/\//i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Trimmed text, or null when empty. Throws a readable message when over `max`. */
function text(value: unknown, label: string, max: number): string | null {
  const s = typeof value === "string" ? value.trim() : "";
  if (s.length > max) throw new Error(`${label} is too long (max ${max} characters).`);
  return s || null;
}

function required(value: unknown, label: string, max: number): string {
  const s = text(value, label, max);
  if (!s) throw new Error(`${label} is required.`);
  return s;
}

function result(table: string, error: { message: string } | null): SubmitResult {
  if (!error) return { ok: true };
  console.error(`[supabase] insert into ${table} failed:`, error.message);
  return { ok: false, error: "We couldn't save your request.", fallback: true };
}

export type InquiryInput = { name: string; email: string; phone?: string; type?: string; metal?: string; message: string };

export async function submitInquiry(input: InquiryInput): Promise<SubmitResult> {
  let row: TablesInsert<"inquiries">;
  try {
    const email = required(input.email, "Email", 320);
    if (!EMAIL_RE.test(email)) throw new Error("Check the email address — it looks incomplete.");
    row = {
      name: required(input.name, "Name", 200),
      email,
      phone: text(input.phone, "Phone", 50),
      piece_type: text(input.type, "Piece", 100),
      metal: text(input.metal, "Metal", 100),
      message: required(input.message, "Description", 5000),
    };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert(row);
  return result("inquiries", error);
}

export type OrderInput = {
  piece: string; deliver: string; startFrom: string; nameText?: string; description?: string; photosLink?: string;
  metal?: string; karat?: string; stones?: string; sizeLabel?: string; size?: string; pieceSize?: string;
  finish?: string; engraving?: string; budget: string; needBy?: string;
  customerName: string; email: string; phone?: string; instagram?: string; contactBy: string;
  delivery?: string; location?: string;
};

export async function submitOrder(input: OrderInput): Promise<SubmitResult> {
  let row: TablesInsert<"orders">;
  try {
    const email = required(input.email, "Email", 320);
    if (!EMAIL_RE.test(email)) throw new Error("Add a valid email so we can send your quote.");
    const photosLink = text(input.photosLink, "Photo link", 2000);
    if (photosLink && !URL_RE.test(photosLink)) throw new Error("The link should start with http:// or https://");
    const needBy = text(input.needBy, "Date", 10);
    if (needBy && !DATE_RE.test(needBy)) throw new Error("Check the date.");
    const description = text(input.description, "Description", 5000);
    const nameText = text(input.nameText, "Name on the piece", 100);
    if (!description && !nameText) throw new Error("Add a short description of your piece.");
    row = {
      piece: required(input.piece, "Piece", 100),
      deliver: required(input.deliver, "What we make", 100),
      start_from: required(input.startFrom, "Starting point", 100),
      name_text: nameText,
      description,
      photos_link: photosLink,
      metal: text(input.metal, "Metal", 100),
      karat: text(input.karat, "Karat", 100),
      stones: text(input.stones, "Stones", 100),
      size_label: text(input.sizeLabel, "Size", 100),
      size: text(input.size, "Size", 100),
      piece_size: text(input.pieceSize, "Piece size", 200),
      finish: text(input.finish, "Finish", 100),
      engraving: text(input.engraving, "Engraving", 100),
      budget: required(input.budget, "Budget", 100),
      need_by: needBy,
      customer_name: required(input.customerName, "Name", 200),
      email,
      phone: text(input.phone, "Phone", 50),
      instagram: text(input.instagram, "Instagram", 100),
      contact_by: required(input.contactBy, "Contact method", 50),
      delivery: text(input.delivery, "Delivery", 100),
      location: text(input.location, "Location", 200),
    };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("orders").insert(row);
  return result("orders", error);
}
