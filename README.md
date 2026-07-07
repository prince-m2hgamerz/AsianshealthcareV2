# Asians Healthcare — Medical Tourism Platform

> Connect international patients with India's top hospitals and doctors. A full-featured medical tourism marketplace connecting patients from Africa, the Middle East, South Asia, and beyond with world-class healthcare in Delhi/NCR.

## Overview

Asians Healthcare is a comprehensive medical tourism platform built on Next.js 16 with Supabase, featuring a complete public-facing website with 28+ pages and a full administrative control panel (19 screens). The platform enables international patients to search for doctors, compare treatment costs, explore hospitals, book consultations, and plan medical travel to India.

**Key Metrics:**
- 50+ routes, 0 build errors
- 121 AI-generated WebP images via NVIDIA flux.2-klein-4b
- 17 Delhi/NCR hospitals with real metadata
- 1700+ specialist doctor profiles with qualifications and backgrounds
- 218 treatment packages with cost comparison (India vs. US)
- 10+ tourism destinations for recovery travel
- Full admin panel with 19 management pages
- Complete email system (transactional + inbound via Cloudflare Workers)
- PWA with push notifications
- RSS feed, dynamic sitemap, and 10 JSON-LD schema types

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2 (App Router) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS 3.4 (custom design tokens, 60+ colors) |
| **Animation** | Framer Motion 12.40 |
| **Icons** | Lucide React |
| **Database** | Supabase (PostgreSQL + Row Level Security) |
| **Auth** | Supabase SSR Auth (cookie-based sessions) |
| **Email** | Resend (transactional) + Cloudflare Workers (inbound) |
| **Image Gen** | NVIDIA flux.2-klein-4b API (`black-forest-labs/flux.2-klein-4b`) |
| **Admin UI** | Radix UI primitives (Dialog, Select, Toast, Switch, Slot) |
| **Search** | Fuse.js (client-side fuzzy search across 7 entity types) |
| **Error Monitoring** | Rollbar (client + server) |
| **Push Notifications** | Web Push API + VAPID |
| **CMS** | Custom admin with RichTextEditor (TipTap via cheerio) |
| **Deployment** | Vercel |

---

## Design System

The UI follows a custom system defined in `tailwind.config.ts` with 60+ custom color tokens:

| Token | Value |
|---|---|
| **Canvas (dark)** | `#000000` (marketing pages) |
| **Canvas (light)** | `#ffffff` |
| **Canvas (cream)** | `#fbfbf5` (content pages) |
| **Ink (text)** | `#000000` |
| **Aloe (accent)** | `#c1fbd4` (green tint) |
| **Link Mint** | `#99b3ad` |
| **Display Font** | NeueHaasGrotesk Display / Helvetica / Arial (light weight, ~330) |
| **Body Font** | Inter Variable (clean, highly legible) |
| **Border Radius** | `pill` = 9999px, `xl` = 20px, `lg` = 12px |
| **Shadows** | 4 elevation levels, card hover lift effect |

---

## Project Structure

