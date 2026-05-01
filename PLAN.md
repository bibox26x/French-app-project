# Fête, en fait — Project Plan

> **Note for Antigravity:** This document is the full specification for the project. Build exactly what's described. Do not add features marked "out of scope." Ask me before making architectural decisions not specified here. All user-facing text must be in French; all code, comments, and variable names in English.

---

## 1. Project Summary

**Fête, en fait** is a French short-term rental platform dedicated to students who want to rent entire properties for celebrations — birthdays, weekend trips with friends, housewarmings, post-exam getaways. Unlike traditional platforms where hosts ban groups and events, our hosts specifically opt in to this kind of rental: they own or operate properties (often outside city centers) designed to host groups, and they price accordingly.

**Tagline (FR):** *La plateforme de location pour vos événements entre étudiants.*

**Target users:** French students (verified) looking to rent group-friendly properties; hosts whose business model is event-friendly rentals.

**This is a class project** — a working web prototype for a French language class, demonstrated to classmates via a deployed URL. Real-world legal/payment compliance is out of scope; the app simulates the flows convincingly.

---

## 2. User Roles

Three roles, all stored on the same `User` table with a `role` enum.

| Role | Capabilities |
|---|---|
| **Guest** (Voyageur) | Browse listings, search, view details, book, see their bookings, cancel a booking |
| **Host** (Hôte) | Everything a guest does + create/edit/delete listings, view bookings on their listings, mark a booking as confirmed/declined |
| **Admin** | Everything + moderate listings (hide/show), view all users, view all bookings, see basic stats |

A user can be both Guest and Host simultaneously (one account, role determines what they can access).

---

## 3. Core Features (MVP)

### Authentication
- Sign up with email + password
- Login / logout
- "Vérification étudiante" button on profile — fake: clicking it sets `isVerifiedStudent = true` after a 2-second simulated delay. UI shows a green badge "Étudiant vérifié" afterward.
- Password reset is **out of scope** for the demo.

### Listings
- Hosts create listings with: title, description, address (free text), city, latitude/longitude (entered manually or via a simple geocode-on-save call to Nominatim/OpenStreetMap), property type (maison / appartement / villa / autre), max guests, number of bedrooms, photos (3–8 URLs — for the demo, hosts paste Unsplash URLs; no file upload system), amenities (multi-select: piscine, parking, jardin, sono, barbecue, lave-vaisselle, machine à laver, wifi), price per night (€), optional weekend package price (€ for Fri–Sun), optional deposit amount (€), house rules (free text).
- Hosts can edit and delete their listings.
- Listings have a status: `draft`, `published`, `hidden_by_admin`.

### Search & Discovery
- Homepage: hero section, search bar (city, dates, number of guests), grid of featured listings.
- Search results page: list view + map view toggle. Map uses MapLibre GL with OpenStreetMap tiles. Markers are clickable and open a mini-card.
- Filters: price range slider, city (text input), dates (date range picker), guest count (number input).
- Listing detail page: photo carousel, title, description, amenities, host info, price breakdown, booking widget.

### Booking
- From a listing detail page, guest selects dates and guest count → "Réserver" button.
- Booking summary page: shows listing, dates, total price (sum of nights, or weekend package if Fri-Sun), deposit if any, total to pay.
- Fake checkout page: card number / expiry / CVC fields (purely visual, no validation logic, no Stripe). "Confirmer le paiement" button.
- Confirmation page: "Réservation confirmée !" with booking reference, host contact info revealed (email + phone from host profile), and a CTA to "Voir mes réservations."
- Bookings have states: `pending` (just created, awaiting host confirmation), `confirmed` (host accepted), `declined` (host declined), `cancelled` (guest cancelled), `completed` (end date passed).
- Hosts see incoming bookings on their dashboard and can confirm or decline.
- Guests see their bookings on their dashboard and can cancel (only if `pending` or `confirmed` and start date is more than 48h away — for demo, just always allow cancel).

