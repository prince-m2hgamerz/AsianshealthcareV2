const IMG = "/images";

export const SITE_IMAGE_DEFAULTS = {
  image_home_hero: `${IMG}/home-hero.webp`,
  image_home_support: `${IMG}/home-support.webp`,
  image_home_cost: `${IMG}/home-cost.webp`,
  image_home_opinion: `${IMG}/home-opinion.webp`,
  image_home_hospital_match: `${IMG}/home-hospital-match.webp`,
  image_home_visa_travel: `${IMG}/home-visa-travel.webp`,
  image_home_airport_pickup: `${IMG}/home-airport-pickup.webp`,
  image_home_interpreter: `${IMG}/home-interpreter.webp`,
  image_home_followup: `${IMG}/home-followup.webp`,
  image_treatment_cardiac: `${IMG}/treatment-cardiac.webp`,
  image_treatment_ortho: `${IMG}/treatment-ortho.webp`,
  image_treatment_oncology: `${IMG}/treatment-oncology.webp`,
  image_treatment_transplant: `${IMG}/treatment-transplant.webp`,
  image_treatment_knee: `${IMG}/treatment-knee.webp`,
  image_treatment_hip: `${IMG}/treatment-hip.webp`,
  image_treatment_spine: `${IMG}/treatment-spine.webp`,
  image_treatment_heart_bypass: `${IMG}/treatment-heart-bypass.webp`,
  image_treatment_angioplasty: `${IMG}/treatment-angioplasty.webp`,
  image_treatment_bmt: `${IMG}/treatment-bmt.webp`,
  image_treatment_liver: `${IMG}/treatment-liver.webp`,
  image_treatment_kidney: `${IMG}/treatment-kidney.webp`,
  image_treatment_ivf: `${IMG}/treatment-ivf.webp`,
  image_treatment_dental: `${IMG}/treatment-dental.webp`,
  image_treatment_bariatric: `${IMG}/treatment-bariatric.webp`,
  image_treatment_hair: `${IMG}/treatment-hair.webp`,
  image_treatment_prostate: `${IMG}/treatment-prostate.webp`,
  image_treatment_cataract: `${IMG}/treatment-cataract.webp`,
  image_specialty_cardiology: `${IMG}/specialty-cardiology.webp`,
  image_specialty_orthopedics: `${IMG}/specialty-orthopedics.webp`,
  image_specialty_neurology: `${IMG}/specialty-neurology.webp`,
  image_specialty_oncology: `${IMG}/specialty-oncology.webp`,
  image_specialty_gastroenterology: `${IMG}/specialty-gastroenterology.webp`,
  image_specialty_nephrology: `${IMG}/specialty-nephrology.webp`,
  image_specialty_urology: `${IMG}/specialty-urology.webp`,
  image_specialty_fertility: `${IMG}/specialty-fertility.webp`,
  image_specialty_transplant: `${IMG}/specialty-transplant.webp`,
  image_specialty_dental: `${IMG}/specialty-dental.webp`,
  image_specialty_ophthalmology: `${IMG}/specialty-ophthalmology.webp`,
  image_specialty_cosmetic: `${IMG}/specialty-cosmetic.webp`,
  image_about_hero: `${IMG}/about-hero.webp`,
  image_about_opinion: `${IMG}/about-opinion.webp`,
  image_about_hospital_network: `${IMG}/about-hospital-network.webp`,
  image_about_travel_support: `${IMG}/about-travel-support.webp`,
  image_tourism_hero: `${IMG}/tourism-hero.webp`,
  image_tourism_delhi_ncr: `${IMG}/tourism-delhi.webp`,
  image_tourism_agra: `${IMG}/tourism-agra.webp`,
  image_tourism_jaipur: `${IMG}/tourism-jaipur.webp`,
  image_tourism_kerala: `${IMG}/tourism-kerala.webp`,
  image_tourism_mumbai: `${IMG}/tourism-mumbai.webp`,
  image_tourism_goa: `${IMG}/tourism-goa.webp`,
  image_doctors_hero: `${IMG}/doctors-hero.webp`,
  image_hospitals_hero: `${IMG}/hospitals-hero.webp`,
  image_treatments_hero: `${IMG}/treatments-hero.webp`,
  image_specialities_hero: `${IMG}/specialities-hero.webp`,
  image_contact_hero: `${IMG}/contact-hero.webp`,
  image_hotels_hero: `${IMG}/hotels-hero.webp`,
  image_insurance_hero: `${IMG}/insurance-hero.webp`,
  image_blogs_hero: `${IMG}/blogs-hero.webp`,
  image_testimonials_hero: `${IMG}/testimonials-hero.webp`,
};

export type SiteImageKey = keyof typeof SITE_IMAGE_DEFAULTS;

