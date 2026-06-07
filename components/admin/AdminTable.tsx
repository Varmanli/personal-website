import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  /** Render the cell for a row. */
  cell: (row: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string | number;
  emptyMessage?: string;
}

/** Simple, typed table for admin list views. */
export function AdminTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = "No items yet.",
}: AdminTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="neon-card overflow-x-auto rounded-xl">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-surface-2 text-xs uppercase tracking-wide text-faint">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className={cn("px-4 py-3 font-medium", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="transition-colors hover:bg-surface-2">
              {columns.map((col) => (
                <td key={col.header} className={cn("px-4 py-3 text-muted", col.className)}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Localized status pill lives in its own client module.
export { StatusBadge } from "@/components/admin/StatusBadge";