```
app/
├── (public)/                  # Public-facing route group
│   ├── about-us/              About Us page
│   ├── blogs/ + [slug]/       Blog listing and detail
│   ├── contact-us/            Contact page with forms
│   ├── doctors/ + [slug]/     Doctor listing and profiles
│   ├── find-cost/             Treatment cost finder
│   ├── hospitals/ + [slug]/   Hospital listing and details
│   ├── hotels/                Patient accommodation
│   ├── insurance-company/ + [slug]/  Insurance partners
│   ├── project-overview/      Detailed project breakdown page
│   ├── search/                Full-site search results
│   ├── speciality/ + [slug]/  Medical specialties
│   ├── specialties/ + [slug]/  Specialty listings
│   ├── testimonials/          Patient stories
│   ├── tourism/               Medical tourism destinations
│   ├── treatment-package/ + [slug]/  Treatment costs comparison
│   ├── treatments/ + [slug]/  Treatment listings
│   ├── page.tsx               Home page (10 sections)
│   ├── layout.tsx             Public layout wrapper
│   └── loading.tsx            Route-level loading skeleton
├── admin/                     # Admin control panel
│   ├── blogs/                 Blog CRUD (RichTextEditor)
│   ├── doctors/               Doctor management
│   ├── email-marketing/       Campaign management
│   ├── emails/ + [id]/        Inbound email inbox
│   ├── hospitals/             Hospital management
│   ├── hotels/                Hotel management
│   ├── inquiries/             Inquiry management
│   ├── insurance/             Insurance company management
│   ├── leads/                 Lead management (filter, CSV export)
│   ├── login/                 Admin authentication
│   ├── settings/              Editable site settings grid
│   ├── specialties/           Specialty management
│   ├── subscribers/           Newsletter subscribers
│   ├── testimonials/          Approve/revoke patient stories
│   ├── treatments/            Treatment package management
│   ├── users/                 Invite/remove admin users
│   ├── page.tsx               Dashboard with live stats
│   ├── layout.tsx             Admin shell with sidebar
│   └── loading.tsx            Loading skeleton
├── api/
│   ├── admin/
│   │   ├── emails/ + [id]/ + attachments/  Email inbox API
│   │   ├── leads/ + leads-data/            Lead management API
│   │   ├── login/ + logout/                Auth API
│   │   ├── manage/                         Admin management
│   │   ├── push/trigger/                   Push notification trigger
│   │   ├── send-email/                     Manual email sending
│   │   ├── site-settings/                  Settings CRUD
│   │   ├── subscribers/                    Subscriber management
│   │   ├── telegram/test/                  Telegram test
│   │   ├── treatments/                     Treatment management
│   │   ├── upload/                         File upload
│   │   └── users/invite + [id]/            User management
│   ├── contact/route.ts        Contact form handler
│   ├── email-marketing/route.ts  Email campaign API
│   ├── image-proxy/route.ts    Secure image proxy
│   ├── inquiries/route.ts      Inquiry list API
│   ├── inquiry/route.ts        Inquiry submission
│   ├── leads/route.ts          Lead submission (Supabase + Resend)
│   ├── newsletter/route.ts     Newsletter subscription
│   ├── push/                   PWA push notification endpoints
│   ├── report-error/route.ts   Client-side error reporting
│   ├── rss/route.ts            RSS feed generation
│   ├── sitemap/route.ts        Dynamic sitemap
│   ├── site-settings/route.ts  Public site settings
│   └── test-email/route.ts     Email test endpoint
├── cost-calculator/            Medical cost estimator
├── disclaimer/                 Legal disclaimer
├── guides/                     Medical tourism guides
├── offline/                    Offline page (PWA)
├── privacy-policy/             Legal page
├── refund-policy/              Refund policy
├── terms/                      Terms of service
├── layout.tsx                  Root layout (Inter font, metadata)
├── globals.css                 Tailwind + custom utility classes
├── not-found.tsx               404 page
├── robots.ts                   SEO robots
└── sitemap.ts                  SEO sitemap

components/
├── admin/                      Admin-specific components
│   ├── DataTable.tsx           Sortable, searchable table
│   ├── ImageUploadField.tsx    Image upload widget
│   ├── LeadsTable.tsx          Lead-specific table with CSV export
│   ├── Modal.tsx               Reusable modal dialog
│   ├── RichTextEditor.tsx      Rich text for blog content
│   └── StatsCard.tsx           Dashboard stat card
├── forms/                      Lead capture forms (4)
│   ├── CallbackForm.tsx
│   ├── ContactForm.tsx
│   ├── DoctorOpinionForm.tsx
│   └── InsuranceCheckForm.tsx
├── home/                       Home page sections (13 components)
│   ├── HeroSection.tsx         Search tabs + stats
│   ├── StatsCounter.tsx        Animated counters
│   ├── WhyChooseUs.tsx         8 feature cards
│   ├── FeaturedDoctors.tsx
│   ├── FeaturedHospitals.tsx
│   ├── TreatmentPackages.tsx   Cost comparison cards
│   ├── PatientTestimonials.tsx Carousel with YouTube support
│   ├── InsuranceLogos.tsx      13 partner logos
│   ├── TravelProcess.tsx       7-step journey
│   ├── FAQSection.tsx          8 questions
│   ├── CostComparison.tsx
│   ├── PatientSupportServices.tsx
│   └── MedicalCareGallery.tsx
├── layout/                     Shared layout components
│   ├── AppShell.tsx            Wraps Navbar + Footer + floating buttons
│   ├── Navbar.tsx              Sticky dark nav, mobile hamburger
│   ├── Footer.tsx              5-column footer with treatment links
│   ├── PageHero.tsx            Reusable page hero
│   ├── SearchInput.tsx         Debounced live search with clear
│   ├── WhatsAppButton.tsx      Floating WhatsApp CTA
│   └── CallbackButton.tsx      Floating callback request
├── premium/empty               Empty state components
├── search/                     Search-related components
├── shared/                     Shared components
│   ├── BreadcrumbNav.tsx
│   ├── CookieConsent.tsx
│   ├── DoctorCard.tsx
│   ├── DoctorsGrid.tsx
│   ├── EmptyState.tsx
│   ├── HorizontalSlider.tsx
│   ├── HospitalCard.tsx
│   ├── InquiryForm.tsx
│   ├── JsonLd.tsx
│   ├── LoadingSkeleton.tsx
│   ├── PwaProvider.tsx
│   ├── RollbarProvider.tsx
│   ├── TestimonialCard.tsx
│   └── TreatmentCard.tsx
└── ui/                         Base UI primitives
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── label.tsx
    ├── switch.tsx
    ├── table.tsx
    └── textarea.tsx

lib/
├── supabase/
│   ├── client.ts              Browser Supabase client
│   ├── server.ts              Server Supabase client (cookie-based)
│   └── middleware.ts           Auth middleware helper
├── email/
│   └── (email templates)
├── pwa/
│   └── (push notification helpers)
├── admin-auth.ts              Admin authentication utilities
├── apollo-doctors-data.ts     Apollo Hospitals doctor data
├── constants.ts               Site-wide constants
├── doctors-data.ts            Doctor data definitions
├── email.ts                   Resend email notification sender
├── fallback-data.ts           Static data when Supabase is empty
├── json-ld.ts                 Structured data generators (10 types)
├── rollbar.ts                 Rollbar client initialization
├── sanitize.ts                HTML sanitization utilities
├── search-index.ts            Fuse.js search index builder
├── server-queries.ts          Server-side data fetching utilities
├── site-images.ts             Image key mappings (59+ slots)
├── site-settings.ts           Fetch site_settings from Supabase
├── storage-utils.ts           Supabase Storage utilities
├── telegram.ts                Telegram notification sender
├── treatment-packages-data.ts Treatment package seed data
└── utils.ts                   Shared utilities

hooks/
├── usePWA.ts                  PWA install prompt hook
├── usePushNotifications.ts    Push notification subscription hook
└── useSiteSettings.ts         Site settings fetch hook

types/
├── database.ts                TypeScript interfaces for all tables
└── pwa.ts                     Push notification types

workers/email-handler/         Cloudflare Workers email handler
├── src/index.ts               MIME parser + email storage
├── wrangler.toml              Worker configuration
├── package.json
└── tsconfig.json

supabase/migrations/
├── 001_initial_schema.sql     Full DB schema (14 tables, RLS, policies)
├── 002_seed_delhi_data.sql    Seed data: 17 hospitals, 35 doctors, etc.
├── 003_to_012                 Incremental migrations (image slots,
│                             specialties, treatments, fallback, leads,
│                             hospital images, doctors data)

scripts/
├── seed.ts                    Database seed script
├── seed-fallback-data.ts      Fallback data seeder
├── seed-fallback-data.cjs     CommonJS fallback version
├── crawler.ts                 Web crawler
├── check-schema.ts            Schema validation
├── check-schema-2.ts          Extended schema validation
├── check-dupes.ts             Duplicate detection
├── upload-testimonials.ts     Testimonial uploader
├── apply-migration-008.cjs    Migration applier
├── analyze-html.mjs           HTML analysis
├── clean-fallback.mjs         Fallback data cleanup
├── generate-doctors-data.mjs  Doctor data generation
├── scrape-apollo-doctors.mjs  Apollo Hospitals scraper
├── generate-pwa-icons.mjs     PWA icon generation
├── generate-vapid-keys.mjs    VAPID key generation
├── generate-images.ps1        Original 59-image batch
├── generate-delhi-images.ps1  17 hospitals + 17 doctors
├── generate-missing-images.ps1  More doctors + tourism retry
├── generate-tourism.ps1       Tourism landmarks retry
├── generate-all-hospital-images.ps1  All hospital images
├── fix-sql.ps1                Fix SQL escaping
├── fix-sql-uuid.ps1           Fix UUID prefix chars
├── fix-uuid-final.ps1         Final UUID correction
└── package.json               Script dependencies

public/images/                 121 AI-generated WebP images
public/icons/                  PWA icons (various sizes)
public/sw.js                   Service worker for PWA
```

