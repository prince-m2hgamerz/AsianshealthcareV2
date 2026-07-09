import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, Car, HeartPulse, Hotel, Languages, MapPinned, Plane, ShieldCheck } from "lucide-react";
import { getSiteImages } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Medical Tourism in India | Asians Healthcare",
  description: "Complete medical tourism guide for India. Visa assistance, airport pickup, hotel booking, interpreter services, and recovery coordination for international patients.",
  alternates: { canonical: "https://asianshealthcare.com/tourism" },
};

const destinationCopy = [
  {
    name: "Delhi NCR",
    desc: "Major hospital hub with cardiac, oncology, orthopedic, transplant, and robotic surgery programs.",
    imageKey: "image_tourism_delhi_ncr",
  },
  {
    name: "Agra",
    desc: "Short recovery-friendly heritage visit from Delhi, best planned after doctor clearance.",
    imageKey: "image_tourism_agra",
  },
  {
    name: "Jaipur",
    desc: "Comfortable post-treatment cultural route with premium hotels and calm sightseeing options.",
    imageKey: "image_tourism_jaipur",
  },
  {
    name: "Kerala",
    desc: "A slower recovery environment for patients cleared for travel after longer treatment plans.",
    imageKey: "image_tourism_kerala",
  },
  {
    name: "Mumbai",
    desc: "Strong specialty-care access with international airport connectivity and extended-stay hotels.",
    imageKey: "image_tourism_mumbai",
  },
  {
    name: "Goa",
    desc: "A relaxed coastal recovery extension for patients who have completed primary medical care.",
    imageKey: "image_tourism_goa",
  },
] as const;

const planningSteps = [
  { icon: CalendarDays, title: "Treatment timeline", text: "We map consultation, admission, expected stay, discharge, and follow-up windows before travel." },
  { icon: Plane, title: "Visa and flights", text: "Hospital invitation letters, embassy document guidance, and arrival-date planning." },
  { icon: Hotel, title: "Recovery stay", text: "Hotels and serviced apartments near the hospital, selected for patient comfort and caregiver access." },
  { icon: Car, title: "Local transport", text: "Airport pickup, hospital transfers, and planned recovery-safe local movement." },
  { icon: Languages, title: "Interpreter support", text: "Language coordination for consultations, hospital admission, billing, and discharge instructions." },
  { icon: ShieldCheck, title: "Doctor clearance", text: "Sightseeing and onward travel are planned only around your treating doctor's advice." },
];

export default async function TourismPage() {
  const images = await getSiteImages();
  const destinations = destinationCopy.map((destination) => ({
    ...destination,
    image: images[destination.imageKey],
  }));

  return (
    <>
      <section className="relative overflow-hidden bg-primary text-on-primary">
        <div className="absolute inset-0">
          <Image
            src={images.image_tourism_hero}
            alt="India Gate in New Delhi"
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-35"
          />
        </div>
        <div className="absolute inset-0 bg-primary/75" />
        <div className="container-cinematic relative z-10 py-24 lg:py-32">
          <span className="pill-tag mb-4 inline-block">Medical Tourism</span>
          <h1 className="font-display text-[44px] leading-[0.98] sm:text-display-xl lg:text-display-xxl text-on-primary">
            Treatment in India, planned around recovery
          </h1>
          <p className="mt-6 max-w-3xl text-body-lg leading-relaxed text-text-muted">
            Asians Healthcare helps international patients combine high-quality medical care with practical travel
            support: visa documentation, airport pickup, interpreter support, accommodation, hospital
            transfers, and optional recovery-safe sightseeing after doctor approval.
          </p>
        </div>
      </section>

      <section className="bg-surface py-huge">
        <div className="container-cinematic">
          <div className="mb-12 max-w-3xl">
            <span className="pill-tag mb-4 inline-block">Trip Planning</span>
            <h2 className="font-display text-display-md text-text">What we coordinate for patients</h2>
            <p className="mt-4 text-body-lg leading-relaxed text-shade-50">
              A medical trip needs different planning from a vacation. We keep comfort, hospital proximity,
              documentation, caregiver needs, and recovery restrictions at the center of the itinerary.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {planningSteps.map((step) => (
              <div key={step.title} className="rounded-lg border border-hairline-light bg-surface p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                  <step.icon size={22} className="text-text" />
                </div>
                <h3 className="font-display text-heading-md text-text">{step.title}</h3>
                <p className="mt-2 text-body-md leading-relaxed text-shade-50">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-huge">
        <div className="container-cinematic">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="pill-tag mb-4 inline-block">Recovery Extensions</span>
              <h2 className="font-display text-display-md text-text">Popular patient-friendly routes</h2>
            </div>
            <p className="max-w-xl text-body-md leading-relaxed text-shade-50">
              Destinations are suggested only after medical clearance and are adjusted for mobility,
              procedure type, follow-up schedule, and caregiver preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
              <div key={destination.name} className="group overflow-hidden rounded-lg border border-hairline-light bg-surface">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2 text-caption text-shade-50">
                    <MapPinned size={15} />
                    Recovery route
                  </div>
                  <h3 className="font-display text-heading-md text-text">{destination.name}</h3>
                  <p className="mt-2 text-body-md leading-relaxed text-shade-50">{destination.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-huge text-on-primary">
        <div className="container-content text-center">
          <HeartPulse size={42} className="mx-auto mb-5 text-accent" />
          <h2 className="font-display text-display-md text-on-primary">Medical decisions come first</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-text-muted">
            Tourism plans are optional and always secondary to your treatment plan. Our team coordinates
            recovery stays and local travel around your doctor&apos;s advice, not the other way around.
          </p>
        </div>
      </section>
    </>
  );
}
