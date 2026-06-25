# Asians Healthcare — Medical Tourism Platform

> Connect international patients with India's top hospitals and doctors. A full-featured medical tourism marketplace connecting patients from Africa, the Middle East, South Asia, and beyond with world-class healthcare in Delhi/NCR.

## Overview

Asians Healthcare is a comprehensive medical tourism platform built on Next.js 14 with Supabase, featuring a complete public-facing website with 15+ pages and a full administrative control panel. The platform enables international patients to search for doctors, compare treatment costs, explore hospitals, book consultations, and plan medical travel to India.

**Key Metrics:**
- 34 routes, 0 build errors
- 121 AI-generated WebP images via NVIDIA flux.2-klein-4b
- 17 Delhi/NCR hospitals with real metadata
- 35+ specialist doctors with qualifications and backgrounds
- 14 treatment categories with cost comparison (India vs. US)
- 10+ tourism destinations for recovery travel
- Full admin panel with 12 management pages

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14.2 (App Router) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS 3.4 (custom Shopifi-inspired design tokens) |
| **Animation** | Framer Motion 12 |
| **Icons** | Lucide React |
| **Database** | Supabase (PostgreSQL + Row Level Security) |
| **Auth** | Supabase SSR Auth (cookie-based sessions) |
| **Email** | Resend (lead notifications to admin) |
| **Image Gen** | NVIDIA flux.2-klein-4b API (`black-forest-labs/flux.2-klein-4b`) |
| **Admin UI** | Radix UI primitives (Dialog, Select, Toast) |
| **Deployment** | Vercel |

---

## Design System

The UI follows a custom "Shopifi-inspired" system defined in `tailwind.config.ts`:

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
│   ├── hospitals/ + [slug]/   Hospital listing and details
│   ├── hotels/                Patient accommodation
│   ├── insurance-company/ + [slug]/  Insurance partners
│   ├── speciality/ + [slug]/  Medical specialties
│   ├── testimonials/          Patient stories
│   ├── tourism/               Medical tourism destinations
│   ├── treatment-package/ + [slug]/  Treatment costs comparison
│   ├── page.tsx               Home page (10 sections)
│   ├── layout.tsx             Public layout wrapper
│   └── loading.tsx            Route-level loading skeleton
├── admin/                     # Admin control panel
│   ├── blogs/                 Blog CRUD (RichTextEditor)
│   ├── doctors/               Doctor management
│   ├── hospitals/             Hospital management
│   ├── hotels/                Hotel management
│   ├── insurance/             Insurance company management
│   ├── leads/                 Lead management (filter, CSV export)
│   ├── login/                 Admin authentication
│   ├── settings/              Editable site settings grid
│   ├── testimonials/          Approve/revoke patient stories
│   ├── treatments/            Treatment package management
│   ├── users/                 Invite/remove admin users
│   ├── page.tsx               Dashboard with live stats
│   ├── layout.tsx             Admin shell with sidebar
│   └── loading.tsx            Loading skeleton
├── api/
│   ├── leads/route.ts         Lead submission (Supabase + Resend)
│   └── sitemap/route.ts       Dynamic sitemap
├── layout.tsx                 Root layout (Inter font, metadata)
├── globals.css                Tailwind + custom utility classes
├── not-found.tsx              404 page
├── robots.ts                  SEO robots
├── sitemap.ts                 SEO sitemap
├── privacy-policy/            Legal page
└── terms/                     Legal page

components/
├── admin/                     Admin-specific components
│   ├── DataTable.tsx          Sortable, searchable table
│   ├── ImageUploadField.tsx   Image upload widget
│   ├── LeadsTable.tsx         Lead-specific table with CSV export
│   ├── Modal.tsx              Reusable modal dialog
│   ├── RichTextEditor.tsx     Rich text for blog content
│   └── StatsCard.tsx          Dashboard stat card
├── forms/                     Lead capture forms
│   ├── CallbackForm.tsx
│   ├── ContactForm.tsx
│   ├── DoctorOpinionForm.tsx
│   └── InsuranceCheckForm.tsx
├── home/                      Home page sections (13 components)
│   ├── HeroSection.tsx        Search tabs + stats
│   ├── StatsCounter.tsx       Animated counters
│   ├── WhyChooseUs.tsx        8 feature cards
│   ├── FeaturedDoctors.tsx
│   ├── FeaturedHospitals.tsx
│   ├── TreatmentPackages.tsx  Cost comparison cards
│   ├── PatientTestimonials.tsx Carousel with YouTube support
│   ├── InsuranceLogos.tsx     13 partner logos
│   ├── TravelProcess.tsx      7-step journey
│   ├── FAQSection.tsx         8 questions
│   ├── CostComparison.tsx
│   ├── PatientSupportServices.tsx
│   └── MedicalCareGallery.tsx
├── layout/                    Shared layout components
│   ├── AppShell.tsx           Wraps Navbar + Footer + floating buttons
│   ├── Navbar.tsx             Sticky dark nav, mobile hamburger
│   ├── Footer.tsx             5-column footer with treatment links
│   ├── PageHero.tsx           Reusable page hero
│   ├── SearchInput.tsx        Debounced live search with clear
│   ├── WhatsAppButton.tsx     Floating WhatsApp CTA
│   └── CallbackButton.tsx     Floating callback request
├── search/                    Search-related components
└── ui/                        Base UI primitives

lib/
├── supabase/
│   ├── client.ts              Browser Supabase client
│   ├── server.ts              Server Supabase client (cookie-based)
│   └── middleware.ts           Auth middleware helper
├── email.ts                   Resend email notification sender
├── email/                     Email templates
├── fallback-data.ts           Static data when Supabase is empty
├── site-images.ts             Image key mappings (59+ slots)
├── site-settings.ts           Fetch site_settings from Supabase
└── utils.ts                   Shared utilities