---

## Database Schema (14+ Tables)

| Table | Purpose |
|---|---|
| `hospitals` | Hospital profiles (name, city, beds, accreditations) |
| `doctors` | Doctor profiles (specialties, experience, hospital FK) |
| `doctor_hospital` | Many-to-many doctor-hospital relationship |
| `specialties` | Medical specialty catalog (cardiology, orthopedics, etc.) |
| `doctor_specialties` | Doctor-specialty join table |
| `treatments` | Treatment packages with cost ranges |
| `blogs` | Blog posts with rich HTML content |
| `insurance_companies` | Insurance partner profiles |
| `hotels` | Accommodation near hospitals |
| `testimonials` | Patient stories with approval workflow |
| `leads` | Form submissions from all contact forms |
| `inquiries` | Detailed patient inquiries |
| `admin_users` | Authorized admin panel users |
| `site_settings` | Key-value store for site configuration |
| `subscribers` | Newsletter email subscribers |
| `email_marketing_campaigns` | Email marketing campaigns |
| `email_marketing_logs` | Email send tracking |
| `auth.users` | Supabase Auth managed users |

**Security:** Row Level Security (RLS) enabled on all tables with public-read policies for customer-facing data and admin-only policies for management operations. Three admin roles: super_admin, editor, viewer.

