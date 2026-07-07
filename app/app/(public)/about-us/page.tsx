import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shield, Users, Award, Globe, Check, ChevronRight } from "lucide-react";
import { getSiteSettings, getSiteImages } from "@/lib/site-settings";
import type { SiteImageKey } from "@/lib/site-images";
import { JsonLd } from "@/components/shared/JsonLd";
import { organizationSchema, aboutPageSchema, breadcrumbSchema } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "About Us | Asians Healthcare",
  description: "Asians Healthcare is India's trusted medical tourism facilitator. ISO 9001:2015 certified. 500+ patients from 30+ countries. Free medical opinion, zero-cost service, end-to-end support.",
  alternates: { canonical: "https://asianshealthcare.com/about-us" },
};

const stats = [
  { icon: Users, value: "500+", label: "Patients Treated" },
  { icon: Award, value: "130+", label: "Partner Hospitals" },
  { icon: Globe, value: "30+", label: "Countries Served" },
  { icon: Shield, value: "4.8", label: "Google Rating (250+ reviews)" },
];

const services = [
  "Specialist opinion and estimated treatment cost",
  "Relevant doctor and hospital options",
  "Direct hospital payment with clear estimates",
  "Medical visa invitation support",
  "Airport pickup, hotel, and local coordination",
  "Interpreter and case-manager assistance",
  "Discharge planning and remote follow-up",
];

const careBlocks: Array<{
  title: string;
  text: string;
  imageKey: SiteImageKey;
}> = [
  {
    title: "Medical opinion and cost",
    text: "We review reports, shortlist relevant specialists, and share practical treatment estimates before travel.",
    imageKey: "image_about_opinion",
  },
  {
    title: "Accredited hospital access",
    text: "Patients can compare care options across NABH and JCI accredited hospitals in major Indian cities.",
    imageKey: "image_about_hospital_network",
  },
  {
    title: "Travel and stay support",
    text: "Visa invitation, arrival pickup, local SIM guidance, hotel options, interpreter help, and follow-up are coordinated by one team.",
    imageKey: "image_about_travel_support",
  },
];

export default async function AboutPage() {
  const images = await getSiteImages();
  const settings = await getSiteSettings();

  return (
    <>
      <JsonLd data={organizationSchema(settings)} />
      <JsonLd data={aboutPageSchema(settings)} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://asianshealthcare.com" },
        { name: "About Us", url: "https://asianshealthcare.com/about-us" },
      ])} />
      <nav aria-label="Breadcrumb" className="bg-canvas-cream/80 border-b border-hairline-light">
        <div className="container-cinematic py-2.5">
          <ol className="flex items-center gap-1.5 text-caption text-shade-40">
            <li><Link href="/" className="hover:text-ink transition-colors">Home</Link></li>
            <li className="flex items-center gap-1.5"><ChevronRight size={12} className="text-shade-30" /><span className="text-shade-60 font-medium">About Us</span></li>
          </ol>
        </div>
      </nav>
      <section className="relative overflow-hidden bg-canvas-night text-on-primary">
        <div className="absolute inset-0">
          <Image
            src={images.image_about_hero}
            alt="Healthcare coordinator helping a patient"
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-canvas-night/80" />
        <div className="container-cinematic relative z-10 py-24 lg:py-32">
          <span className="pill-tag mb-4">About Us</span>
          <h1 className="font-display text-[44px] leading-[0.98] sm:text-display-xl lg:text-display-xxl tracking-wide mb-6">
            India&apos;s Trusted
            <br />
            <span className="text-link-mint">Medical Tourism Partner</span>
          </h1>
          <p className="text-body-lg text-link-cool-2 max-w-3xl leading-relaxed">
            Asians Healthcare helps international patients choose relevant doctors, compare
            accredited hospitals, estimate treatment cost, and plan a smoother medical trip to India.
          </p>
        </div>
      </section>

      <section className="bg-canvas-cream py-huge">
        <div className="container-cinematic">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-aloe-10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-aloe-10/90 transition-all duration-300">
                  <stat.icon size={28} className="text-ink" />
                </div>
                <div className="font-display text-display-lg text-ink group-hover:text-aloe-10 transition-colors">{stat.value}</div>
                <p className="text-body-md text-shade-50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <span className="pill-tag-shade mb-4 inline-block">What We Do</span>
              <h2 className="font-display text-display-md lg:text-display-lg text-ink">
                Clear medical guidance before, during, and after treatment
              </h2>
              <p className="mt-5 text-body-lg leading-relaxed text-shade-50">
                We focus on the decisions that matter: correct specialty, reliable hospital,
                transparent estimate, safe travel planning, and accountable coordination.
              </p>

              <div className="mt-8 rounded-lg border border-aloe-10/30 bg-aloe-10/15 p-6">
                <h3 className="font-display text-heading-md text-ink mb-4">Useful support only</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.map((s) => (
                    <div key={s} className="flex items-start gap-3">
                    <Check size={18} className="text-aloe-10 shrink-0 mt-0.5" />
                    <span className="text-body-md text-shade-50">{s}</span>
                  </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-1">
              {careBlocks.map((block) => (
                <div key={block.title} className="overflow-hidden rounded-lg border border-hairline-light bg-canvas-cream">
                  <div className="relative h-44">
                    <Image src={images[block.imageKey]} alt={block.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 100vw" className="object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-heading-sm text-ink">{block.title}</h3>
                    <p className="mt-2 text-body-md leading-relaxed text-shade-50">{block.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
