"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, Filter, ChevronDown, ChevronUp, Building2,
  Stethoscope, User, SlidersHorizontal,
} from "lucide-react";
import { allDoctors as allDoctorsFallback, HOSPITALS, type Doctor } from "@/lib/doctors-data";

// ─── constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 24;

const GENDER_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const words = name.replace(/^Dr\.?\s*/i, "").split(" ").filter(Boolean);
  return words.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function hashColor(name: string): string {
  const colors = [
    "bg-primary", "bg-accent", "bg-pistachio",
    "bg-aloe", "bg-gold", "bg-primary/80",
    "bg-accent/80", "bg-pistachio/80", "bg-aloe/80",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = Math.trunc(hash * 31 + name.codePointAt(i)!);
  return colors[Math.abs(hash) % colors.length];
}

// ─── sub-components ───────────────────────────────────────────────────────────

function AvatarPhoto({ doctor }: { readonly doctor: Doctor }) {
  const [err, setErr] = useState(false);
  if (!doctor.photo_url || err) {
    return (
      <div className={`w-full h-full flex items-center justify-center text-ink font-bold text-2xl ${hashColor(doctor.name)}`}>
        {getInitials(doctor.name)}
      </div>
    );
  }
  return (
    <Image
      src={doctor.photo_url}
      alt={doctor.name}
      fill
      unoptimized
      sizes="(max-width: 640px) 50vw, 200px"
      className="object-cover object-top"
      onError={() => setErr(true)}
    />
  );
}

function DoctorCard({ doctor, index }: { readonly doctor: Doctor; readonly index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4) }}
      className="group bg-canvas-light rounded-xl border border-hairline-light overflow-hidden hover:shadow-elevation-3 transition-all duration-300 flex flex-col"
    >
      {/* Photo */}
      <div className="relative h-48 bg-canvas-cream overflow-hidden">
        <AvatarPhoto doctor={doctor} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Hospital badge */}
        <div className="absolute bottom-2 left-2 right-2">
          <span className="inline-flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full truncate max-w-full">
            <Building2 size={10} className="shrink-0" />
            <span className="truncate">{doctor.hospital}</span>
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-display text-heading-sm text-ink leading-tight group-hover:text-shade-60 transition-colors line-clamp-2">
          {doctor.name}
        </h3>

        {doctor.specialty && doctor.specialty !== "Specialist" && doctor.expertise.length === 0 && (
          <div className="flex items-center gap-1.5 text-caption text-shade-50">
            <Stethoscope size={13} className="shrink-0 text-link-mint" />
            <span className="truncate">{doctor.specialty}</span>
          </div>
        )}

        {doctor.designation && doctor.designation !== "Consultant" && (
          <p className="text-micro text-shade-40 line-clamp-2 leading-relaxed">{doctor.designation}</p>
        )}

        {doctor.qualifications && (
          <p className="text-micro text-shade-40 line-clamp-1">{doctor.qualifications}</p>
        )}

        {doctor.telephone && (
          <p className="text-micro text-shade-40 flex items-center gap-1">
            <span>📞</span>
            <span>{doctor.telephone}</span>
          </p>
        )}

        {doctor.expertise.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {doctor.expertise.slice(0, 2).map((e) => (
              <span key={e} className="pill-tag !text-[10px] !px-2 !py-0.5 truncate max-w-[130px]">{e}</span>
            ))}
            {doctor.expertise.length > 2 && (
              <span className="pill-tag !text-[10px] !px-2 !py-0.5">+{doctor.expertise.length - 2}</span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-3 flex gap-2">
          <Link
            href={`/contact-us?doctor=${encodeURIComponent(doctor.name)}&hospital=${encodeURIComponent(doctor.hospital)}&specialty=${encodeURIComponent(doctor.specialty || "")}`}
            className="btn-primary !text-micro !px-3 !py-2 flex-1 text-center"
          >
            Get Consultation
          </Link>

        </div>
      </div>
    </motion.div>
  );
}

// ─── Collapsible filter section ───────────────────────────────────────────────

function FilterSection({
  title,
  icon,
  defaultOpen = true,
  children,
}: {
  readonly title: string;
  readonly icon?: React.ReactNode;
  readonly defaultOpen?: boolean;
  readonly children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-hairline-light last:border-0 pb-4 mb-4 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="flex items-center gap-2 text-caption font-semibold text-ink uppercase tracking-[0.08em]">
          {icon}
          {title}
        </span>
        {open ? <ChevronUp size={15} className="text-shade-40" /> : <ChevronDown size={15} className="text-shade-40" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function DoctorsClient({ doctors: doctorsProp }: { readonly doctors?: readonly Doctor[] }) {
  const allDoctors = doctorsProp ?? allDoctorsFallback;
  const router = useRouter();
  const params = useSearchParams();

  const q = params.get("q") ?? "";
  const selectedHospital = params.get("hospital") ?? "";
  const selectedSpecialties = params.getAll("specialty");
  const selectedGender = params.get("gender") ?? "";
  const page = Number.parseInt(params.get("page") ?? "1", 10);

  const [localQ, setLocalQ] = useState(q);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep local search in sync if URL changes externally
  useEffect(() => { setLocalQ(q); }, [q]);

  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const sp = new URLSearchParams(params.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) sp.set(k, v);
        else sp.delete(k);
      });
      sp.delete("page"); // reset page on any filter change
      router.push("?" + sp.toString(), { scroll: false });
    },
    [params, router]
  );

  const handleSearch = useCallback(
    (val: string) => {
      setLocalQ(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        pushParams({ q: val });
      }, 350);
    },
    [pushParams]
  );

  const toggleSpecialty = useCallback(
    (label: string) => {
      const sp = new URLSearchParams(params.toString());
      const current = sp.getAll("specialty");
      sp.delete("specialty");
      if (current.includes(label)) {
        current.filter((s) => s !== label).forEach((s) => sp.append("specialty", s));
      } else {
        [...current, label].forEach((s) => sp.append("specialty", s));
      }
      sp.delete("page");
      router.push("?" + sp.toString(), { scroll: false });
    },
    [params, router]
  );

  const clearAll = useCallback(() => {
    setLocalQ("");
    router.push("/doctors", { scroll: false });
  }, [router]);

  const hasFilters = !!(q || selectedHospital || selectedSpecialties.length > 0 || selectedGender);

  // Build specialty list from data (non-empty, sorted by frequency)
  const ALL_SPECIALTIES = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of allDoctors) {
      const specs = d.allSpecialties?.length ? d.allSpecialties : [d.specialty];
      for (const s of specs) {
        if (s && s !== "Specialist") {
          counts[s] = (counts[s] ?? 0) + 1;
        }
      }
    }
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [allDoctors]);

  // Count per hospital for filter labels
  const hospitalCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of allDoctors) counts[d.hospitalSlug] = (counts[d.hospitalSlug] ?? 0) + 1;
    return counts;
  }, [allDoctors]);

  // Filtered doctors
  const filtered = useMemo(() => {
    const lq = q.toLowerCase();
    return allDoctors.filter((d) => {
      if (selectedHospital && d.hospitalSlug !== selectedHospital) return false;
      if (selectedSpecialties.length > 0) {
        const ds = d.allSpecialties?.length ? d.allSpecialties : [d.specialty];
        if (!ds.some((s) => selectedSpecialties.includes(s))) return false;
      }
      if (selectedGender && d.gender !== selectedGender) return false;
      if (lq) {
        const haystack = [d.name, d.specialty, ...(d.allSpecialties || []), d.hospital, d.designation, ...d.expertise].join(" ").toLowerCase();
        if (!haystack.includes(lq)) return false;
      }
      return true;
    });
  }, [q, selectedHospital, selectedSpecialties, selectedGender, allDoctors]);

  // Paginated
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goPage = (p: number) => {
    const sp = new URLSearchParams(params.toString());
    if (p > 1) sp.set("page", String(p));
    else sp.delete("page");
    router.push("?" + sp.toString(), { scroll: true });
  };

  const specialtiesToShow = showAllSpecialties ? ALL_SPECIALTIES : ALL_SPECIALTIES.slice(0, 14);

  // Sidebar content (shared between desktop sidebar and mobile drawer)
  const filterSidebar = (
    <div className="space-y-0">
      {/* Search */}
      <FilterSection title="Search" icon={<Search size={14} />}>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-shade-40 pointer-events-none" />
          <input
            type="text"
            value={localQ}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Name, specialty, expertise..."
            className="w-full pl-8 pr-8 py-2.5 rounded-lg border border-hairline-light bg-canvas-cream text-caption text-ink placeholder:text-shade-40 focus:outline-none focus:ring-2 focus:ring-link-mint transition"
          />
          {localQ && (
            <button onClick={() => handleSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-shade-40 hover:text-ink">
              <X size={14} />
            </button>
          )}
        </div>
      </FilterSection>

      {/* Hospital */}
      <FilterSection title="Hospital" icon={<Building2 size={14} />}>
        <div className="space-y-2">
          {HOSPITALS.map((h) => (
            <label key={h.slug} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="hospital"
                checked={selectedHospital === h.slug}
                onChange={() => pushParams({ hospital: selectedHospital === h.slug ? "" : h.slug })}
                className="accent-black w-4 h-4 cursor-pointer"
              />
              <span className="text-caption text-shade-60 group-hover:text-ink transition-colors flex-1 leading-tight">{h.name}</span>
              <span className="text-micro text-shade-40 tabular-nums">{hospitalCounts[h.slug] ?? 0}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Specialty */}
      <FilterSection title="Specialty" icon={<Stethoscope size={14} />}>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {specialtiesToShow.map(({ label, count }) => (
            <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedSpecialties.includes(label)}
                onChange={() => toggleSpecialty(label)}
                className="accent-black w-4 h-4 cursor-pointer"
              />
              <span className="text-caption text-shade-60 group-hover:text-ink transition-colors flex-1 leading-tight">{label}</span>
              <span className="text-micro text-shade-40 tabular-nums">{count}</span>
            </label>
          ))}
        </div>
        {ALL_SPECIALTIES.length > 14 && (
          <button
            onClick={() => setShowAllSpecialties(!showAllSpecialties)}
            className="mt-2 text-micro text-link-mint hover:underline flex items-center gap-1"
          >
            {showAllSpecialties ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> Show {ALL_SPECIALTIES.length - 14} more</>}
          </button>
        )}
      </FilterSection>

      {/* Gender */}
      <FilterSection title="Gender" icon={<User size={14} />}>
        <div className="flex gap-2 flex-wrap">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g.value}
              onClick={() => pushParams({ gender: g.value })}
              className={`px-3 py-1.5 rounded-full text-caption border transition-all ${
                selectedGender === g.value
                  ? "bg-ink text-on-primary border-ink"
                  : "bg-canvas-cream text-shade-60 border-hairline-light hover:border-ink hover:text-ink"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={() => { clearAll(); setMobileOpen(false); }}
          className="w-full mt-2 btn-outline !text-caption flex items-center justify-center gap-2"
        >
          <X size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* ── Active filter chips ── */}
      {hasFilters && (
        <section className="bg-canvas-cream border-b border-hairline-light py-3">
          <div className="container-cinematic flex items-center gap-2 flex-wrap">
            <span className="text-micro text-shade-40 uppercase tracking-wider">Active:</span>
            {q && (
              <FilterChip label={`"${q}"`} onRemove={() => pushParams({ q: "" })} />
            )}
            {selectedHospital && (
              <FilterChip
                label={HOSPITALS.find((h) => h.slug === selectedHospital)?.name ?? selectedHospital}
                onRemove={() => pushParams({ hospital: "" })}
              />
            )}
            {selectedSpecialties.map((s) => (
              <FilterChip key={s} label={s} onRemove={() => toggleSpecialty(s)} />
            ))}
            {selectedGender && (
              <FilterChip label={selectedGender} onRemove={() => pushParams({ gender: "" })} />
            )}
            <button onClick={clearAll} className="text-micro text-shade-40 hover:text-red-500 underline ml-1">
              Clear all
            </button>
          </div>
        </section>
      )}

      {/* ── Main layout ── */}
      <section className="bg-canvas-light py-10">
        <div className="container-cinematic flex gap-8">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-canvas-cream rounded-xl border border-hairline-light p-5">
              <div className="flex items-center justify-between mb-5">
                <span className="font-display text-heading-sm text-ink flex items-center gap-2">
                  <SlidersHorizontal size={16} /> Filters
                </span>
                {hasFilters && (
                  <button onClick={clearAll} className="text-micro text-shade-40 hover:text-ink underline">
                    Reset
                  </button>
                )}
              </div>
              {filterSidebar}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
              <div>
                <p className="text-body-md text-ink font-medium">
                  {filtered.length.toLocaleString()} doctor{filtered.length === 1 ? "" : "s"}
                  {hasFilters && " found"}
                </p>
                {totalPages > 1 && (
                  <p className="text-caption text-shade-40">
                    Page {safePage} of {totalPages}
                  </p>
                )}
              </div>

              {/* Mobile filter button */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden btn-outline !px-4 !py-2 !text-caption flex items-center gap-2"
              >
                <Filter size={15} /> Filters
                {hasFilters && (
                  <span className="w-5 h-5 rounded-full bg-ink text-on-primary text-[10px] flex items-center justify-center">
                    {[q, selectedHospital, ...selectedSpecialties, selectedGender].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Grid */}
            {pageItems.length === 0 ? (
              <div className="text-center py-20 border border-hairline-light rounded-xl bg-canvas-cream">
                <p className="font-display text-heading-lg text-ink mb-2">No doctors found</p>
                <p className="text-body-md text-shade-50 mb-6">Try adjusting your filters or search terms.</p>
                <button onClick={clearAll} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {pageItems.map((doctor, i) => (
                  <DoctorCard key={`${doctor.slug}-${doctor.hospitalSlug}-${i}`} doctor={doctor} index={i} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                <button
                  onClick={() => goPage(safePage - 1)}
                  disabled={safePage === 1}
                  className="btn-outline !px-4 !py-2 !text-caption disabled:opacity-40"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2)
                  .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="text-shade-40 px-1">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => goPage(item)}
                        className={`w-10 h-10 rounded-lg text-caption border transition-all ${
                          safePage === item
                            ? "bg-ink text-on-primary border-ink"
                            : "border-hairline-light text-shade-60 hover:border-ink hover:text-ink"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  onClick={() => goPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="btn-outline !px-4 !py-2 !text-caption disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Mobile filter drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div key="mobile-drawer-root">
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="mobile-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 max-w-full bg-canvas-light overflow-y-auto lg:hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display text-heading-sm text-ink flex items-center gap-2">
                    <SlidersHorizontal size={16} /> Filters
                  </span>
                  <button onClick={() => setMobileOpen(false)} className="text-shade-40 hover:text-ink p-1">
                    <X size={20} />
                  </button>
                </div>
                {filterSidebar}
                <button
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full mt-6"
                >
                  Show {filtered.length} results
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterChip({ label, onRemove }: { readonly label: string; readonly onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-canvas-night text-on-primary text-caption">
      {label}
      <button onClick={onRemove} className="hover:text-red-400 transition-colors">
        <X size={12} />
      </button>
    </span>
  );
}
