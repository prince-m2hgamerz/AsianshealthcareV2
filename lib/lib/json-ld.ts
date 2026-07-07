import { DEFAULT_SETTINGS, ENV_OVERRIDEABLE_KEYS } from "@/lib/site-settings-types";
import type { SiteSettings } from "@/lib/site-settings-types";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type SchemaSettings = Pick<SiteSettings,
  | "site_name"
  | "contact_phone"
  | "contact_email"
  | "meta_description"
  | "address_street"
  | "address_city"
  | "address_state"
  | "address_pin_code"
  | "facebook_url"
  | "twitter_url"
  | "instagram_url"
  | "linkedin_url"
  | "youtube_url"
>;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medsolutionhealthcare.com";

function formatAddress(s: SchemaSettings): string {
  return `${s.address_street}, ${s.address_city}, ${s.address_state} - ${s.address_pin_code}`;
}

function sameAs(s: SchemaSettings): string[] {
  return [s.facebook_url, s.twitter_url, s.instagram_url, s.linkedin_url, s.youtube_url].filter(Boolean);
}

function schemaDefaults(s: SchemaSettings): SchemaSettings {
  return { ...DEFAULT_SETTINGS, ...s };
}

export function organizationSchema(settings?: Partial<SchemaSettings>, overrides?: Record<string, JsonValue>) {
  const s = schemaDefaults(settings || {});
  return {
    "@type": "MedicalOrganization",
    name: s.site_name,
    alternateName: s.site_name,
    url: siteUrl,
    telephone: s.contact_phone,
    email: s.contact_email,
    description: s.meta_description,
    address: { "@type": "PostalAddress", streetAddress: s.address_street, addressLocality: s.address_city, addressRegion: s.address_state, postalCode: s.address_pin_code, addressCountry: "IN" },
    areaServed: "Worldwide",
    sameAs: sameAs(s).length ? sameAs(s) : [siteUrl],
    ...overrides,
  } as Record<string, JsonValue>;
}

export function websiteSchema(settings?: Partial<SchemaSettings>) {
  const s = schemaDefaults(settings || {});
  return {
    "@type": "WebSite",
    name: s.site_name,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function hospitalSchema(hospital: {
  name: string;
  description: string;
  city: string;
  state: string;
  beds?: number;
  accreditations?: string[];
  image?: string;
  url: string;
}) {
  return {
    "@type": "Hospital",
    name: hospital.name,
    description: hospital.description,
    url: hospital.url,
    image: hospital.image || undefined,
    address: { "@type": "PostalAddress", addressLocality: hospital.city, addressRegion: hospital.state, addressCountry: "IN" },
    numberOfBeds: hospital.beds,
    medicalSpecialty: hospital.accreditations?.length ? hospital.accreditations : undefined,
    availableService: hospital.accreditations?.length
      ? hospital.accreditations.map((a) => ({ "@type": "MedicalService", name: a }))
      : undefined,
  } as Record<string, JsonValue>;
}

export function physicianSchema(doctor: {
  name: string;
  description: string;
  specialty: string;
  image: string;
  url: string;
  qualifications?: string;
  hospitalName?: string;
  hospitalUrl?: string;
}) {
  return {
    "@type": "Physician",
    name: doctor.name,
    description: doctor.description,
    image: doctor.image,
    url: doctor.url,
    medicalSpecialty: doctor.specialty,
    ...(doctor.hospitalName
      ? { hospitalAffiliation: { "@type": "Hospital", name: doctor.hospitalName, url: doctor.hospitalUrl || undefined } }
      : {}),
  } as Record<string, JsonValue>;
}

export function faqPageSchema(questions: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  } as Record<string, JsonValue>;
}

export function localBusinessSchema(settings?: Partial<SchemaSettings>, overrides?: Record<string, JsonValue>) {
  const s = schemaDefaults(settings || {});
  return {
    "@type": "LocalBusiness",
    name: s.site_name,
    description: s.meta_description,
    url: siteUrl,
    telephone: s.contact_phone,
    email: s.contact_email,
    address: { "@type": "PostalAddress", streetAddress: s.address_street, addressLocality: s.address_city, addressRegion: s.address_state, postalCode: s.address_pin_code, addressCountry: "IN" },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "14:00" },
    ],
    ...overrides,
  } as Record<string, JsonValue>;
}

export function medicalProcedureSchema(procedure: {
  name: string;
  description: string;
  bodyLocation?: string;
  howPerformed?: string;
  preparation?: string;
  followUp?: string;
  cost?: string;
  recoveryTime?: string;
}) {
  return {
    "@type": "MedicalProcedure",
    name: procedure.name,
    description: procedure.description,
    ...(procedure.bodyLocation ? { bodyLocation: procedure.bodyLocation } : {}),
    ...(procedure.howPerformed ? { howPerformed: procedure.howPerformed } : {}),
    ...(procedure.preparation ? { preparation: procedure.preparation } : {}),
    ...(procedure.followUp ? { followUp: procedure.followUp } : {}),
    ...(procedure.cost ? { cost: procedure.cost } : {}),
    ...(procedure.recoveryTime ? { recoveryTime: procedure.recoveryTime } : {}),
  } as Record<string, JsonValue>;
}

export function aboutPageSchema(settings?: Partial<SchemaSettings>) {
  const s = schemaDefaults(settings || {});
  return {
    "@type": "AboutPage",
    name: `About ${s.site_name}`,
    description: s.meta_description,
    url: `${siteUrl}/about-us`,
  } as Record<string, JsonValue>;
}

export function reviewSchema(reviews: { name: string; reviewBody: string; ratingValue: number; datePublished?: string }[], settings?: Partial<SchemaSettings>) {
  const s = schemaDefaults(settings || {});
  return {
    "@type": "AggregateRating",
    ratingValue: 4.8,
    bestRating: 5,
    ratingCount: reviews.length,
    itemReviewed: { "@type": "Organization", name: s.site_name },
  } as Record<string, JsonValue>;
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  } as Record<string, JsonValue>;
}
