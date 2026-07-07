"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  FileCheck2,
  Languages,
  MapPinned,
  Plane,
  ShieldCheck,
} from "lucide-react";

const supportTracks = [
  {
    title: "Before You Travel",
    icon: FileCheck2,
    items: [
      "Medical report review and specialist shortlisting",
      "Hospital invitation letter for medical visa",
      "Estimated treatment cost and expected stay planning",
    ],
  },
  {
    title: "Arrival and Admission",
    icon: Plane,
    items: [
      "Airport pickup, local SIM guidance, and first-day orientation",
      "Hospital registration and appointment coordination",
      "Interpreter and case manager support during consultations",
    ],
  },
  {
    title: "Treatment and Recovery",
    icon: ShieldCheck,
    items: [
      "Daily care coordination with the hospital team",
      "Hotel or serviced apartment support near the hospital",
      "Discharge planning and remote follow-up after return home",
    ],
  },
];

const assurances = [
  { label: "24-hour opinion", icon: CalendarCheck },
  { label: "Language support", icon: Languages },
  { label: "Local coordination", icon: MapPinned },
];

interface PatientSupportServicesProps {
  imageUrl?: string;
}

export default function PatientSupportServices({ imageUrl }: PatientSupportServicesProps) {
  return (
    <section className="bg-surface py-12 sm:py-huge">
      <div className="container-cinematic">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="pill-tag mb-4 inline-block">Patient Support</span>
            <h2 className="font-display text-display-md lg:text-display-lg text">
              One team for every step of your medical trip
            </h2>
            <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-shade-50">
              Opinion, cost estimate, visa invitation, appointments, local stay, admission,
              interpreter support, and follow-up in one coordinated flow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {assurances.map((assurance) => (
                <div
                  key={assurance.label}
                  className="inline-flex items-center gap-2 rounded-lg border border-hairline-light bg-white px-4 py-2 text-caption text-shade-40"
                >
                  <assurance.icon size={16} className="text-accent" />
                  {assurance.label}
                </div>
              ))}
            </div>
            <Link href="/contact-us" className="btn-accent mt-8">
              Start a Free Case Review
            </Link>
            {imageUrl && (
              <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-lg border border-hairline-light lg:max-w-md">
                <Image src={imageUrl} alt="Healthcare coordinator supporting an international patient" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {supportTracks.map((track) => (
              <div
                key={track.title}
                className="rounded-lg border border-hairline-light bg-white p-5 shadow-elevation-2"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-white">
                  <track.icon size={22} />
                </div>
                <h3 className="font-display text-heading-sm text">{track.title}</h3>
                <ul className="mt-4 space-y-3">
                  {track.items.map((item) => (
                    <li key={item} className="flex gap-2 text-caption leading-relaxed text-shade-50">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
