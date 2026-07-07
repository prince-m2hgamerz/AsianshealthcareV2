import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Download, ArrowRight, BookOpen, CheckCircle } from "lucide-react";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";

export const metadata: Metadata = {
  title: "Free Medical Tourism Guides",
  description: "Download free guides on medical tourism in India. Treatment cost guides, visa procedures, hospital comparisons, and patient checklists.",
  alternates: { canonical: "/guides" },
};

const guides = [
  { title: "Medical Tourism in India: Complete Guide", description: "Everything you need to know about traveling to India for medical treatment — hospitals, visas, costs, and planning.", icon: BookOpen },
  { title: "India Medical Visa Guide", description: "Step-by-step instructions for obtaining a medical visa for India. Documents, timelines, and tips for a smooth application.", icon: FileText },
  { title: "Treatment Cost Comparison Guide", description: "Compare costs for 20+ procedures across India, USA, UK, Canada, and Australia. See exactly how much you can save.", icon: FileText },
  { title: "Patient Preparation Checklist", description: "What to pack, what to expect, and how to prepare for your medical journey to India. Includes pre-travel health tips.", icon: CheckCircle },
  { title: "Top Hospitals in Delhi NCR Guide", description: "Profiles of JCI and NABH accredited hospitals in Delhi NCR with specialty highlights and international patient services.", icon: BookOpen },
  { title: "Recovery & Follow-up Planning", description: "Plan your recovery stay in India and set up remote follow-up care after returning home. Includes telemedicine setup.", icon: FileText },
];

export default function GuidesPage() {
  return (
    <>
      <BreadcrumbNav items={[
        { label: "Home", href: "/" },
        { label: "Free Guides", href: "/guides" },
      ]} />
      <section className="bg-canvas-night text-on-primary py-16 sm:py-20">
        <div className="container-cinematic text-center">
          <span className="pill-tag mb-4">Free Resources</span>
          <h1 className="font-display text-display-md lg:text-display-lg text-on-primary mb-3">Free Medical Tourism Guides</h1>
          <p className="text-body-lg text-link-cool-2 max-w-2xl mx-auto">Download our comprehensive guides to plan your medical treatment journey to India with confidence.</p>
        </div>
      </section>

      <section className="bg-canvas-light py-12 sm:py-huge">
        <div className="container-cinematic">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {guides.map((guide) => (
              <div key={guide.title} className="group bg-canvas-cream rounded-xl border border-hairline-light p-5 sm:p-6 hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-aloe-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <guide.icon size={22} className="sm:size-[24] text-ink" />
                </div>
                <h2 className="font-display text-heading-md text-ink mb-2 group-hover:text-shade-60 transition-colors">{guide.title}</h2>
                <p className="text-body-md text-shade-50 mb-5 flex-1">{guide.description}</p>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-pill text-body-md font-medium border border-aloe-10/40 text-ink hover:bg-aloe-10 hover:text-ink transition-colors"
                >
                  <Download size={16} /> Download Free <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-12 bg-gradient-to-br from-canvas-cream to-canvas-light rounded-xl border border-hairline-light p-6 sm:p-8">
            <div className="w-14 h-14 rounded-full bg-aloe-10/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-aloe-10" />
            </div>
            <h2 className="font-display text-heading-lg text-ink mb-2">Need a personalized guide?</h2>
            <p className="text-body-md text-shade-50 mb-6 max-w-md mx-auto">Our team can create a custom treatment plan with cost estimates matched to your medical needs.</p>
            <Link href="/contact-us" className="btn-primary inline-flex items-center gap-2">
              Get Your Free Custom Plan <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
