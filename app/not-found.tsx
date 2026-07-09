import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-canvas-light to-canvas-cream px-6">
      <div className="text-center max-w-lg">
        <div className="font-display text-[100px] sm:text-[140px] leading-none text-accent/20 mb-2 select-none">
          404
        </div>
        <div className="w-16 h-1 bg-accent/40 rounded-full mx-auto mb-6" />
        <h1 className="font-display text-heading-xl sm:text-display-md text-text mb-3">
          Page Not Found
        </h1>
        <p className="text-body-lg text-shade-50 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let us help you find the right treatment.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary !py-3.5 sm:!py-3">Go Home</Link>
          <Link href="/contact-us" className="btn-outline !py-3.5 sm:!py-3">Contact Us</Link>
          <Link href="/treatment-package" className="btn-outline !py-3.5 sm:!py-3">View Treatments</Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3 text-caption text-shade-40">
          <Link href="/doctors" className="hover:text-text transition-colors">Doctors</Link>
          <span>&middot;</span>
          <Link href="/hospitals" className="hover:text-text transition-colors">Hospitals</Link>
          <span>&middot;</span>
          <Link href="/blogs" className="hover:text-text transition-colors">Blog</Link>
          <span>&middot;</span>
          <Link href="/cost-calculator" className="hover:text-text transition-colors">Cost Calculator</Link>
        </div>
      </div>
    </div>
  );
}
