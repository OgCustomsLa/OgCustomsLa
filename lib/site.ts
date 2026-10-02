export const EMAIL = "OGcustomsLA@gmail.com";

/** Key used to hand a design from the name designer over to the order page. */
export const DESIGN_KEY = "og-design";

export type DesignPrefill = {
  piece: string;
  name: string;
  desc: string;
  metal: string;
  stones: string;
};

/**
 * Sends a request to /api/request. Resolves true only when the server accepted it;
 * callers fall back to a mailto link otherwise.
 */
export async function sendRequest(kind: "inquiry" | "order", data: Record<string, string>) {
  try {
    const res = await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, data: { ...data, createdAt: new Date().toISOString() } }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function mailto(subject: string, body: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
