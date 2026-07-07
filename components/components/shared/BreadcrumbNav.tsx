import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function BreadcrumbNav({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="bg-canvas-cream/80 border-b border-hairline-light overflow-x-auto">
      <div className="container-cinematic py-2.5 sm:py-3">
        <ol className="flex items-center gap-1.5 text-micro sm:text-caption text-shade-40 min-w-0">
          <li className="flex items-center gap-1.5 shrink-0">
            <Link href="/" className="hover:text-ink transition-colors flex items-center gap-1" aria-label="Home">
              <Home size={14} className="hidden sm:block" />
              <span className="sm:hidden">Home</span>
            </Link>
          </li>
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5 min-w-0">
                <ChevronRight size={12} className="shrink-0 text-shade-30" />
                {isLast ? (
                  <span className="text-shade-60 font-medium truncate max-w-[120px] sm:max-w-none">{item.label}</span>
                ) : (
                  <Link href={item.href} className="hover:text-ink transition-colors truncate max-w-[100px] sm:max-w-none">{item.label}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
