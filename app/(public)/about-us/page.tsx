import type { Metadata } from "next";
import Image from "next/image";
import {
  Shield, Users, Award, Globe, Check,
  HeartPulse, Clock, DollarSign, Building2,
  BadgeCheck, HeartHandshake, Stethoscope, MessageSquareText,
} from "lucide-react";
import { getSiteSettings, getSiteImages } from "@/lib/site-settings";
import type { SiteImageKey } from "@/lib/site-images";
import { JsonLd } from "@/components/shared/JsonLd";
import { organizationSchema, aboutPageSchema, breadcrumbSchema } from "@/lib/json-ld";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";
import GetConsultation from "@/components/home/GetConsultation";

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

const highlights = [
  { icon: Shield, text: "NABH & JCI Accredited Hospitals" },
  { icon: Users, text: "500+ International Patients Served" },
  { icon: Globe, text: "Patients from 30+ Countries" },
  { icon: HeartPulse, text: "Free Medical Opinion & Cost Estimate" },
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

const features = [
  { icon: Clock, title: "24-Hour Opinion", description: "Share reports and get a specialist opinion with cost estimate." },
  { icon: MessageSquareText, title: "3 Care Options", description: "Compare relevant doctors and hospitals before deciding." },
  { icon: DollarSign, title: "Direct Hospital Pricing", description: "Transparent estimates with no extra service fee." },
  { icon: Globe, title: "Visa and Travel Help", description: "Invitation letter, pickup, hotel, SIM, and local support." },
  { icon: Building2, title: "Accredited Hospitals", description: "NABH and JCI hospital options across major Indian cities." },
  { icon: HeartHandshake, title: "Case Manager", description: "One coordinator from first inquiry to discharge." },
  { icon: BadgeCheck, title: "Interpreter Support", description: "Clear communication during admission and consultation." },
  { icon: Stethoscope, title: "Follow-Up", description: "Remote guidance after you return home." },
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
      <BreadcrumbNav items={[{ label: "About Us", href: "/about-us" }]} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-on-primary">
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
        <div className="absolute inset-0 bg-primary" />
        <div className="container-cinematic relative z-10 py-16 sm:py-24 lg:py-32">
          <span className="pill-tag mb-4 inline-block">About Us</span>
          <h1 className="font-display text-[36px] leading-[1.05] sm:text-display-xl lg:text-display-xxl tracking-wide mb-6">
            India&apos;s Trusted
            <br />
            <span className="text-accent">Medical Tourism Partner</span>
          </h1>
          <p className="text-body-md sm:text-body-lg text-white/70 max-w-3xl leading-relaxed">
            Asians Healthcare helps international patients choose relevant doctors, compare
            accredited hospitals, estimate treatment cost, and plan a smoother medical trip to India.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-surface py-12 sm:py-huge border-b border-hairline-light">
        <div className="container-cinematic">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-heading-xl lg:text-display-md text">
              Trusted by Patients Worldwide
            </h2>
            <p className="text-body-md text-shade-50 mt-2">
              Numbers that speak for our commitment to quality healthcare
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-all duration-300">
                  <stat.icon size={26} className="text-primary" />
                </div>
                <div className="font-display text-display-md sm:text-display-lg text group-hover:text-accent transition-colors">
                  {stat.value}
                </div>
                <p className="text-body-sm sm:text-body-md text-shade-50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="bg-white py-12 sm:py-huge overflow-hidden">
        <div className="container-cinematic">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <span className="pill-tag mb-4 inline-block">Who We Are</span>
              <h2 className="font-display text-display-md lg:text-display-lg text mt-4">
                Your Trusted Medical Tourism Partner in India
              </h2>
              <p className="text-body-md sm:text-body-lg text-shade-50 mt-5 sm:mt-6 leading-relaxed">
                {settings?.site_name || "Asians Healthcare"} is a medical assistance company that works as a
                complete medical guide for international patients seeking world-class treatment in India.
                We connect you with the right doctors and hospitals for your specific medical needs.
              </p>
              <p className="text-body-md text-shade-50 mt-4 leading-relaxed">
                We are committed to providing seamless healthcare coordination — from your first inquiry
                to post-treatment follow-up. Our team assists with visa processing, hotel accommodation,
                airport transfers, interpreter services, and 24/7 patient support throughout your stay in India.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                {highlights.map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                      <item.icon size={20} className="text-primary" />
                    </div>
                    <span className="text-body-sm sm:text-body-md text font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-elevation-3 aspect-[4/3]">
                <Image
                  src={images.image_about_hero}
                  alt="Healthcare coordinator helping a patient"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-5 shadow-elevation-3 border border-hairline-light hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <HeartPulse size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-heading-md text">8+ Years</p>
                    <p className="text-caption text-shade-50">Of Medical Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-surface py-12 sm:py-huge">
        <div className="container-cinematic">
          <div className="text-center mb-10 sm:mb-14">
            <span className="pill-tag mb-4 inline-block">What We Do</span>
            <h2 className="font-display text-display-md lg:text-display-lg text mt-4">
              Clear medical guidance before, during, and after treatment
            </h2>
            <p className="text-body-md sm:text-body-lg text-shade-50 max-w-2xl mx-auto mt-3 sm:mt-4">
              We focus on the decisions that matter: correct specialty, reliable hospital,
              transparent estimate, safe travel planning, and accountable coordination.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {careBlocks.map((block) => (
              <div
                key={block.title}
                className="overflow-hidden rounded-xl border border-hairline-light bg-white hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative h-44 sm:h-48">
                  <Image
                    src={images[block.imageKey]}
                    alt={block.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-display text-heading-sm text">{block.title}</h3>
                  <p className="mt-2 text-body-md leading-relaxed text-shade-50">{block.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-12 sm:py-huge">
        <div className="container-cinematic">
          <div className="text-center mb-10 sm:mb-14">
            <span className="pill-tag mb-4 inline-block">Why Choose Us</span>
            <h2 className="font-display text-display-md lg:text-display-lg text mt-4">
              Why Patients Choose {settings?.site_name || "Asians Healthcare"}
            </h2>
            <p className="text-body-md sm:text-body-lg text-shade-50 max-w-2xl mx-auto mt-3 sm:mt-4">
              Practical support for overseas patients seeking treatment in India.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-5 sm:p-6 border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-3 sm:mb-4">
                  <feature.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-display text-heading-sm text mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-body-sm sm:text-body-md text-shade-50 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="bg-surface py-12 sm:py-huge">
        <div className="container-cinematic">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <span className="pill-tag mb-4 inline-block">Our Services</span>
              <h2 className="font-display text-display-md lg:text-display-lg text mt-4">
                Comprehensive Support for International Patients
              </h2>
              <p className="text-body-md sm:text-body-lg text-shade-50 max-w-2xl mx-auto mt-3 sm:mt-4">
                We coordinate every aspect of your medical journey — from first inquiry to follow-up
                care after you return home.
              </p>
            </div>
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {services.map((s) => (
                  <div key={s} className="flex items-start gap-3">
                    <Check size={18} className="text-accent shrink-0 mt-0.5" />
                    <span className="text-body-md text-shade-60">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <GetConsultation />
    </>
  );
}
