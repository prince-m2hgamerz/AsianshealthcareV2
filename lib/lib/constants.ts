import { DEFAULT_SETTINGS } from "@/lib/site-settings-types";

export const SITE = {
  name: DEFAULT_SETTINGS.site_name,
  tagline: "Your Trusted Partner in Medical Tourism",
  description: DEFAULT_SETTINGS.meta_description,
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://medsolutionhealthcare.com",
  phone: DEFAULT_SETTINGS.contact_phone,
  whatsapp: DEFAULT_SETTINGS.whatsapp_number,
  email: DEFAULT_SETTINGS.contact_email,
  address: `${DEFAULT_SETTINGS.address_street}, ${DEFAULT_SETTINGS.address_city}, ${DEFAULT_SETTINGS.address_state} - ${DEFAULT_SETTINGS.address_pin_code}`,
} as const;

export const SOCIAL = {
  facebook: DEFAULT_SETTINGS.facebook_url,
  twitter: DEFAULT_SETTINGS.twitter_url,
  instagram: DEFAULT_SETTINGS.instagram_url,
  linkedin: DEFAULT_SETTINGS.linkedin_url,
  youtube: DEFAULT_SETTINGS.youtube_url,
} as const;

export const CONTACT = {
  phone: SITE.phone,
  whatsapp: SITE.whatsapp,
  email: SITE.email,
  consultationEmail: DEFAULT_SETTINGS.contact_email,
  supportEmail: DEFAULT_SETTINGS.admin_email,
} as const;

export const WHATSAPP_MESSAGE = {
  default: DEFAULT_SETTINGS.whatsapp_message_default,
  consultation: DEFAULT_SETTINGS.whatsapp_message_consultation,
  callback: DEFAULT_SETTINGS.whatsapp_message_callback,
} as const;

export const ROUTES = {
  home: "/",
  about: "/about",
  treatments: "/treatments",
  hospitals: "/hospitals",
  doctors: "/doctors",
  blog: "/blog",
  contact: "/contact",
  faq: "/faq",
  testimonials: "/testimonials",
  costCalculator: "/cost-calculator",
  privacyPolicy: "/privacy-policy",
  terms: "/terms",
} as const;

export const SPECIALTIES = [
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "Oncology",
  "Gastroenterology",
  "Urology",
  "Nephrology",
  "Pulmonology",
  "Ophthalmology",
  "ENT",
  "Dermatology",
  "Gynecology",
  "Pediatrics",
  "Psychiatry",
  "Dentistry",
  "Cosmetic Surgery",
  "Bariatric Surgery",
  "Spine Surgery",
  "Liver Transplant",
  "Kidney Transplant",
  "Hip Replacement",
  "Knee Replacement",
  "IVF Treatment",
  "Cancer Treatment",
] as const;

export const COUNTRIES = [
  "Afghanistan",
  "Bangladesh",
  "Bhutan",
  "Botswana",
  "Cambodia",
  "Cameroon",
  "Canada",
  "China",
  "Egypt",
  "Ethiopia",
  "Gambia",
  "Ghana",
  "India",
  "Indonesia",
  "Iraq",
  "Kenya",
  "Kuwait",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mauritius",
  "Myanmar",
  "Nepal",
  "Nigeria",
  "Oman",
  "Pakistan",
  "Philippines",
  "Qatar",
  "Rwanda",
  "Saudi Arabia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Sri Lanka",
  "Sudan",
  "Tanzania",
  "Thailand",
  "Uganda",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Yemen",
  "Zambia",
  "Zimbabwe",
] as const;

export const META = {
  home: {
    title: `${DEFAULT_SETTINGS.site_name} - Best Medical Tourism in India`,
    description: DEFAULT_SETTINGS.meta_description,
  },
} as const;