### Admin Panel
- List all users with role + verified status.
- List all listings; admin can toggle a listing's status to `hidden_by_admin`.
- List all bookings.
- Basic stats card: total users, total listings, total bookings, bookings this month.

---

## 4. Out of Scope (Do Not Build)

Explicit list — Antigravity should not add these even if it seems like a good idea:

- Real payment processing (no Stripe, no Stripe test mode either — pure fake checkout)
- Real student verification (no email domain check, no SheerID, no document upload — just a button)
- File upload for photos (use URL strings only)
- In-app messaging between host and guest (host contact info shown post-booking is enough)
- Reviews / ratings
- Mobile native app (web is responsive, that's enough)
- Email notifications (no transactional email)
- Calendar / availability blocking (a property can be booked any date; double bookings are allowed for the demo and we won't surface them)
- i18n / multilingual UI (French only)
- Dark mode
- Password reset flow
- 2FA
- OAuth providers (Google/Facebook login)
- Image optimization, CDN setup
- Tests (no Jest, no Playwright — out of scope for this scale)
- Analytics
- SEO metadata beyond basic page titles

---

## 5. User Flows

### Flow A — Guest books a property
1. Lands on homepage → sees featured listings + search bar
2. Enters city + dates + guest count → clicks "Rechercher"
3. Lands on search results page → sees list + map
4. Clicks a listing card → goes to detail page
5. Selects dates in the booking widget → clicks "Réserver"
6. Sees booking summary → clicks "Continuer vers le paiement"
7. Fills fake card details → clicks "Confirmer le paiement"
8. Sees confirmation page with host contact info
9. Can navigate to "Mes réservations" to see it listed

### Flow B — Host creates a listing
1. Logs in → goes to "Mon espace hôte"
2. Clicks "Nouvelle annonce"
3. Multi-step form: basics (title, description, type) → location (address, city, lat/lng auto-filled from geocode button) → details (capacity, amenities) → photos (paste 3-8 URLs) → pricing (per night, optional weekend, optional deposit) → publish
4. Sees their listing on their dashboard
5. Receives a booking → clicks the booking → confirms or declines

### Flow C — Student verification
1. New user signs up
2. Goes to profile page → sees "Vous n'êtes pas vérifié" warning
3. Clicks "Vérifier mon statut étudiant"
4. Modal appears with fake form (school name dropdown, student ID number — purely visual)
5. Clicks "Soumettre" → 2 second loader → success: "Vérification réussie ! Vous êtes maintenant un étudiant vérifié."
6. Profile now shows green badge.
7. **Booking should require verification** — non-verified users see "Vérifiez votre statut étudiant pour réserver" instead of the booking button on listing detail pages.

### Flow D — Admin moderation
1. Admin logs in → goes to `/admin`
2. Sees stats dashboard
3. Goes to "Annonces" → sees all listings with a "Masquer" button
4. Clicks "Masquer" on a listing → it's hidden from search results immediately

---

## 6. Pages / Routes

### Public
- `/` — Homepage (hero, search, featured listings, "comment ça marche" section, footer)
- `/recherche` — Search results (list + map toggle, filters sidebar)
- `/annonce/[id]` — Listing detail
- `/connexion` — Login
- `/inscription` — Sign up
- `/a-propos` — About / pitch page (for the class presentation — explains the concept)

### Authenticated (Guest)
- `/profil` — Profile (edit name, phone, click verification button)
- `/reservations` — My bookings list
- `/reservation/[id]` — Single booking detail with cancel button

### Authenticated (Host) — under `/hote`
- `/hote` — Host dashboard (their listings + incoming bookings)
- `/hote/annonces/nouvelle` — Create listing form
- `/hote/annonces/[id]/editer` — Edit listing
- `/hote/reservations/[id]` — Booking detail with confirm/decline buttons

### Authenticated (Admin) — under `/admin`
- `/admin` — Stats dashboard
- `/admin/utilisateurs` — All users
- `/admin/annonces` — All listings (with hide/show toggle)
- `/admin/reservations` — All bookings

### Booking flow (Guest)
- `/reserver/[listingId]` — Booking summary (after clicking "Réserver" on a listing)
- `/reserver/[listingId]/paiement` — Fake checkout
- `/reserver/[listingId]/confirmation` — Success page

---

## 7. Data Model

Prisma schema. SQLite for the database (single file, zero config).

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id                  String    @id @default(cuid())
  email               String    @unique
  passwordHash        String
  firstName           String
  lastName            String
  phone               String?
  role                String    @default("guest") // "guest" | "host" | "admin"
  isVerifiedStudent   Boolean   @default(false)
  university          String?   // free text, set during fake verification
  createdAt           DateTime  @default(now())

  listings            Listing[] @relation("HostListings")
  bookingsAsGuest     Booking[] @relation("GuestBookings")
}

model Listing {
  id              String    @id @default(cuid())
  hostId          String
  host            User      @relation("HostListings", fields: [hostId], references: [id])
  title           String
  description     String
  propertyType    String    // "maison" | "appartement" | "villa" | "autre"
  addressLine     String
  city            String
  latitude        Float
  longitude       Float
  maxGuests       Int
  bedrooms        Int
  pricePerNight   Float
  weekendPrice    Float?    // optional Fri-Sun package
  depositAmount   Float?    // optional caution
  houseRules      String?
  amenities       String    // JSON-encoded array of strings — SQLite has no native arrays
  photos          String    // JSON-encoded array of URL strings
  status          String    @default("published") // "draft" | "published" | "hidden_by_admin"
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  bookings        Booking[]
}

model Booking {
  id              String    @id @default(cuid())
  listingId       String
  listing         Listing   @relation(fields: [listingId], references: [id])
  guestId         String
  guest           User      @relation("GuestBookings", fields: [guestId], references: [id])
  startDate       DateTime
  endDate         DateTime
  guestCount      Int
  totalPrice      Float
  depositAmount   Float?
  status          String    @default("pending") // "pending" | "confirmed" | "declined" | "cancelled" | "completed"
  createdAt       DateTime  @default(now())
}
```

**Notes on the schema:**
- `amenities` and `photos` are JSON-encoded strings because SQLite doesn't support array types. Parse on read, stringify on write. Encapsulate in repo helpers.
- No `Review` model — out of scope.
- No `Message` model — out of scope.
- A `Report` table for admin signaling could be added later but is **out of scope for v1**.

---

## 8. Tech Stack (Locked)

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Single deploy, SSR, route handlers serve as the API |
| Language | TypeScript (strict mode) | Type safety across the app |
| Styling | Tailwind CSS v4 | Fast, consistent |
| Component library | shadcn/ui | Copy-paste components, accessible, customizable |
| Database | SQLite via Prisma | Single file, zero config, sufficient for demo |
| ORM | Prisma | Type-safe, generates client |
| Auth | Auth.js v5 (NextAuth) with Credentials provider | Email + password, session via cookies |
| Map | MapLibre GL JS + OpenStreetMap tiles | Free, no API key |
| Geocoding | Nominatim (OpenStreetMap) | Free, fair-use only — fine for demo |
| Forms | React Hook Form + Zod | Validation |
| Date picker | react-day-picker | Pairs with shadcn |
| Deployment | Railway | Persistent disk = SQLite works as-is, no need for Turso |
| Database hosting | SQLite file on Railway volume | Single file, persists across deploys |

---

## 9. Project Structure

```
fete-en-fait/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                  # Seed script: 3 users, 8 listings, a few bookings
│   └── migrations/
├── public/
│   └── (static assets)
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── recherche/page.tsx
│   │   │   ├── annonce/[id]/page.tsx
│   │   │   ├── connexion/page.tsx
│   │   │   ├── inscription/page.tsx
│   │   │   └── a-propos/page.tsx
│   │   ├── (authenticated)/
│   │   │   ├── profil/page.tsx
│   │   │   ├── reservations/page.tsx
│   │   │   ├── reservation/[id]/page.tsx
│   │   │   └── reserver/[listingId]/...
│   │   ├── hote/
│   │   │   ├── page.tsx
│   │   │   └── annonces/...
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   ├── utilisateurs/page.tsx
│   │   │   ├── annonces/page.tsx
│   │   │   └── reservations/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── listings/...
│   │   │   ├── bookings/...
│   │   │   └── admin/...
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                       # shadcn components
│   │   ├── listings/
│   │   ├── bookings/
│   │   ├── map/
│   │   └── layout/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── geocode.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 10. Seed Data

The seed script (`prisma/seed.ts`) must create:

- **3 users:**
  - `admin@feteenfait.fr` / password `admin123` — role `admin`, verified
  - `julie.martin@etu.univ-paris.fr` / password `julie123` — role `host`, verified, university "Sorbonne Université"
  - `lucas.dubois@etu.epita.fr` / password `lucas123` — role `guest`, verified, university "EPITA"
- **8 listings** spread across France (Paris, Lyon, Marseille, Bordeaux, Lille, Nice, Toulouse, Nantes) — varied property types, prices, amenities, with realistic French titles like *"Villa avec piscine pour vos weekends entre amis"*, *"Grande maison de campagne — événements bienvenus"*. All photos are Unsplash URLs (use `https://images.unsplash.com/photo-XXX` format).
- **3 bookings:** one `pending`, one `confirmed`, one `completed`.

---

## 11. Visual Design

### Color palette (locked — use these exact values)

**Brand colors:**
- `coral` (primary) → `#FF5A5F` — used for primary buttons, CTAs, links, active nav, logo
- `peach` (hover/secondary) → `#FF8A65` — used for hover states on coral buttons
- `ink` (text + UI dark) → `#1A1A2E` — primary text color, NOT pure black

**Coral ramp** (for fills, badges, light backgrounds):
- `coral-50` → `#FFF5F5` (lightest — hero section background, soft surfaces)
- `coral-100` → `#FFE3E3` (badges, subtle accents)
- `coral-200` → `#FCC2C3`
- `coral-500` → `#FF5A5F` (= primary)
- `coral-700` → `#E63946` (badge text on coral-100, darker hover)
- `coral-900` → `#7F1D1D` (rare, for strong emphasis)

**Neutrals:**
- `white` → `#FFFFFF` (cards, content backgrounds)
- `gray-50` → `#FAFAFA` (page background)
- `gray-200` → `#E5E5E5` (borders, dividers)
- `gray-500` → `#888780` (placeholder text, captions)
- `gray-700` → `#5F5E5A` (secondary text)

**Status colors** (for booking states, alerts):
- Success / Confirmé → bg `#DCFCE7`, text `#166534`
- Warning / En attente → bg `#FEF3C7`, text `#92400E`
- Danger / Refusé → bg `#FEE2E2`, text `#991B1B`
- Info / Étudiant vérifié → bg `#DBEAFE`, text `#1E40AF`

### Tailwind config

Add this to `tailwind.config.ts` so the colors are first-class throughout the app:

```ts
theme: {
  extend: {
    colors: {
      coral: {
        50:  '#FFF5F5',
        100: '#FFE3E3',
        200: '#FCC2C3',
        500: '#FF5A5F',
        600: '#FF8A65', // peach hover
        700: '#E63946',
        900: '#7F1D1D',
        DEFAULT: '#FF5A5F',
      },
      ink: '#1A1A2E',
    },
    fontFamily: {
      sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
    },
  },
}
```

### Typography
- Font: **Inter** loaded via `next/font/google` (CSS variable `--font-inter`).
- Headings: `font-weight: 500` only. No bold (700) anywhere — feels too heavy.
- Body: 16px, line-height 1.6.
- Sentence case for everything. No Title Case, no ALL CAPS except small UPPERCASE labels (12px, tracking-wide).

### Tone & layout
- Modern, friendly, playful — not corporate.
- Generous whitespace. Rounded corners (`rounded-lg` = 12px is the default).
- Soft borders (`border-gray-200`), no harsh shadows. Light shadows only on hover (`hover:shadow-md`).
- Cards: white background, 0.5px–1px border, 12px radius, 16–20px padding.
- Hero sections use `coral-50` background; everything else uses white or `gray-50`.

### Imagery
Lifestyle photos of houses, terraces, pools, groups of friends. All sourced from Unsplash via direct URL (no upload). Aim for warm, sunny, slightly aspirational — never stock-photo-cheesy.

### Logo
**Provided as files** in the project assets — Antigravity must use these, not generate new ones:

- `public/logo-full.png` (and `logo-large.png`, `logo-medium.png`, `logo-small.png` for responsive use) — the full stacked wordmark "Fête, en fait" with the navy burst above the "e". Use this on `/a-propos`, the footer (large), and any marketing/splash placement.
- `public/icon-mark.svg` — compact coral square with the white celebration burst inside. **Use this in the navbar header** (32×32) next to the wordmark text, and as the favicon (16/32/48px). The full PNG logo is too tall/square for a navbar.
- `public/icon-mark-transparent.svg` — same burst but transparent background, coral fill. Use anywhere you need the mark on top of an existing colored surface.

**Header pattern:** `[icon-mark.svg 32×32]` + `Fête, en fait` (Inter 500, 16px, ink color). Don't use the full PNG logo in the navbar — too tall and gets squished.

**Favicon setup in `app/layout.tsx`:**
```tsx
export const metadata = {
  title: 'Fête, en fait',
  description: 'La plateforme de location pour vos événements entre étudiants.',
  icons: {
    icon: '/icon-mark.svg',
    apple: '/icon-mark.svg',
  },
}
```

---

## 12. Acceptance Criteria for the Demo

The demo is successful if a classmate can, on the deployed URL, in this order:

1. Land on the homepage and understand what the app is in 5 seconds.
2. Sign up as a new user, verify themselves as a student (fake), and see the badge.
3. Search for a listing in "Lyon", see results on a map, click one, see its detail page.
4. Book it — pick dates, go through fake checkout, see confirmation with host contact info.
5. View their booking on `/reservations`.
6. Log in as the seeded host (`julie.martin@etu.univ-paris.fr`) and see the booking they just received, and confirm it.
7. Log in as admin and hide a listing — verify it disappears from search.

If all 7 steps work end to end, the prototype is presentation-ready.

---

## 13. Build Order Suggestion for Antigravity

If Antigravity asks where to start, suggest this order:

1. Initialize Next.js 15 + TypeScript + Tailwind + shadcn/ui
2. Set up Prisma with SQLite + the schema above
3. Write the seed script and run it
4. Build Auth.js with credentials provider
5. Build the public pages (homepage, search, listing detail) with seed data — read-only first
6. Add the booking flow (summary → fake checkout → confirmation)
7. Build the host dashboard + listing creation form
8. Build the admin panel
9. Add the map view to search
10. Polish: loading states, empty states, error pages, 404
11. Deploy to Railway with custom domain `fnf.x26.dev`

### Railway deployment notes (for Antigravity)

- Add a Railway **Volume** mounted at `/data`.
- Set `DATABASE_URL=file:/data/prod.db` in Railway environment variables.
- Start command: `prisma migrate deploy && (prisma db seed || true) && next start` — the `|| true` on seed prevents re-seeding from crashing redeploys after data exists.
- Custom domain: Railway service → Settings → Networking → Custom Domain → `fnf.x26.dev`. Wael will add a CNAME record on x26.dev pointing to Railway's provided target.
- Required env vars: `DATABASE_URL`, `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`), `NEXTAUTH_URL=https://fnf.x26.dev`, `NEXT_PUBLIC_APP_URL=https://fnf.x26.dev`.

