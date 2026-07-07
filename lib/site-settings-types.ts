export interface SiteSettings {
  site_name: string;
  whatsapp_number: string;
  contact_phone: string;
  contact_email: string;
  admin_email: string;
  hero_title: string;
  hero_subtitle: string;
  about_short: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
  images: Record<string, string>;

  address_street: string;
  address_city: string;
  address_state: string;
  address_country: string;
  address_pin_code: string;
  maps_embed_url: string;

  linkedin_url: string;

  meta_description: string;
  meta_keywords: string;
  meta_title_template: string;
  ga4_measurement_id: string;
  gtm_container_id: string;

  logo_url: string;
  favicon_url: string;
  og_image_url: string;
  foundation_year: string;
  opening_hours: string;

  copyright_text: string;
  footer_tagline: string;

  whatsapp_message_default: string;
  whatsapp_message_consultation: string;
  whatsapp_message_callback: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: "Asians Healthcare",
  whatsapp_number: "918285068544",
  contact_phone: "+918285068544",
  contact_email: "info@asianshealthcare.com",
  admin_email: "admin@asianshealthcare.com",
  hero_title: "Your Health Journey Starts in India",
  hero_subtitle: "Connect with India's top-rated hospitals and specialist doctors.",
  about_short: "Asians Healthcare is India's premier medical tourism facilitator.",
  facebook_url: "https://facebook.com/medsolutionhealthcare",
  instagram_url: "https://instagram.com/medsolutionhealthcare",
  twitter_url: "https://twitter.com/medsolutionhealthcare",
  youtube_url: "https://youtube.com/@medsolutionhealthcare",
  images: {},

  address_street: "Unit No. 36, Living Style Mall, Jasola",
  address_city: "New Delhi",
  address_state: "Delhi",
  address_country: "India",
  address_pin_code: "110025",
  maps_embed_url: "https://www.google.com/maps?q=Unit+No.+36+Living+Style+Mall+Jasola+New+Delhi+110025&output=embed",

  linkedin_url: "https://linkedin.com/company/medsolutionhealthcare",

  meta_description: "Asians Healthcare is India's premier medical tourism facilitator. We help international patients access world-class medical treatments in India.",
  meta_keywords: "medical tourism, healthcare, India, medical treatment, hospital",
  meta_title_template: "%s | Asians Healthcare",
  ga4_measurement_id: "G-CD5HKSSMK1",
  gtm_container_id: "",

  logo_url: "/images/logo.png",
  favicon_url: "/favicon.ico",
  og_image_url: "/images/og-image.jpg",
  foundation_year: "2015",
  opening_hours: "Mon-Sat 9:00 AM - 6:00 PM",

  copyright_text: "Asians Healthcare. All rights reserved.",
  footer_tagline: "Bridging the Gap Between You and World-Class Healthcare",

  whatsapp_message_default: "Hi! I'm interested in medical treatment in India. Can you help me?",
  whatsapp_message_consultation: "Hi! I'd like to book a free consultation. Please help me.",
  whatsapp_message_callback: "Hi! I'd like to request a callback. Please contact me.",
};

export const SETTING_KEYS: readonly string[] = [
  "site_name",
  "whatsapp_number",
  "contact_phone",
  "contact_email",
  "admin_email",
  "hero_title",
  "hero_subtitle",
  "about_short",
  "facebook_url",
  "instagram_url",
  "twitter_url",
  "youtube_url",

  "address_street",
  "address_city",
  "address_state",
  "address_country",
  "address_pin_code",
  "maps_embed_url",
  "linkedin_url",

  "meta_description",
  "meta_keywords",
  "meta_title_template",
  "ga4_measurement_id",
  "gtm_container_id",

  "logo_url",
  "favicon_url",
  "og_image_url",
  "foundation_year",
  "opening_hours",

  "copyright_text",
  "footer_tagline",

  "whatsapp_message_default",
  "whatsapp_message_consultation",
  "whatsapp_message_callback",
];

export const ENV_OVERRIDEABLE_KEYS: (keyof SiteSettings)[] = [
  "site_name",
  "whatsapp_number",
  "contact_phone",
  "contact_email",
  "admin_email",
  "facebook_url",
  "instagram_url",
  "twitter_url",
  "youtube_url",
  "linkedin_url",
  "ga4_measurement_id",
  "gtm_container_id",
  "meta_description",
  "meta_keywords",
  "meta_title_template",
  "copyright_text",
  "footer_tagline",
];
