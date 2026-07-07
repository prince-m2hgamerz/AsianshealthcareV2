"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const treatmentLinks = [
  { label: "Cardiology", href: "/speciality/cardiology" },
  { label: "Orthopedics", href: "/speciality/orthopedics" },
  { label: "Neurology", href: "/speciality/neurology" },
  { label: "Oncology", href: "/speciality/oncology" },
  { label: "Knee Replacement", href: "/treatment-package/knee-replacement" },
  { label: "Hip Replacement", href: "/treatment-package/hip-replacement" },
  { label: "Spine Surgery", href: "/treatment-package/spine-surgery" },
  { label: "Hair Transplant", href: "/treatment-package/hair-transplant" },
  { label: "IVF Treatment", href: "/treatment-package/ivf-treatment" },
  { label: "Kidney Transplant", href: "/treatment-package/kidney-transplant" },
  { label: "Liver Transplant", href: "/treatment-package/liver-transplant" },
  { label: "Bariatric Surgery", href: "/treatment-package/bariatric-surgery" },
];

const quickLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Doctors", href: "/doctors" },
  { label: "Hospitals", href: "/hospitals" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blogs", href: "/blogs" },
  { label: "Treatment Packages", href: "/treatment-package" },
  { label: "Specialities", href: "/speciality" },
  { label: "Medical Tourism", href: "/tourism" },
  { label: "Contact", href: "/contact-us" },
];

const patientLinks = [
  { label: "Why Choose Us", href: "/about-us" },
  { label: "How It Works", href: "/tourism" },
  { label: "Visa Assistance", href: "/contact-us" },
  { label: "Hotel Booking", href: "/hotels" },
  { label: "Insurance Partners", href: "/insurance-company" },
  { label: "Patient Stories", href: "/testimonials" },
];

export default function Footer() {
  const { site_name, contact_phone, contact_email, address_street, address_city, address_state, address_pin_code, maps_embed_url, copyright_text, footer_tagline } = useSiteSettings();

  const allQuickLinks = [...quickLinks, ...patientLinks].filter(
    (link, i, arr) => arr.findIndex((l) => l.href === link.href) === i
  );

  return (
    <footer className="bg-surface border-t border-hairline-light">
      <div className="container-cinematic py-10 sm:py-16 lg:py-huge">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="font-display text-heading-sm sm:text-heading-lg tracking-wide text">
              {site_name}
            </Link>
            <p className="text-caption text-shade-50 leading-relaxed mt-3 sm:mt-4">
              {footer_tagline}
            </p>
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-caption text-shade-50">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-accent" />
                <span>{address_street}, {address_city}, {address_state} {address_pin_code}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-accent" />
                <a href={`tel:${contact_phone}`} className="hover:text-accent transition-colors">{contact_phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-accent" />
                <a href={`mailto:${contact_email}`} className="hover:text-accent transition-colors">{contact_email}</a>
              </div>
            </div>

            {/* Map */}
            <div className="mt-6 overflow-hidden rounded-lg border border-hairline-light">
              <iframe
                src={maps_embed_url}
                width="100%"
                height="160"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Asians Healthcare Location"
              />
            </div>

            {/* Language Switcher */}
            <div className="mt-6 pt-6 border-t border-hairline-light">
              <h4 className="text-caption uppercase tracking-widest text-shade-40 mb-3">Language</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-micro font-medium border border-accent/30">EN</span>
                <span className="px-3 py-1 rounded-full text-shade-40 text-micro border border-hairline-light hover:bg-shade-10 transition-colors cursor-pointer">AR</span>
                <span className="px-3 py-1 rounded-full text-shade-40 text-micro border border-hairline-light hover:bg-shade-10 transition-colors cursor-pointer">FR</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-caption sm:text-eyebrow-cap uppercase tracking-widest text-accent mb-3 sm:mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {allQuickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-caption text-shade-50 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatments & Specialities */}
          <div>
            <h4 className="text-caption sm:text-eyebrow-cap uppercase tracking-widest text-accent mb-3 sm:mb-4">
              Treatments
            </h4>
            <ul className="space-y-2">
              {treatmentLinks.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-caption text-shade-50 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/treatment-package" className="text-caption text-shade-50 hover:text-accent transition-colors mt-2 inline-block">
              View all &rarr;
            </Link>

            <h4 className="text-caption sm:text-eyebrow-cap uppercase tracking-widest text-accent mb-3 mt-6 pt-6 border-t border-hairline-light">
              Specialities
            </h4>
            <ul className="space-y-2">
              <li><Link href="/speciality/cardiology" className="text-caption text-shade-50 hover:text-accent transition-colors">Cardiology</Link></li>
              <li><Link href="/speciality/orthopedics" className="text-caption text-shade-50 hover:text-accent transition-colors">Orthopedics</Link></li>
              <li><Link href="/speciality/neurology" className="text-caption text-shade-50 hover:text-accent transition-colors">Neurology</Link></li>
              <li><Link href="/speciality/oncology" className="text-caption text-shade-50 hover:text-accent transition-colors">Oncology</Link></li>
              <li><Link href="/speciality/gastroenterology" className="text-caption text-shade-50 hover:text-accent transition-colors">Gastroenterology</Link></li>
              <li><Link href="/speciality/nephrology" className="text-caption text-shade-50 hover:text-accent transition-colors">Nephrology</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-hairline-light py-4 sm:py-6">
        <div className="container-cinematic flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-micro text-shade-40 text-center sm:text-left">
            &copy; {new Date().getFullYear()} {copyright_text}
          </p>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/privacy-policy" className="text-micro text-shade-40 hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-micro text-shade-40 hover:text-accent transition-colors">Terms of Service</Link>
            <Link href="/refund-policy" className="text-micro text-shade-40 hover:text-accent transition-colors">Refund Policy</Link>
            <Link href="/disclaimer" className="text-micro text-shade-40 hover:text-accent transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
