import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Treatment Cost in India | Med Solution Healthcare",
  description: "Compare medical treatment costs in India vs. other countries. Free cost estimation for 500+ procedures at top hospitals.",
  alternates: { canonical: "/find-cost" },
};

export default function FindCostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