---

## Pages & Routes

### Public Pages (28+)

| Route | Description |
|---|---|
| `/` | Home page — 10 sections: Hero with search tabs, stats counters, 8-feature why-choose-us, featured doctors, hospitals, treatment cost comparison, testimonial carousel with YouTube, 13 insurance partners, 7-step travel process, 8-question FAQ |
| `/about-us` | Company story, ISO certification, zero-cost model, 9-point service list |
| `/doctors` | Browse 1700+ doctors with search by name/specialty/hospital |
| `/doctors/[slug]` | Doctor profile with photo, qualifications, experience |
| `/hospitals` | Browse 17 Delhi hospitals with search by name/location/accreditation |
| `/hospitals/[slug]` | Hospital detail with stats (beds, specialists, 24/7 desk) |
| `/treatments` | 218 treatment packages with India vs. US cost comparison |
| `/treatments/[slug]` | Treatment detail and CTA |
| `/treatment-package` | Treatment package overview |
| `/treatment-package/[slug]` | Package detail with cost breakdown |
| `/speciality` | 12 medical specialties overview |
| `/speciality/[slug]` | Specialty detail with related treatments |
| `/specialties` | Specialty listings |
| `/specialties/[slug]` | Specialty detail page |
| `/find-cost` | Treatment cost finder tool |
| `/search` | Full-site fuzzy search across all entities |
| `/cost-calculator` | Medical cost estimator |
| `/blogs` | Medical tourism blog listing |
| `/blogs/[slug]` | Full blog article with rich content |
| `/contact-us` | Contact page with all 4 lead forms |
| `/testimonials` | Approved patient stories with video testimonials |
| `/hotels` | Accommodation near partner hospitals |
| `/insurance-company` | Insurance partner listings |
| `/insurance-company/[slug]` | Insurance company profile |
| `/tourism` | Medical tourism destinations with recovery planning |
| `/guides` | Medical tourism guides |
| `/project-overview` | Detailed project architecture breakdown |
| `/privacy-policy` | Legal/privacy document |
| `/terms` | Terms of service |
| `/refund-policy` | Refund policy |
| `/disclaimer` | Legal disclaimer |
| `/offline` | Offline fallback page (PWA) |

