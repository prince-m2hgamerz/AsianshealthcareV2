import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SiteImageKey } from "@/lib/site-images";
import HorizontalSlider from "@/components/shared/HorizontalSlider";

type ImageMap = Record<SiteImageKey, string>;

const supportCards: Array<{
  title: string;
  text: string;
  imageKey: SiteImageKey;
}> = [
  {
    title: "Free Medical Opinion",
    text: "Share reports and receive a specialist opinion with an estimated treatment plan.",
    imageKey: "image_home_opinion",
  },
  {
    title: "Hospital Matching",
    text: "Compare relevant doctors and accredited hospitals before choosing care.",
    imageKey: "image_home_hospital_match",
  },
  {
    title: "Visa and Travel",
    text: "Get hospital invitation support, travel planning, and stay guidance.",
    imageKey: "image_home_visa_travel",
  },
  {
    title: "Arrival Support",
    text: "Airport pickup, local transport, SIM guidance, hotel, and admission help.",
    imageKey: "image_home_airport_pickup",
  },
  {
    title: "Interpreter Help",
    text: "Language support for consultations, billing, admission, and discharge.",
    imageKey: "image_home_interpreter",
  },
  {
    title: "Follow-Up Care",
    text: "Remote coordination after discharge and after you return home.",
    imageKey: "image_home_followup",
  },
];

const treatmentCards: Array<{
  title: string;
  text: string;
  href: string;
  imageKey: SiteImageKey;
}> = [
  {
    title: "Cardiac Sciences",
    text: "CABG, valve surgery, angioplasty, and cardiac second opinions.",
    href: "/speciality/cardiology",
    imageKey: "image_treatment_cardiac",
  },
  {
    title: "Orthopedics",
    text: "Knee, hip, spine, sports injury, and joint replacement care.",
    href: "/speciality/orthopedics",
    imageKey: "image_treatment_ortho",
  },
  {
    title: "Oncology",
    text: "Cancer diagnosis, chemotherapy, radiation, surgery, and BMT opinions.",
    href: "/speciality/oncology",
    imageKey: "image_treatment_oncology",
  },
  {
    title: "Transplants",
    text: "Kidney, liver, and bone marrow transplant evaluation support.",
    href: "/speciality/transplant",
    imageKey: "image_treatment_transplant",
  },
];

export default function MedicalCareGallery({ images }: { images: ImageMap }) {
  return (
    <section className="bg-surface py-12 sm:py-huge">
      <div className="container-cinematic">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="pill-tag mb-4 inline-block">Medical Assistance</span>
            <h2 className="font-display text-display-md lg:text-display-lg text">Useful support, from reports to return home</h2>
          </div>
          <p className="max-w-xl text-body-md text-shade-50">
            Built around the core needs of overseas patients: opinion, cost, hospital choice, travel, admission, language support, and follow-up.
          </p>
        </div>

        <HorizontalSlider>
          {supportCards.map((card) => (
            <div key={card.title} className="overflow-hidden rounded-lg border border-hairline-light bg-white">
              <div className="relative h-48">
                <Image src={images[card.imageKey]} alt={card.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-heading-md text">{card.title}</h3>
                <p className="mt-2 text-body-md leading-relaxed text-shade-50">{card.text}</p>
              </div>
            </div>
          ))}
        </HorizontalSlider>

        <div className="mt-16">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="pill-tag-shade mb-4 inline-block">Common Treatments</span>
              <h2 className="font-display text-display-md text">High-demand care categories</h2>
            </div>
            <Link href="/treatment-package" className="btn-outline inline-flex gap-2 self-start lg:self-auto">
              View Costs <ArrowRight size={18} />
            </Link>
          </div>

          <HorizontalSlider>
            {treatmentCards.map((card) => (
              <Link key={card.title} href={card.href} className="group overflow-hidden rounded-lg border border-hairline-light bg-white">
                <div className="relative h-44">
                  <Image src={images[card.imageKey]} alt={card.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-heading-sm text">{card.title}</h3>
                  <p className="mt-2 text-caption leading-relaxed text-shade-50">{card.text}</p>
                </div>
              </Link>
            ))}
          </HorizontalSlider>
        </div>
      </div>
    </section>
  );
}
