import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "@/components/forms/ContactForm";
import { Clock, FileText, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { JsonLd } from "@/components/shared/JsonLd";
import { localBusinessSchema, breadcrumbSchema } from "@/lib/json-ld";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Contact Us | Asians Healthcare",
  description: "Contact Asians Healthcare for medical treatment in India. Get a free consultation, cost estimate, and treatment plan within 24 hours.",
  alternates: { canonical: "https://asianshealthcare.com/contact-us" },
};

const responseSteps = [
  { icon: FileText, title: "Share your case", text: "Send your diagnosis, reports, preferred travel month, and budget expectations." },
  { icon: Clock, title: "Get a reply within 24 hours", text: "Our team reviews your inquiry and asks for any missing medical details." },
  { icon: ShieldCheck, title: "Receive matched options", text: "We shortlist suitable doctors, hospitals, and estimated treatment plans." },
];

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const { contact_phone, contact_email, whatsapp_number, images, site_name, meta_description, address_street, address_city, address_state, address_pin_code, facebook_url, twitter_url, instagram_url, linkedin_url, youtube_url } = settings;
  const waNumber = whatsapp_number?.replace(/[^0-9]/g, "") || "918285068544";

  const contactInfo = [
    { icon: MapPin, title: "Address", value: "Unit No. 36 living style mall Jasola New Delhi 110025", href: null },
    { icon: Phone, title: "Phone", value: contact_phone, href: `tel:${contact_phone}` },
    { icon: Mail, title: "Email", value: contact_email, href: `mailto:${contact_email}` },
    { icon: MessageCircle, title: "WhatsApp", value: "Chat on WhatsApp", href: `https://wa.me/${waNumber}` },
  ];

  return (
    <>
      <JsonLd data={localBusinessSchema(settings)} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://asianshealthcare.com" },
        { name: "Contact Us", url: "https://asianshealthcare.com/contact-us" },
      ])} />
      <PageHero
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Ready to start your medical journey? Reach out to us and our team will get back to you within 24 hours."
       />

      <section className="bg-canvas-cream py-10 border-b border-hairline-light">
        <div className="container-cinematic">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {responseSteps.map((step) => (
              <div key={step.title} className="flex gap-4 rounded-lg border border-hairline-light bg-canvas-light p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-aloe-10">
                  <step.icon size={20} className="text-ink" />
                </div>
                <div>
                  <h2 className="font-display text-heading-sm text-ink">{step.title}</h2>
                  <p className="mt-1 text-caption leading-relaxed text-shade-50">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3">
              <h2 className="font-display text-heading-xl text-ink mb-6">Send Us a Message</h2>
              <Suspense fallback={<div className="py-8 text-center text-shade-40">Loading form...</div>}>
                <ContactForm />
              </Suspense>
            </div>
            <div className="lg:col-span-2">
              <h2 className="font-display text-heading-xl text-ink mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-start gap-4 group p-4 rounded-xl bg-canvas-cream border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-0.5 transition-all duration-300">
                      <div className="w-10 h-10 rounded-lg bg-aloe-10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Icon size={20} className="text-ink" />
                      </div>
                      <div>
                        <h3 className="font-display text-heading-sm text-ink mb-1">{item.title}</h3>
                        {item.href ? (
                          <a href={item.href} className="text-body-md text-shade-50 hover:text-ink transition-colors" target={item.href.startsWith("https") ? "_blank" : undefined} rel="noopener noreferrer">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-body-md text-shade-50">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                  return <div key={item.title}>{content}</div>;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-canvas-cream py-huge border-t border-hairline-light">
        <div className="container-cinematic">
          <h2 className="font-display text-heading-xl text-ink mb-8">Find Us on Map</h2>
          <div className="overflow-hidden rounded-xl border border-hairline-light shadow-elevation-3">
            <iframe
              src="https://www.google.com/maps?q=Unit+No.+36+Living+Style+Mall+Jasola+New+Delhi+110025&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Asians Healthcare Location"
            />
          </div>
        </div>
      </section>
    </>
  );
}