### Admin Pages (19)

| Route | Description |
|---|---|
| `/admin` | Dashboard with live stats (total leads, doctors, hospitals, treatments) |
| `/admin/login` | Supabase Auth login page |
| `/admin/leads` | Lead management with search, filter by status, CSV export |
| `/admin/inquiries` | Detailed inquiry management |
| `/admin/doctors` | Doctor CRUD with photo upload |
| `/admin/hospitals` | Hospital CRUD with accreditation management |
| `/admin/treatments` | Treatment CRUD with cost ranges |
| `/admin/blogs` | Blog CRUD with RichTextEditor |
| `/admin/specialties` | Specialty CRUD |
| `/admin/testimonials` | Testimonial moderation (approve/revoke) |
| `/admin/insurance` | Insurance company CRUD |
| `/admin/hotels` | Hotel CRUD with hospital association |
| `/admin/users` | Admin user management (invite/remove, role-based) |
| `/admin/settings` | Editable site settings grid |
| `/admin/subscribers` | Newsletter subscriber management |
| `/admin/emails` | Inbound email inbox with threading |
| `/admin/emails/[id]` | Individual email detail with attachments |
| `/admin/email-marketing` | Email marketing campaign management |
| `/admin/telegram` | Telegram notification configuration |

---

## API Routes (32 Endpoints)

### Public API
| Endpoint | Method | Description |
|---|---|---|
| `/api/leads` | POST | Lead submission from contact forms |
| `/api/contact` | POST | General contact form submission |
| `/api/inquiry` | POST | Patient inquiry submission |
| `/api/inquiries` | GET | Public inquiries (admin-access) |
| `/api/newsletter` | POST | Newsletter subscription |
| `/api/sitemap` | GET | Dynamic XML sitemap |
| `/api/rss` | GET | RSS feed for blog |
| `/api/site-settings` | GET | Public site settings |
| `/api/image-proxy` | GET | Secure image proxy |
| `/api/report-error` | POST | Client-side error reporting |
| `/api/push/subscribe` | POST | Push notification subscription |
| `/api/push/unsubscribe` | POST | Push notification unsubscription |
| `/api/push/vapid-public-key` | GET | VAPID public key for push |
| `/api/email-marketing` | POST | Email marketing triggers |
| `/api/test-email` | POST | Email test endpoint |

### Admin API
| Endpoint | Method | Description |
|---|---|---|
| `/api/admin/login` | POST | Admin authentication |
| `/api/admin/logout` | POST | Admin logout |
| `/api/admin/manage` | POST | Admin session management |
| `/api/admin/leads` | GET | Lead data with filters |
| `/api/admin/leads-data` | GET | Lead statistics |
| `/api/admin/treatments` | GET | Treatment management |
| `/api/admin/site-settings` | GET/PUT | Settings CRUD |
| `/api/admin/send-email` | POST | Manual email sending |
| `/api/admin/subscribers` | GET | Subscriber management |
| `/api/admin/upload` | POST | File upload to Supabase Storage |
| `/api/admin/push/trigger` | POST | Trigger push notification |
| `/api/admin/telegram/test` | POST | Test Telegram notification |
| `/api/admin/users/invite` | POST | Invite admin user |
| `/api/admin/users/[id]` | GET/PUT/DELETE | User management |
| `/api/admin/emails` | GET | Email inbox listing |
| `/api/admin/emails/[id]` | GET | Email detail |
| `/api/admin/emails/[id]/attachments` | GET | Email attachment download |