---

## 14. Locked Decisions

- **Logo:** provided as files (`logo-full.png` + size variants for marketing, `icon-mark.svg` for navbar/favicon). Use these — don't generate new ones.
- **Brand color:** coral `#FF5A5F` (locked, see section 11).
- **Domain:** `fnf.x26.dev`.
- **Hosting:** Railway with persistent volume.
- **All French copy:** see `COPY-FR.md` — Antigravity must use these exact strings for navigation, hero text, error messages, button labels, etc. Do not paraphrase or invent French text.

---

## 15. Project Files Provided to Antigravity

Files Wael will hand over alongside this plan:

- `PLAN.md` (this file) — full spec
- `COPY-FR.md` — all user-facing French text
- `logo-full.png` (+ `-large`, `-medium`, `-small` variants) — main logo
- `icon-mark.svg` — compact mark for navbar + favicon
- `icon-mark-transparent.svg` — transparent variant of the mark

Place all in `/public/` of the Next.js project except the docs.

---

## 16. Mobile-Readiness Requirements (do during web build)

A native mobile app may be built after the web app is done. To avoid expensive rework later, the web build must respect these five rules from the start. None of them adds significant work — they're about doing things right the first time.

### 16.1 Maintain `API.md`

Every time you create or modify an API route in `src/app/api/`, append/update its entry in a top-level `API.md` file. Required format per route:

