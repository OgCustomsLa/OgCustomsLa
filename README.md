# OG Customs LA — Next.js site

Next.js (App Router) version of `OG Customs LA — 3D Jewelry Studio, Los Angeles.html`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Pages

| Route        | What it is                                              |
| ------------ | ------------------------------------------------------- |
| `/`          | Home: hero, name designer, sections, size guide, FAQ, contact |
| `/order`     | 6-step order form (was `#order` in the HTML file)        |
| `/about`     | About page (was `#about`)                                |

## Structure

- `app/globals.css` — all styles, copied unchanged from the original file
- `public/images/` — the photos that were embedded as base64 in the HTML
- `components/NameDesigner.tsx` — live name pendant / earrings preview
- `components/OrderWizard.tsx` — order form; the designer's "Order this design" prefills it
- `components/SizeFinder.tsx`, `Morph.tsx`, `ContactForm.tsx`, `RevealList.tsx`, `Logo.tsx`
- `lib/site.ts` — email address, bill image paths, mailto helper
- `app/actions.ts` — Server Actions that validate and save the contact form and orders to Supabase
- `lib/supabase/` — Supabase clients (`server.ts`, `client.ts`) and generated database types
- `supabase/migrations/` — database schema (tables, row-level security)

## Supabase (form submissions)

Both forms save to the Supabase project **OgCustomsLa's Project** — no sign-in needed:

| Form | Table |
| --- | --- |
| Contact form ("Tell us your idea") | `inquiries` |
| Order wizard ("Start an order") | `orders` |

Visitors can only **add** rows. Nobody can read, edit or delete submissions through the public key
(row-level security); view them in the Supabase dashboard → Table Editor.

**Setup:** copy `.env.example` to `.env` (already done locally) and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

On a host (e.g. Vercel), add the same two variables in its settings. If saving fails, the forms
offer an "Email this instead" link to OGcustomsLA@gmail.com.

After changing the schema, regenerate `lib/supabase/database.types.ts`.