---

## Feature Highlights

### Lead Capture System
Four contact forms (`ContactForm`, `DoctorOpinionForm`, `InsuranceCheckForm`, `CallbackForm`) all POST to `/api/leads`, which inserts into Supabase `leads` table and sends a styled HTML email notification to the admin via Resend.

### Debounced Live Search
The `SearchInput` component provides URL-based search with 300ms debounce, inline clear button, mint focus ring, and result count display — used on doctors, hospitals, treatments, and hotels listing pages. Full-site search at `/search` uses Fuse.js across 7 entity types.

### Admin Authentication
Supabase SSR auth with cookie-based sessions. `middleware.ts` protects all `/admin/*` routes. Login page at `/admin/login`. Three role levels (super_admin, editor, viewer) enforced via RLS policies and UI guards.

### Email System
Dual-architecture: transactional emails via Resend (lead alerts, confirmations) plus a Cloudflare Workers-powered inbound email handler with full MIME parsing (multipart, base64), threading via parent_id, FTS5 full-text search, and attachment storage. Admin email inbox at `/admin/emails`.

### Push Notifications & PWA
Full Progressive Web App support with service worker (`public/sw.js`), manifest, offline page, and Web Push API notifications. Admin can trigger push notifications to subscribed users. VAPID keys generated via `scripts/generate-vapid-keys.mjs`.

### Email Marketing
Admin interface for managing email marketing campaigns with subscriber management at `/admin/subscribers` and campaign tools at `/admin/email-marketing`.

### AI-Generated Imagery
All 121 images in `public/images/` were generated via the NVIDIA flux.2-klein-4b API using PowerShell automation scripts. Categories: home page hero/support, all treatments, specialties, about page, tourism destinations (Delhi landmarks + route cities), doctor portraits (35 unique), hospital exteriors (17 unique), and page heroes.

### Animation System
Framer Motion powers scroll-reveal animations (`motion.div` with `initial`/`whileInView`), staggered children, hover card lifts (`-translate-y-1`), AnimatePresence testimonial carousel, and section entrance transitions across all home page sections.

### Structured Data (JSON-LD)
10 schema types generated across the site: WebSite, Organization, LocalBusiness, MedicalWebPage, Hospital, Physician, MedicalBusiness, BlogPosting, FAQPage, Product.

### Error Monitoring
Rollbar integrated on both client and server sides. Client errors reported via `/api/report-error` endpoint. Source maps enabled for readable stack traces.

### Telegram Integration
Admin receives Telegram notifications for new leads and inquiries via configurable bot integration.

---

## Environment Variables