export const SITE_IMAGE_SLOTS: Array<{
  key: SiteImageKey;
  label: string;
  page: string;
  folder: string;
  helper: string;
}> = [
  {
    key: "image_home_hero",
    label: "Home hero image",
    page: "Home",
    folder: "home",
    helper: "Main first-screen hospital or doctor image.",
  },
  {
    key: "image_home_support",
    label: "Home support section image",
    page: "Home",
    folder: "home",
    helper: "Patient-care image used in the support workflow section.",
  },
  {
    key: "image_home_cost",
    label: "Home cost section image",
    page: "Home",
    folder: "home",
    helper: "Healthcare image used near the cost comparison section.",
  },
  {
    key: "image_home_opinion",
    label: "Free opinion image",
    page: "Home",
    folder: "home",
    helper: "Image for the medical opinion service card.",
  },
  {
    key: "image_home_hospital_match",
    label: "Hospital matching image",
    page: "Home",
    folder: "home",
    helper: "Image for doctor and hospital selection support.",
  },
  {
    key: "image_home_visa_travel",
    label: "Visa and travel image",
    page: "Home",
    folder: "home",
    helper: "Image for medical visa and travel planning.",
  },
  {
    key: "image_home_airport_pickup",
    label: "Airport pickup image",
    page: "Home",
    folder: "home",
    helper: "Image for arrival, transport, and local stay support.",
  },
  {
    key: "image_home_interpreter",
    label: "Interpreter support image",
    page: "Home",
    folder: "home",
    helper: "Image for language and hospital coordination support.",
  },
  {
    key: "image_home_followup",
    label: "Follow-up care image",
    page: "Home",
    folder: "home",
    helper: "Image for post-treatment follow-up.",
  },
  {
    key: "image_treatment_cardiac",
    label: "Cardiac sciences image",
    page: "Home",
    folder: "treatments",
    helper: "Image for cardiac treatment category.",
  },
  {
    key: "image_treatment_ortho",
    label: "Orthopedics image",
    page: "Home",
    folder: "treatments",
    helper: "Image for orthopedic treatment category.",
  },
  {
    key: "image_treatment_oncology",
    label: "Oncology image",
    page: "Home",
    folder: "treatments",
    helper: "Image for cancer treatment category.",
  },
  {
    key: "image_treatment_transplant",
    label: "Transplant image",
    page: "Home",
    folder: "treatments",
    helper: "Image for transplant treatment category.",
  },
  {
    key: "image_treatment_knee",
    label: "Knee replacement image",
    page: "Treatments",
    folder: "treatments",
    helper: "Image for knee replacement cards.",
  },
  {
    key: "image_treatment_hip",
    label: "Hip replacement image",
    page: "Treatments",
    folder: "treatments",
    helper: "Image for hip replacement cards.",
  },
  {
    key: "image_treatment_spine",
    label: "Spine surgery image",
    page: "Treatments",
    folder: "treatments",
    helper: "Image for spine surgery cards.",
  },
  {
    key: "image_treatment_heart_bypass",
    label: "Heart bypass image",
    page: "Treatments",
    folder: "treatments",
    helper: "Image for heart bypass cards.",
  },
  {
    key: "image_treatment_angioplasty",
    label: "Angioplasty image",
    page: "Treatments",
    folder: "treatments",
    helper: "Image for angioplasty cards.",
  },
  {
    key: "image_treatment_bmt",
    label: "Bone marrow transplant image",
    page: "Treatments",
    folder: "treatments",
    helper: "Image for bone marrow transplant cards.",
  },
  {
    key: "image_treatment_liver",
    label: "Liver transplant image",
    page: "Treatments",
    folder: "treatments",
    helper: "Image for liver transplant cards.",
  },
  {
    key: "image_treatment_kidney",
    label: "Kidney transplant image",
    page: "Treatments",
    folder: "treatments",
    helper: "Image for kidney transplant cards.",
  },
  {
    key: "image_treatment_ivf",
    label: "IVF treatment image",
    page: "Treatments",
    folder: "treatments",
    helper: "Image for fertility treatment cards.",
  },
  {
    key: "image_treatment_dental",
    label: "Dental treatment image",
    page: "Treatments",
    folder: "treatments",
    helper: "Image for dental treatment cards.",
  },
  {
    key: "image_treatment_bariatric",
    label: "Bariatric surgery image",
    page: "Treatments",
    folder: "treatments",
    helper: "Image for bariatric surgery cards.",
  },
  {
    key: "image_treatment_hair",
    label: "Hair transplant image",
    page: "Treatments",
    folder: "treatments",
    helper: "Image for hair transplant cards.",
  },
  {
    key: "image_treatment_prostate",
    label: "Robotic prostate surgery image",
    page: "Treatments",
    folder: "treatments",
    helper: "Image for robotic prostate surgery cards.",
  },
  {
    key: "image_treatment_cataract",
    label: "Cataract surgery image",
    page: "Treatments",
    folder: "treatments",
    helper: "Image for cataract surgery cards.",
  },
  {
    key: "image_specialty_cardiology",
    label: "Cardiology specialty image",
    page: "Specialities",
    folder: "specialities",
    helper: "Image for cardiology specialty cards and detail pages.",
  },
  {
    key: "image_specialty_orthopedics",
    label: "Orthopedics specialty image",
    page: "Specialities",
    folder: "specialities",
    helper: "Image for orthopedics specialty cards and detail pages.",
  },
  {
    key: "image_specialty_neurology",
    label: "Neurology specialty image",
    page: "Specialities",
    folder: "specialities",
    helper: "Image for neurology specialty cards and detail pages.",
  },
  {
    key: "image_specialty_oncology",
    label: "Oncology specialty image",
    page: "Specialities",
    folder: "specialities",
    helper: "Image for oncology specialty cards and detail pages.",
  },
  {
    key: "image_specialty_gastroenterology",
    label: "Gastroenterology specialty image",
    page: "Specialities",
    folder: "specialities",
    helper: "Image for gastroenterology specialty cards and detail pages.",
  },
  {
    key: "image_specialty_nephrology",
    label: "Nephrology specialty image",
    page: "Specialities",
    folder: "specialities",
    helper: "Image for nephrology specialty cards and detail pages.",
  },
  {
    key: "image_specialty_urology",
    label: "Urology specialty image",
    page: "Specialities",
    folder: "specialities",
    helper: "Image for urology specialty cards and detail pages.",
  },
  {
    key: "image_specialty_fertility",
    label: "Fertility specialty image",
    page: "Specialities",
    folder: "specialities",
    helper: "Image for fertility specialty cards and detail pages.",
  },
  {
    key: "image_specialty_transplant",
    label: "Transplant specialty image",
    page: "Specialities",
    folder: "specialities",
    helper: "Image for transplant specialty cards and detail pages.",
  },
  {
    key: "image_specialty_dental",
    label: "Dental specialty image",
    page: "Specialities",
    folder: "specialities",
    helper: "Image for dental specialty cards and detail pages.",
  },
  {
    key: "image_specialty_ophthalmology",
    label: "Ophthalmology specialty image",
    page: "Specialities",
    folder: "specialities",
    helper: "Image for ophthalmology specialty cards and detail pages.",
  },
  {
    key: "image_specialty_cosmetic",
    label: "Cosmetic surgery specialty image",
    page: "Specialities",
    folder: "specialities",
    helper: "Image for cosmetic surgery specialty cards and detail pages.",
  },
  {
    key: "image_about_hero",
    label: "About page hero image",
    page: "About",
    folder: "about",
    helper: "Brand or patient-care image used behind the about hero.",
  },
  {
    key: "image_about_opinion",
    label: "About opinion image",
    page: "About",
    folder: "about",
    helper: "Image for the medical opinion and cost support block.",
  },
  {
    key: "image_about_hospital_network",
    label: "About hospital network image",
    page: "About",
    folder: "about",
    helper: "Image for accredited hospital network support.",
  },
  {
    key: "image_about_travel_support",
    label: "About travel support image",
    page: "About",
    folder: "about",
    helper: "Image for visa, travel, and patient arrival support.",
  },
  {
    key: "image_tourism_hero",
    label: "Tourism hero image",
    page: "Tourism",
    folder: "tourism",
    helper: "Large travel and recovery image at the top of tourism page.",
  },
  {
    key: "image_tourism_delhi_ncr",
    label: "Delhi NCR route image",
    page: "Tourism",
    folder: "tourism",
    helper: "Destination card image.",
  },
  {
    key: "image_tourism_agra",
    label: "Agra route image",
    page: "Tourism",
    folder: "tourism",
    helper: "Destination card image.",
  },
  {
    key: "image_tourism_jaipur",
    label: "Jaipur route image",
    page: "Tourism",
    folder: "tourism",
    helper: "Destination card image.",
  },
  {
    key: "image_tourism_kerala",
    label: "Kerala route image",
    page: "Tourism",
    folder: "tourism",
    helper: "Destination card image.",
  },
  {
    key: "image_tourism_mumbai",
    label: "Mumbai route image",
    page: "Tourism",
    folder: "tourism",
    helper: "Destination card image.",
  },
  {
    key: "image_tourism_goa",
    label: "Goa route image",
    page: "Tourism",
    folder: "tourism",
    helper: "Destination card image.",
  },
  {
    key: "image_doctors_hero",
    label: "Doctors page hero image",
    page: "Doctors",
    folder: "heroes",
    helper: "Top image for the doctors listing page.",
  },
  {
    key: "image_hospitals_hero",
    label: "Hospitals page hero image",
    page: "Hospitals",
    folder: "heroes",
    helper: "Top image for the hospitals listing page.",
  },
  {
    key: "image_treatments_hero",
    label: "Treatments page hero image",
    page: "Treatments",
    folder: "heroes",
    helper: "Top image for treatment package pages.",
  },
  {
    key: "image_specialities_hero",
    label: "Specialities page hero image",
    page: "Specialities",
    folder: "heroes",
    helper: "Top image for medical specialty pages.",
  },
  {
    key: "image_contact_hero",
    label: "Contact page hero image",
    page: "Contact",
    folder: "heroes",
    helper: "Top image for the contact page.",
  },
  {
    key: "image_hotels_hero",
    label: "Hotels page hero image",
    page: "Hotels",
    folder: "heroes",
    helper: "Top image for patient accommodation pages.",
  },
  {
    key: "image_insurance_hero",
    label: "Insurance page hero image",
    page: "Insurance",
    folder: "heroes",
    helper: "Top image for insurance pages.",
  },
  {
    key: "image_blogs_hero",
    label: "Blogs page hero image",
    page: "Blogs",
    folder: "heroes",
    helper: "Top image for blog and resource pages.",
  },
  {
    key: "image_testimonials_hero",
    label: "Testimonials page hero image",
    page: "Testimonials",
    folder: "heroes",
    helper: "Top image for patient stories.",
  },
];