supabase/migrations/
├── 001_initial_schema.sql     Full DB schema (14 tables, RLS, policies)
└── 002_seed_delhi_data.sql    Seed data: 17 hospitals, 35 doctors, etc.

types/
└── database.ts                TypeScript interfaces for all tables

scripts/
├── generate-images.ps1        Original 59-image batch
├── generate-delhi-images.ps1  17 hospitals + 17 doctors
├── generate-missing-images.ps1  18 more doctors + tourism retry
├── generate-tourism.ps1       Tourism landmarks retry
├── fix-sql.ps1                Fix SQL escaping
├── fix-sql-uuid.ps1           Fix UUID prefix chars
└── fix-uuid-final.ps1         Final UUID correction

public/images/                 121 AI-generated WebP images
```

---

## Database Schema (14 Tables)

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
| `admin_users` | Authorized admin panel users |
| `site_settings` | Key-value store for site configuration |
| `auth.users` | Supabase Auth managed users |

**Security:** Row Level Security (RLS) enabled on all tables with public-read policies for customer-facing data and admin-only policies for management operations.

---

## Pages & Routes

### Public Pages (15)

| Route | Description |
|---|---|
| `/` | Home page — 10 sections: Hero with search tabs, stats counters, 8-feature why-choose-us, featured doctors, hospitals, treatment cost comparison, testimonial carousel with YouTube, 13 insurance partners, 7-step travel process, 8-question FAQ |
| `/about-us` | Company story, ISO certification, zero-cost model, 9-point service list |
| `/doctors` | Browse 35+ Delhi doctors with search by name/specialty/hospital |
| `/doctors/[slug]` | Doctor profile with photo, qualifications, experience |
| `/hospitals` | Browse 17 Delhi hospitals with search by name/location/accreditation |
| `/hospitals/[slug]` | Hospital detail with stats (beds, specialists, 24/7 desk) |
| `/treatment-package` | 14 treatments with India vs. US cost comparison |
| `/treatment-package/[slug]` | Treatment detail and CTA |
| `/speciality` | 12 medical specialties overview |
| `/speciality/[slug]` | Specialty detail with related treatments |
| `/blogs` | Medical tourism blog listing |
| `/blogs/[slug]` | Full blog article with rich content |
| `/contact-us` | Contact page with all 4 lead forms |
| `/testimonials` | Approved patient stories with video testimonials |
| `/hotels` | Accommodation near partner hospitals |
| `/insurance-company` | Insurance partner listings |
| `/insurance-company/[slug]` | Insurance company profile |
| `/tourism` | Medical tourism destinations with recovery planning |
| `/privacy-policy` | Legal/privacy document |
| `/terms` | Terms of service |

### Admin Pages (12)

| Route | Description |
|---|---|
| `/admin` | Dashboard with live stats (total leads, doctors, hospitals, treatments) |
| `/admin/leads` | Lead management with search, filter by status, CSV export |
| `/admin/doctors` | Doctor CRUD with photo upload |
| `/admin/hospitals` | Hospital CRUD with accreditation management |
| `/admin/treatments` | Treatment CRUD with cost ranges |
| `/admin/blogs` | Blog CRUD with RichTextEditor |
| `/admin/testimonials` | Testimonial moderation (approve/revoke) |
| `/admin/insurance` | Insurance company CRUD |
| `/admin/hotels` | Hotel CRUD with hospital association |
| `/admin/settings` | Editable site settings grid |
| `/admin/users` | Admin user management (invite/remove) |
| `/admin/login` | Supabase Auth login page |

---

## Feature Highlights

### Lead Capture System
Four contact forms (`ContactForm`, `DoctorOpinionForm`, `InsuranceCheckForm`, `CallbackForm`) all POST to `/api/leads`, which inserts into Supabase `leads` table and sends a styled HTML email notification to the admin via Resend.

### Debounced Live Search
The `SearchInput` component provides URL-based search with 300ms debounce, inline clear button, mint focus ring, and result count display — used on doctors, hospitals, treatments, and hotels listing pages.

### Admin Authentication
Supabase SSR auth with cookie-based sessions. `middleware.ts` protects all `/admin/*` routes. Login page at `/admin/login`. Admin-only operations enforced via RLS policies.

### AI-Generated Imagery
All 121 images in `public/images/` were generated via the NVIDIA flux.2-klein-4b API using PowerShell automation scripts. Categories: home page hero/support, all treatments, specialties, about page, tourism destinations (Delhi landmarks + route cities), doctor portraits (35 unique), hospital exteriors (17 unique), and page heroes.

### Animation System
Framer Motion powers scroll-reveal animations (`motion.div` with `initial`/`whileInView`), staggered children, hover card lifts (`-translate-y-1`), AnimatePresence testimonial carousel, and section entrance transitions across all home page sections.

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
```

---

## Getting Started

```bash
# Install dependencies
npm install

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
3. Open Supabase SQL Editor and paste `supabase/migrations/001_initial_schema.sql` — run it
4. Paste `supabase/migrations/002_seed_delhi_data.sql` — run it
5. Configure Authentication → Settings → redirect URLs for your domain

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

```json
// vercel.json — all 7 env vars are referenced
```

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
- **Type safety** — `Database` generic removed from Supabase client due to type inference issues with newer supabase-js v2; runtime queries work reliably
- **Unused vars** — ESLint configured with `argsIgnorePattern: "^_"` for underscore-prefixed params
- **SQL caution** — Run migration scripts in order: `001_initial_schema.sql` first, then `002_seed_delhi_data.sql`

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