```env
# Supabase
M2H_PUBLIC_SUPABASE_URL=        # Project URL from Supabase dashboard
M2H_PUBLIC_SUPABASE_ANON_KEY=   # Public anon key
SUPABASE_SERVICE_ROLE_KEY=       # Service role key (admin operations)

# Resend Email
RESEND_API_KEY=                  # Resend API key
RESEND_FROM_EMAIL=               # Sender address (e.g., noreply@asianshealthcare.com)
ADMIN_EMAIL=                     # Where lead notifications are sent

# Site
M2H_PUBLIC_SITE_URL=            # https://asianshealthcare.com
M2H_PUBLIC_WHATSAPP_NUMBER=     # +918285068544

# Push Notifications (PWA)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=   # VAPID public key (generated by generate-vapid-keys.mjs)
VAPID_PRIVATE_KEY=               # VAPID private key
VAPID_SUBJECT=                   # mailto:admin@asianshealthcare.com

# Rollbar (Error Monitoring)
NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN=  # Rollbar post_client_item token
ROLLBAR_SERVER_TOKEN=              # Rollbar server token

# Telegram
TELEGRAM_BOT_TOKEN=              # Telegram bot token
TELEGRAM_ADMIN_CHAT_ID=          # Admin chat ID for notifications
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Generate VAPID keys for push notifications
npm run generate:vapid

# Generate PWA icons
npm run generate:icons

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key into `.env.local`
3. Open Supabase SQL Editor and run migrations in order from `supabase/migrations/`
4. Configure Authentication → Settings → redirect URLs for your domain

### Image Generation

All images were generated using NVIDIA flux.2-klein-4b. To regenerate:

```bash
# Generate 59 original images
powershell -ExecutionPolicy Bypass -File scripts/generate-images.ps1

# Generate Delhi hospitals + doctor portraits
powershell -ExecutionPolicy Bypass -File scripts/generate-delhi-images.ps1

# Generate remaining doctor portraits + tourism
powershell -ExecutionPolicy Bypass -File scripts/generate-missing-images.ps1
```

---

## Deployment (Vercel)

The project is fully configured for Vercel deployment with a `vercel.json` file. All environment variables from `.env.local` must be added to the Vercel project dashboard under Settings → Environment Variables.

**Steps:**
1. Push to GitHub/GitLab
2. Import repo in Vercel
3. Set framework to Next.js
4. Add all environment variables
5. Deploy — no build command changes needed

---

## Development Notes

- **Unsplash removed** — all images are now local `/images/*.webp`, no `remotePatterns` needed for Unsplash
- **Fonts** — Inter from Google Fonts (`next/font/google`); NeueHaasGrotesk Display defined in font-face fallback chain (not bundled due to licensing)
- **Type safety** — TypeScript strict mode enabled; Supabase types generated via `supabase gen types`
- **Unused vars** — ESLint configured with `argsIgnorePattern: "^_"` for underscore-prefixed params
- **SQL caution** — Run migration scripts in order from `001_initial_schema.sql` through `012_*.sql`
- **Cloudflare Worker** — The email handler worker (`workers/email-handler/`) is deployed separately via `wrangler deploy`
- **PWA icons** — Generated via `scripts/generate-pwa-icons.mjs`; requires `sharp` dependency
- **Build hook** — `npm run build` automatically runs `generate:icons` before `next build`

---

## Image Inventory (121 WebP files)

- 9 home page images (hero, support, cost, opinion, hospital-match, visa, airport, interpreter, follow-up)
- 14 treatment procedure images (cardiac, ortho, oncology, transplant, knee, hip, spine, bypass, angioplasty, BMT, liver, kidney, IVF, dental, bariatric, hair, prostate, cataract)
- 12 specialty images (cardiology through cosmetic surgery)
- 4 about page images (hero, opinion, hospital-network, travel-support)
- 7 tourism destination images (hero, Delhi, Agra, Jaipur, Kerala, Mumbai, Goa)
- 9 tourism landmark images (India Gate, Red Fort, Qutub Minar, Lotus Temple, Akshardham, Humayun's Tomb, Jama Masjid, Lodhi Gardens, Connaught Place, Rashtrapati Bhavan)
- 9 page hero images (doctors, hospitals, treatments, specialities, contact, hotels, insurance, blogs, testimonials)
- 17 hospital exterior images (AIIMS, Medanta, Apollo, Fortis Escorts, Max Saket, Sir Ganga Ram, BLK, Artemis, FMRI, Manipal Dwarka, ISIC, Venkateshwar, Saroj, Paras, Narayana, Moolchand, Columbia Asia)
- 35 doctor portrait images (Dr. Rajesh Sharma through Dr. Rajendra Kumar)

---

## License

Private — internal project for Asians Healthcare.