export function mergeSiteImages(settings?: Array<{ key: string; value: string | null }>) {
  const images = { ...SITE_IMAGE_DEFAULTS };

  settings?.forEach((setting) => {
    if (setting.key in images && setting.value) {
      images[setting.key as SiteImageKey] = setting.value;
    }
  });

  return images;
}

export const SITE_IMAGE_KEYS = Object.keys(SITE_IMAGE_DEFAULTS);

const TREATMENT_IMAGE_KEY_BY_SLUG: Record<string, SiteImageKey> = {
  "knee-replacement": "image_treatment_knee",
  "hip-replacement": "image_treatment_hip",
  "spine-surgery": "image_treatment_spine",
  "heart-bypass-surgery": "image_treatment_heart_bypass",
  angioplasty: "image_treatment_angioplasty",
  "bone-marrow-transplant": "image_treatment_bmt",
  "liver-transplant": "image_treatment_liver",
  "kidney-transplant": "image_treatment_kidney",
  "ivf-treatment": "image_treatment_ivf",
  "dental-implants": "image_treatment_dental",
  "bariatric-surgery": "image_treatment_bariatric",
  "hair-transplant": "image_treatment_hair",
  "robotic-prostate-surgery": "image_treatment_prostate",
  "cataract-surgery": "image_treatment_cataract",
};

