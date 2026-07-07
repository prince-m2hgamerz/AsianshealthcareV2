"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function HospitalSearch() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Search hospitals by name, city, or accreditation..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-pill pl-12 pr-4 py-3.5 text-body-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
      />
    </div>
  );
}
