import { invoices, quotes, brands } from "@/data";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  Receipt,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Search,
} from "lucide-react";
import { useState, useMemo } from "react";
import type { InvoiceStatus } from "@/types";

const activeBrand = brands[0]!;

const statusConfig: Record<
  InvoiceStatus,
  { label: string; color: string; bg: string; icon: typeof Receipt }
> = {
  draft: { label: "Draft", color: "text-gray-600", bg: "bg-gray-50 border-gray-200", icon: Receipt },
  sent: { label: "Sent", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: Clock },
  paid: { label: "Paid", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  overdue: { label: "Overdue", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: AlertCircle },
};

const filterOptions: { value: InvoiceStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "draft", label: "Draft" },
];

export function BrandInvoices() {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [search, setSearch] = useState("");

  const brandInvoices = useMemo(
    () => invoices.filter((i) => i.brandId === activeBrand.id),
    [],
  );

  const filtered = useMemo(() => {
    return brandInvoices.filter((inv) => {
      if (statusFilter !== "all" && inv.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        const q = quotes.find((qt) => qt.id === inv.quoteId);
        if (
          !inv.id.toLowerCase().includes(s) &&
          !(q?.title.toLowerCase().includes(s))
        )
          return false;
      }
      return true;
    });
  }, [brandInvoices, statusFilter, search]);

  const totalInvoices = brandInvoices.length;
  const totalAmount = brandInvoices.reduce((s, i) => s + i.amount, 0);
  const unpaidCount = brandInvoices.filter(
    (i) => i.status === "sent" || i.status === "overdue",
  ).length;
  const paidTotal = brandInvoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.amount, 0);

  const stats = [
    { label: "Total Invoices", value: totalInvoices, icon: Receipt, color: "text-primary" },
    { label: "Total Amount", value: formatCurrency(totalAmount), icon: DollarSign, color: "text-blue-600" },
    { label: "Unpaid", value: unpaidCount, icon: Clock, color: "text-amber-600" },
    { label: "Paid", value: formatCurrency(paidTotal), icon: CheckCircle2, color: "text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Invoices</h1>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted/50 p-2">
                <s.icon className={cn("h-5 w-5", s.color)} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((f) => {
            const count =
              f.value === "all"
                ? brandInvoices.length
                : brandInvoices.filter((i) => i.status === f.value).length;
            if (f.value !== "all" && count === 0) return null;
            return (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  statusFilter === f.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted/50",
                )}
              >
                {f.label} <span className="ml-1 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search invoices…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-64"
          />
        </div>
      </div>

      {/* Invoices table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Quote</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No invoices match your filters
                </td>
              </tr>
            )}
            {filtered.map((inv) => {
              const sc = statusConfig[inv.status];
              const StatusIcon = sc.icon;
              const linkedQuote = quotes.find((q) => q.id === inv.quoteId);
              return (
                <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{inv.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(inv.createdAt)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {linkedQuote ? (
                      <span className="text-sm">{linkedQuote.title}</span>
                    ) : (
                      <span className="text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        sc.bg,
                        sc.color,
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(inv.dueDate)}
                  </td>
                  <td className="px-4 py-3">
                    {(inv.status === "sent" || inv.status === "overdue") && (
                      <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 transition-colors">
                        <CreditCard className="h-3 w-3" />
                        Pay Now
                      </button>
                    )}
                    {inv.status === "paid" && (
                      <span className="text-xs text-emerald-600 font-medium">
                        ✓ Paid
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