```
### POST /api/bookings
Auth: required (guest)
Body: { listingId: string, startDate: ISODate, endDate: ISODate, guestCount: number }
Response 201: { id: string, status: "pending", ... }
Response 400: { error: { code: "INVALID_DATES", message: string } }
Response 401: { error: { code: "UNAUTHORIZED", message: string } }
```

This file is the contract a future mobile client will consume. Keep it up to date with the same discipline as the code.

### 16.2 Enable CORS

Add Next.js middleware (`src/middleware.ts`) that sets CORS headers on `/api/*`:

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
  return response
}

export const config = { matcher: '/api/:path*' }
```

Tighten the origin to known domains before launch — for now `*` is fine.

### 16.3 JWT alongside session cookies

Auth.js handles web sessions via cookies. For mobile, also expose a JWT endpoint:

- `POST /api/auth/token` — body `{ email, password }` → response `{ token: string, expiresAt: ISODate, user: {...} }`. Token signed with `NEXTAUTH_SECRET`, payload `{ userId, role, isVerifiedStudent }`, expires in 30 days.
- All `/api/*` route handlers accept **either** a session cookie **or** a `Authorization: Bearer <token>` header. Wrap auth checks in a helper `getAuthenticatedUser(request)` that tries cookie first, then JWT.

This is ~50 lines of code total. Add it during the auth sprint, not later.

### 16.4 Stable JSON contracts

API rules — non-negotiable:

- All responses are JSON. Never return HTML, never redirect from `/api/*`.
- Errors always use the shape `{ error: { code: string, message: string, details?: any } }` with appropriate HTTP status.
- Successful responses return the resource directly (`{ id, ...fields }`) or a list as `{ items: [...], total: number, hasMore: boolean }`. No top-level arrays — they break extensibility.
- Dates are always ISO 8601 strings (`new Date().toISOString()`), never timestamps or locale strings.
- Booleans are real JSON booleans, never `"true"` / `"false"` strings.

### 16.5 Keep a `MOBILE-NOTES.md` file

When a UI decision during web build only makes sense on web (hover states, right-click menus, keyboard shortcuts, narrow modals that need to be full-screen on phone), append a one-line note. Example entries:

```
- Listing card: hover reveals "favorite" button on web. Mobile needs always-visible heart icon.
- Booking widget: sticky on right side on desktop. Mobile needs sticky bottom bar instead.
- Date picker: react-day-picker inline on desktop. Mobile needs native date picker bottom sheet.
```

This file becomes the starting point for the mobile spec when it's time to build mobile. Without it, every UX decision gets re-litigated from scratch.

### Deliverables for mobile-readiness

By end of web build, the repo must contain:

1. `API.md` — fully populated, one section per route
2. `src/middleware.ts` — CORS configured
3. `src/lib/auth.ts` — `getAuthenticatedUser()` helper supporting both cookie and JWT
4. `MOBILE-NOTES.md` — even if short, started

If any of these are missing at "demo ready" time, mobile cannot start. Treat them as part of the definition of done.