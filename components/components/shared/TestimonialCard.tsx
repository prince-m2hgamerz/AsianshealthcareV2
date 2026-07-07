import Image from "next/image";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  country: string;
  treatment: string;
  rating: number;
  imageUrl?: string;
}

export default function TestimonialCard({
  quote,
  name,
  country,
  treatment,
  rating,
  imageUrl,
}: TestimonialCardProps) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-lg p-5 hover:shadow-md transition-shadow">
      <Quote size={24} className="text-[#0a7e3d]/20 mb-2" />
      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-4">
        {quote}
      </p>

      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#e8f5e9] shrink-0">
          {imageUrl ? (
            <Image src={imageUrl} alt={name} fill sizes="48px" className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-sm font-bold text-[#0a7e3d]">
              {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1a1a2e]">{name}</p>
          <p className="text-xs text-gray-500">{country} &middot; {treatment}</p>
        </div>
      </div>
    </div>
  );
}
