import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { fallbackHotels } from "@/lib/fallback-data";
import PageHero from "@/components/layout/PageHero";
import SearchInput from "@/components/layout/SearchInput";
 
 export const metadata: Metadata = {
  title: "Hotels Near Hospitals | Asians Healthcare",
  description: "Find comfortable accommodation near partner hospitals for your medical stay in India. Ranging from budget to luxury hotels in Delhi NCR.",
  alternates: { canonical: "https://asianshealthcare.com/hotels" },
};

export default async function HotelsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const query = typeof sp?.q === "string" ? sp.q.trim() : "";
  const normalizedQuery = query.toLowerCase();

  const allHotels = fallbackHotels;
  const hotels = normalizedQuery
    ? allHotels.filter((hotel) =>
        [hotel.name, hotel.address, hotel.near]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : allHotels;

  return (
    <>
      <PageHero
        eyebrow="Accommodation"
        title="Hotels Near Hospitals"
        description="Comfortable accommodation options near our partner hospitals for your medical stay."
       />

      <section className="bg-canvas-cream py-12 border-b border-hairline-light">
        <div className="container-cinematic">
          <SearchInput
            placeholder="Search hotels by area or hospital..."
            label="Search hotels"
            resultCount={hotels.length}
          />
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          {hotels.length === 0 ? (
            <div className="text-center border border-hairline-light rounded-lg p-10 bg-canvas-cream">
              <h2 className="font-display text-heading-lg text-ink">No hotels found</h2>
              <p className="text-body-md text-shade-50 mt-2">Try a different area, hospital, or hotel name.</p>
              <Link href="/hotels" className="btn-primary mt-6">
                Clear Search
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <div key={`${hotel.name}-${hotel.address}`} className="overflow-hidden bg-canvas-cream rounded-lg border border-hairline-light hover:shadow-elevation-3 transition-all">
                  <div className="relative h-44 bg-canvas-light">
                    <Image
                      src={hotel.photo_url}
                      alt={hotel.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: hotel.stars }).map((_, index) => (
                        <Star key={index} size={14} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <h2 className="font-display text-heading-md text-ink mb-2">{hotel.name}</h2>
                    {hotel.description && (
                      <p className="text-caption text-shade-50 mb-2 line-clamp-2">{hotel.description}</p>
                    )}
                    <div className="flex items-center gap-1 text-caption text-shade-40 mb-2">
                      <MapPin size={14} /><span>{hotel.address}</span>
                    </div>
                    <span className="text-body-md text-ink font-medium">{hotel.price}</span>
                    {hotel.near && <p className="text-caption text-shade-40 mt-2">Near {hotel.near}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
