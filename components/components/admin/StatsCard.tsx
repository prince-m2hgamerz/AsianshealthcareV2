import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  color?: string;
}

export default function StatsCard({ label, value, change, icon: Icon, color = "bg-accent/10" }: StatsCardProps) {
  return (
    <div className="bg-surface-white rounded-lg p-6 border border-border shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon size={20} className="text-text" />
        </div>
        {change && (
          <span className="text-caption text-accent bg-accent/10 rounded-full px-2 py-0.5">
            {change}
          </span>
        )}
      </div>
      <div className="font-display text-display-md text-text">{value}</div>
      <p className="text-caption text-text-muted">{label}</p>
    </div>
  );
}
