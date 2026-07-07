"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  resultCount?: number;
  label?: string;
}

function SearchInputInner({
  placeholder = "Search...",
  resultCount,
  label = "Search",
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";
  const [value, setValue] = useState(currentQuery);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updateUrl = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
      const qs = params.toString();
      router.push(qs ? `?${qs}` : window.location.pathname, { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value === currentQuery) return;
    debounceRef.current = setTimeout(() => updateUrl(value), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, currentQuery, updateUrl]);

  function handleClear() {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const qs = params.toString();
    router.push(qs ? `?${qs}` : window.location.pathname, { scroll: false });
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="relative flex-1 w-full">
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
            focused ? "text" : "text-shade-40"
          }`}
          size={20}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label={label}
          placeholder={placeholder}
          className={`w-full border border-hairline-light rounded-pill pl-12 pr-11 py-3 text-body-md text placeholder:text-shade-40 outline-none transition-all bg-white ${
            focused
              ? "border-primary-mid ring-1 ring-primary-mid/20"
              : "border-hairline-light"
          }`}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-shade-40 hover:text transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
      {resultCount !== undefined && (
        <p className="text-caption text-shade-40 whitespace-nowrap shrink-0">
          {resultCount} result{resultCount !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

export default function SearchInput(props: SearchInputProps) {
  return (
    <Suspense fallback={<div className="h-12" />}>
      <SearchInputInner {...props} />
    </Suspense>
  );
}
