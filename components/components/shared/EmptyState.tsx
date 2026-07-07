import Link from "next/link";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const ActionButton = actionLabel ? (
    actionHref ? (
      <Link
        href={actionHref}
        className="inline-block bg-[#0a7e3d] text-white rounded-md px-5 py-2.5 text-sm font-semibold hover:bg-[#086b33] transition-colors"
      >
        {actionLabel}
      </Link>
    ) : (
      <button
        type="button"
        onClick={onAction}
        className="bg-[#0a7e3d] text-white rounded-md px-5 py-2.5 text-sm font-semibold hover:bg-[#086b33] transition-colors"
      >
        {actionLabel}
      </button>
    )
  ) : null;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-gray-300 mb-4">
        {icon || <Inbox size={64} />}
      </div>
      <h3 className="text-lg font-semibold text-[#1a1a2e] mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      {ActionButton}
    </div>
  );
}
