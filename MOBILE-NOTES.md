# Mobile UX Notes

This file tracks web-specific UX decisions and decisions that will need to be adapted when building the native mobile app later.

---

## CORS / Auth (Section 16 — Mobile-Readiness)

- **CORS is handled in `src/proxy.ts`** (Next.js 16 renamed `middleware.ts` → `proxy.ts`; the function must be exported as `proxy`). All `/api/*` routes have `Access-Control-Allow-*` headers, including preflight OPTIONS support.
- **JWT endpoint** `POST /api/auth/token` returns `{ token, expiresAt, user }` for mobile Bearer auth.
- **`getAuthenticatedUser()`** in `src/lib/auth.ts` accepts either session cookie or `Authorization: Bearer <token>`.

---

## Navigation

- Web uses a sticky top navbar with logo, nav links, and user dropdown.
- Mobile app should use bottom tab bar instead (Rechercher / Réservations / Profil tabs).
- The "Devenir hôte" CTA in the navbar redirects to `/connexion` — on mobile, consider a dedicated onboarding flow.

---

## Search Page

- Web uses a sidebar-left filter panel (hidden on mobile, shown on md+).
- Mobile should use a bottom sheet for filters.
- Map toggle is already implemented with a client-side `viewMode` state — can be reused on mobile via react-native-maps.

---

## Booking Flow

- Web: multi-step as separate pages (`/reserver/[id]` → `/reserver/[id]/paiement` → `/reserver/[id]/confirmation`).
- Mobile: consider a bottom sheet wizard instead.
- Payment page is a demo — no real payment processing. Mobile app note: integrate Stripe mobile SDK here.

---

## Image URLs

- All listing photos are stored as JSON arrays of external URLs (Unsplash). The `next/image` component handles optimization on web. On mobile, use `expo-image` or `react-native-fast-image`.
