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
| `/api/request` | Receives contact form + order submissions             |

## Structure

- `app/globals.css` — all styles, copied unchanged from the original file
- `public/images/` — the photos that were embedded as base64 in the HTML
- `components/NameDesigner.tsx` — live name pendant / earrings preview
- `components/OrderWizard.tsx` — order form; the designer's "Order this design" prefills it
- `components/SizeFinder.tsx`, `Morph.tsx`, `ContactForm.tsx`, `RevealList.tsx`, `Logo.tsx`
- `lib/site.ts` — email address and form-sending helper

## Receiving form submissions

Set `ORDER_WEBHOOK_URL` (in `.env.local` or your host's settings) to any webhook
(Zapier, Make, Formspree, a Slack incoming webhook…). Both forms POST their data there as JSON.
Without it, the forms show an "Email this instead" link that opens a prefilled email to
OGcustomsLA@gmail.com — the same fallback the original HTML used.
