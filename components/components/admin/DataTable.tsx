"use client";

import { useMemo, useState } from "react";
import { Edit3, Search, Trash2 } from "lucide-react";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  searchPlaceholder?: string;
  loading?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable<T = any>({
  columns,
  data,
  onEdit,
  onDelete,
  searchPlaceholder = "Search records...",
  loading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const visibleData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;

    return data.filter((item) =>
      Object.values(item as Record<string, unknown>)
        .flatMap((value) => Array.isArray(value) ? value : [value])
        .filter((value) => value !== null && value !== undefined)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [data, search]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface-white shadow-card">
      <div className="flex flex-col gap-3 border-b border-border bg-surface-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-caption text-text-muted">
            {loading ? "Loading..." : `${visibleData.length.toLocaleString()} of ${data.length.toLocaleString()} records`}
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={17} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-caption text-text placeholder:text-text-muted focus:border-border-focus focus:outline-none"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-body-md">
          <thead>
            <tr className="bg-surface border-b border-border text-left">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-3 sm:p-4 text-caption text-text-muted uppercase tracking-wider font-medium ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="p-3 sm:p-4 text-caption text-text-muted uppercase tracking-wider font-medium">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-border">
                  <td colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)} className="p-3 sm:p-4">
                    <div className="h-5 animate-pulse rounded bg-surface" />
                  </td>
                </tr>
              ))
            ) : visibleData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)}
                  className="p-6 sm:p-8 text-center text-caption text-text-muted"
                >
                  {search ? "No matching records found." : "No data found."}
                </td>
              </tr>
            ) : (
              visibleData.map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-border hover:bg-surface/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`p-3 sm:p-4 ${col.className || ""}`}>
                      {col.render
                        ? col.render(item)
                        : ((item as Record<string, unknown>)[col.key] as React.ReactNode) || "-"}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-1">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-text-muted transition-colors hover:bg-surface hover:text-text"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
