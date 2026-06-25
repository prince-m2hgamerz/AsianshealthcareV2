type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function organizationSchema(overrides?: Record<string, JsonValue>) {
  return {
    "@type": "MedicalOrganization",
    name: "Med Solution Healthcare",
    alternateName: "Med Solution Healthcare",
    url: "https://medsolutionhealthcare.com",
    telephone: "+918285068544",
    email: "contact@medsolutionhealthcare.com",
    description: "India's trusted medical tourism partner connecting international patients with top hospitals and doctors in Delhi NCR.",
    address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
    areaServed: "Worldwide",
    sameAs: ["https://medsolutionhealthcare.com"],
    ...overrides,
  } as Record<string, JsonValue>;
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    name: "Med Solution Healthcare",
    url: "https://medsolutionhealthcare.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://medsolutionhealthcare.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function hospitalSchema(hospital: {
  name: string;
  description: string;
  city: string;
  state: string;
  beds?: number;
  accreditations?: string[];
  image?: string;
  url: string;
}) {
  return {
    "@type": "Hospital",
    name: hospital.name,
    description: hospital.description,
    url: hospital.url,
    image: hospital.image || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: hospital.city,
      addressRegion: hospital.state,
      addressCountry: "IN",
    },
    numberOfBeds: hospital.beds,
    medicalSpecialty: hospital.accreditations?.length ? hospital.accreditations : undefined,
    availableService: hospital.accreditations?.length
      ? hospital.accreditations.map((a) => ({ "@type": "MedicalService", name: a }))
      : undefined,
  } as Record<string, JsonValue>;
}

export function physicianSchema(doctor: {
  name: string;
  description: string;
  specialty: string;
  image: string;
  url: string;
  qualifications?: string;
  hospitalName?: string;
  hospitalUrl?: string;
}) {
  return {
    "@type": "Physician",
    name: doctor.name,
    description: doctor.description,
    image: doctor.image,
    url: doctor.url,
    medicalSpecialty: doctor.specialty,
    ...(doctor.hospitalName
      ? {
          hospitalAffiliation: {
            "@type": "Hospital",
            name: doctor.hospitalName,
            url: doctor.hospitalUrl || undefined,
          },
        }
      : {}),
  } as Record<string, JsonValue>;
}

export function faqPageSchema(questions: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  } as Record<string, JsonValue>;
}

export function localBusinessSchema(overrides?: Record<string, JsonValue>) {
  return {
    "@type": "LocalBusiness",
    name: "Med Solution Healthcare",
    description: "Medical tourism facilitator connecting international patients with India's top healthcare providers.",
    url: "https://medsolutionhealthcare.com",
    telephone: "+918285068544",
    email: "contact@medsolutionhealthcare.com",
    address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "14:00" },
    ],
    ...overrides,
  } as Record<string, JsonValue>;
}

export function medicalProcedureSchema(procedure: {
  name: string;
  description: string;
  bodyLocation?: string;
  howPerformed?: string;
  preparation?: string;
  followUp?: string;
  cost?: string;
  recoveryTime?: string;
}) {
  return {
    "@type": "MedicalProcedure",
    name: procedure.name,
    description: procedure.description,
    ...(procedure.bodyLocation ? { bodyLocation: procedure.bodyLocation } : {}),
    ...(procedure.howPerformed ? { howPerformed: procedure.howPerformed } : {}),
    ...(procedure.preparation ? { preparation: procedure.preparation } : {}),
    ...(procedure.followUp ? { followUp: procedure.followUp } : {}),
    ...(procedure.cost ? { cost: procedure.cost } : {}),
    ...(procedure.recoveryTime ? { recoveryTime: procedure.recoveryTime } : {}),
  } as Record<string, JsonValue>;
}

export function aboutPageSchema() {
  return {
    "@type": "AboutPage",
    name: "About Med Solution Healthcare",
    description: "India's trusted medical tourism facilitator connecting international patients with top hospitals and doctors.",
    url: "https://medsolutionhealthcare.com/about-us",
  } as Record<string, JsonValue>;
}

export function reviewSchema(reviews: { name: string; reviewBody: string; ratingValue: number; datePublished?: string }[]) {
  return {
    "@type": "AggregateRating",
    ratingValue: 4.8,
    bestRating: 5,
    ratingCount: reviews.length,
    itemReviewed: { "@type": "Organization", name: "Med Solution Healthcare" },
  } as Record<string, JsonValue>;
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  } as Record<string, JsonValue>;
}
