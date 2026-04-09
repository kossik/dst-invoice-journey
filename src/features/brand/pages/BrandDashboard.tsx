import { quotes, invoices, brands, creators } from "@/data";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  FileText,
  Clock,
  DollarSign,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const activeBrand = brands[0]!;
const creator = creators[0]!;

const statusColors: Record<string, { color: string; bg: string }> = {
  draft: { color: "text-gray-600", bg: "bg-gray-50 border-gray-200" },
  sent: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  pending: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  in_negotiation: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  accepted: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  declined: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
  expired: { color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
  awaiting_payment: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  payment_overdue: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
  paid: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  paid_late: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  cancelled: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
  in_progress: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  completed: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  overdue: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

const statusLabels: Record<string, string> = {
  draft: "Draft", sent: "Sent", pending: "Pending", in_negotiation: "Negotiating",
  accepted: "Accepted", declined: "Declined", expired: "Expired",
  awaiting_payment: "Awaiting Payment", payment_overdue: "Overdue",
  paid: "Paid", paid_late: "Paid Late", cancelled: "Cancelled",
  in_progress: "In Progress", completed: "Completed", overdue: "Overdue",
};

export function BrandDashboard() {
  const brandQuotes = quotes.filter((q) => q.brandId === activeBrand.id);
  const brandInvoices = invoices.filter((i) => i.brandId === activeBrand.id);

  const activeQuotes = brandQuotes.filter(
    (q) =>
      !["declined", "expired", "cancelled", "completed"].includes(q.status),
  ).length;
  const pendingInvoices = brandInvoices.filter(
    (i) => i.status === "sent" || i.status === "overdue",
  ).length;
  const totalSpent = brandInvoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.amount, 0);
  const completedOrders = brandQuotes.filter(
    (q) => q.status === "completed",
  ).length;

  const stats = [
    { label: "Active Quotes", value: activeQuotes, icon: FileText, color: "text-primary" },
    { label: "Pending Invoices", value: pendingInvoices, icon: Clock, color: "text-amber-600" },
    { label: "Total Spent", value: formatCurrency(totalSpent), icon: DollarSign, color: "text-blue-600" },
    { label: "Completed Orders", value: completedOrders, icon: CheckCircle2, color: "text-emerald-600" },
  ];

  const recentQuotes = [...brandQuotes]
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
    .slice(0, 3);
  const recentInvoices = [...brandInvoices]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {activeBrand.name}</h1>
        <p className="text-sm text-muted-foreground">
          Working with {creator.name}
        </p>
      </div>

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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Quotes */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="font-semibold">Recent Quotes</h2>
            <Link
              to="/brand/quotes"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentQuotes.map((q) => {
              const sc = statusColors[q.status] ?? statusColors.draft;
              return (
                <Link
                  key={q.id}
                  to={`/brand/quotes/${q.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{q.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(q.receivedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {formatCurrency(q.amount)}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        sc.bg,
                        sc.color,
                      )}
                    >
                      {statusLabels[q.status] ?? q.status}
                    </span>
                  </div>
                </Link>
              );
            })}
            {recentQuotes.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-muted-foreground">
                No quotes yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="font-semibold">Recent Invoices</h2>
            <Link
              to="/brand/invoices"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentInvoices.map((inv) => {
              const sc = statusColors[inv.status] ?? statusColors.draft;
              return (
                <div
                  key={inv.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{inv.id}</p>
                    <p className="text-xs text-muted-foreground">
                      Due {formatDate(inv.dueDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {formatCurrency(inv.amount)}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        sc.bg,
                        sc.color,
                      )}
                    >
                      {statusLabels[inv.status] ?? inv.status}
                    </span>
                  </div>
                </div>
              );
            })}
            {recentInvoices.length === 0 && (
              <p className="px-5 py-6 text-center text-sm text-muted-foreground">
                No invoices yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