const TREATMENT_IMAGE_KEY_BY_CATEGORY: Record<string, SiteImageKey> = {
  cardiology: "image_treatment_cardiac",
  orthopedics: "image_treatment_ortho",
  oncology: "image_treatment_oncology",
  transplant: "image_treatment_transplant",
  fertility: "image_treatment_ivf",
  dental: "image_treatment_dental",
  neurology: "image_treatment_spine",
  gastroenterology: "image_treatment_bariatric",
  urology: "image_treatment_prostate",
  ophthalmology: "image_treatment_cataract",
  cosmetic: "image_treatment_hair",
};

const SPECIALTY_IMAGE_KEY_BY_SLUG: Record<string, SiteImageKey> = {
  cardiology: "image_specialty_cardiology",
  orthopedics: "image_specialty_orthopedics",
  neurology: "image_specialty_neurology",
  oncology: "image_specialty_oncology",
  gastroenterology: "image_specialty_gastroenterology",
  nephrology: "image_specialty_nephrology",
  urology: "image_specialty_urology",
  fertility: "image_specialty_fertility",
  transplant: "image_specialty_transplant",
  dental: "image_specialty_dental",
  ophthalmology: "image_specialty_ophthalmology",
  "cosmetic-surgery": "image_specialty_cosmetic",
};

type SiteImageMap = Record<SiteImageKey, string>;

export function getTreatmentImage(images: SiteImageMap, slug: string, category?: string | null) {
  const slugKey = TREATMENT_IMAGE_KEY_BY_SLUG[slug];
  if (slugKey) return images[slugKey];

  const categoryKey = category ? TREATMENT_IMAGE_KEY_BY_CATEGORY[category.toLowerCase()] : undefined;
  if (categoryKey) return images[categoryKey];

  return images.image_home_cost;
}

export function getSpecialtyImage(images: SiteImageMap, slug: string) {
  const imageKey = SPECIALTY_IMAGE_KEY_BY_SLUG[slug];
  return imageKey ? images[imageKey] : images.image_specialities_hero;
}
