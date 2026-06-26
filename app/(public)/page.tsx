import { createServerSupabaseClient } from "@/lib/supabase/server";
import { JsonLd } from "@/components/shared/JsonLd";
import { organizationSchema, websiteSchema, faqPageSchema } from "@/lib/json-ld";
import HeroSection from "@/components/home/HeroSection";
import EmergencyBanner from "@/components/home/EmergencyBanner";
import CountriesTicker from "@/components/home/CountriesTicker";
import StatsCounter from "@/components/home/StatsCounter";
import WhoWeAre from "@/components/home/WhoWeAre";
import TopSpecialties from "@/components/home/TopSpecialties";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import PatientSupportServices from "@/components/home/PatientSupportServices";
import FeaturedDoctors from "@/components/home/FeaturedDoctors";
import FeaturedHospitals from "@/components/home/FeaturedHospitals";
import TreatmentCostShowcase from "@/components/home/TreatmentCostShowcase";

import CostComparison from "@/components/home/CostComparison";
import MedicalCareGallery from "@/components/home/MedicalCareGallery";
import GetConsultation from "@/components/home/GetConsultation";
import QuickInquiryForm from "@/components/home/QuickInquiryForm";

import PatientTestimonials from "@/components/home/PatientTestimonials";
import InsuranceLogos from "@/components/home/InsuranceLogos";
import TravelProcess from "@/components/home/TravelProcess";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import FAQSection from "@/components/home/FAQSection";

import {
  fallbackDoctors,
  fallbackHospitals,
  fallbackInsurances,
  fallbackTestimonials,
} from "@/lib/fallback-data";
import { mergeSiteImages, SITE_IMAGE_KEYS, SITE_IMAGE_DEFAULTS } from "@/lib/site-images";
import type { SiteImageKey } from "@/lib/site-images";

export default async function HomePage() {
  let treatments: { name: string; costMin: number; costMax: number; usCost: number; slug: string; category: string; image_url: string | null }[] = [];
  let testimonials: { name: string; country: string; treatment: string; text: string; rating: number; image_url?: string; videoId?: string }[] = [];
  let insurances: string[] = [];
  let images: Record<SiteImageKey, string> = { ...SITE_IMAGE_DEFAULTS };

  try {
    const supabase = await createServerSupabaseClient();
    const [treatmentsRes, testimonialsRes, insuranceRes, settingsRes] = await Promise.all([
      supabase.from("treatments").select("*").eq("is_featured", true).limit(6),
      supabase.from("testimonials").select("*").eq("is_approved", true).limit(10),
      supabase.from("insurance_companies").select("name"),
      supabase.from("site_settings").select("key, value").in("key", SITE_IMAGE_KEYS),
    ]);

    treatments = treatmentsRes.data?.map((t) => ({
      name: t.name,
      costMin: Number(t.cost_usd_min) || 0,
      costMax: Number(t.cost_usd_max) || 0,
      usCost: Number(t.cost_usd_max) * 5 || 10000,
      slug: t.slug,
      category: t.category || "General",
      image_url: t.image_url || null,
    })) || [];

    testimonials = testimonialsRes.data?.map((t) => ({
      name: t.patient_name,
      country: t.country,
      treatment: t.treatment,
      text: t.text_content,
      rating: t.rating || 5,
      image_url: t.image_url || undefined,
      videoId: t.video_url?.match(/(?:v=|youtu\.be\/)([\w-]+)/)?.[1] || undefined,
    })) || [];

    insurances = insuranceRes.data?.map((i) => i.name).filter(Boolean) || [];
    images = mergeSiteImages(settingsRes.data || undefined) as Record<SiteImageKey, string>;
  } catch {
    console.warn("Supabase unavailable, using fallback data");
  }

  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <JsonLd data={faqPageSchema([
        { question: "Why choose India for medical treatment?", answer: "India offers accredited hospitals, experienced specialists, advanced technology, and significantly lower treatment costs than many Western countries." },
        { question: "How does Med Solution Healthcare work?", answer: "Share your reports, receive opinion and cost guidance, choose a doctor or hospital, then get support for visa invitation, arrival, stay, admission, interpreter help, and follow-up." },
        { question: "Is Med Solution Healthcare's service free?", answer: "Yes. Patients pay the hospital directly. Med Solution Healthcare does not add a patient service fee." },
        { question: "Which hospitals do you work with?", answer: "We coordinate with NABH and JCI accredited hospitals across major Indian cities, including Delhi NCR, Mumbai, Chennai, Bangalore, and other medical hubs." },
        { question: "How much can I save?", answer: "Savings depend on the procedure and hospital, but many patients see treatment estimates that are 60-80% lower than US or UK costs." },
      ])} />
      <EmergencyBanner />
      <HeroSection imageUrl={images.image_home_hero} />
      <CountriesTicker />
      <StatsCounter />
      <WhoWeAre />
      <TopSpecialties />
      <TreatmentCostShowcase />
      <WhyChooseUs />
      <TravelProcess />
      <FeaturedDoctors doctors={fallbackDoctors.slice(0, 8)} />
      <GetConsultation />
      <FeaturedHospitals hospitals={fallbackHospitals} />
      <CostComparison imageUrl={images.image_home_cost} />

      <PatientTestimonials testimonials={testimonials.length > 0 ? testimonials : fallbackTestimonials} />
      <QuickInquiryForm />
      <PatientSupportServices imageUrl={images.image_home_support} />
      <InsuranceLogos insurances={insurances.length > 0 ? insurances : fallbackInsurances} />
      <MedicalCareGallery images={images} />
      <FAQSection />
      <NewsletterSignup />
    </>
  );
}
