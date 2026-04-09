import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { quotes, brands, clients } from "@/data";
import type { QuoteStatus } from "@/types";
import { cn } from "@/lib/utils";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  DollarSign,
  Plus,
  Search,
  CalendarDays,
  MessageSquare,
  AlertCircle,
  Play,
  Ban,
} from "lucide-react";
import { CreateQuoteWizard } from "./CreateQuoteWizard";

const statusConfig: Record<
  QuoteStatus,
  { label: string; color: string; bg: string; icon: typeof FileText }
> = {
  draft: {
    label: "Draft",
    color: "text-gray-600",
    bg: "bg-gray-50 border-gray-200",
    icon: FileText,
  },
  sent: {
    label: "Sent",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: Send,
  },
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: Clock,
  },
  accepted: {
    label: "Accepted",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: CheckCircle2,
  },
  declined: {
    label: "Declined",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
  },
  expired: {
    label: "Expired",
    color: "text-gray-500",
    bg: "bg-gray-50 border-gray-200",
    icon: Clock,
  },
  in_negotiation: {
    label: "In Negotiation",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: MessageSquare,
  },
  awaiting_payment: {
    label: "Awaiting Payment",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: Clock,
  },
  payment_overdue: {
    label: "Payment Overdue",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: AlertCircle,
  },
  paid: {
    label: "Paid",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: CheckCircle2,
  },
  paid_late: {
    label: "Paid Late",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: Ban,
  },
  in_progress: {
    label: "In Progress",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: Play,
  },
  completed: {
    label: "Completed",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: CheckCircle2,
  },
};

const filterOptions: { value: QuoteStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
  { value: "expired", label: "Expired" },
  { value: "in_negotiation", label: "In Negotiation" },
  { value: "awaiting_payment", label: "Awaiting Payment" },
  { value: "payment_overdue", label: "Payment Overdue" },
  { value: "paid", label: "Paid" },
  { value: "paid_late", label: "Paid Late" },
  { value: "cancelled", label: "Cancelled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

function getBrand(brandId: string) {
  return brands.find((b) => b.id === brandId);
}

function getClient(clientId?: string) {
  if (!clientId) return undefined;
  return clients.find((c) => c.id === clientId);
}

export function CreatorQuotes() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);

  const filtered = useMemo(() => {
    return quotes.filter((q) => {
      if (statusFilter !== "all" && q.status !== statusFilter) return false;
      if (search) {
        const brand = getBrand(q.brandId);
        const s = search.toLowerCase();
        if (
          !q.title.toLowerCase().includes(s) &&
          !brand?.name.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [statusFilter, search]);

  const totalQuotes = quotes.length;
  const totalValue = quotes.reduce((s, q) => s + q.amount, 0);
  const pendingCount = quotes.filter(
    (q) => q.status === "pending" || q.status === "sent"
  ).length;
  const acceptedValue = quotes
    .filter((q) => q.status === "accepted")
    .reduce((s, q) => s + q.amount, 0);

  const stats = [
    {
      label: "Total Quotes",
      value: totalQuotes,
      icon: FileText,
      color: "text-primary",
    },
    {
      label: "Total Value",
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-blue-600",
    },
    {
      label: "Pending / Sent",
      value: pendingCount,
      icon: Clock,
      color: "text-amber-600",
    },
    {
      label: "Accepted Value",
      value: `$${acceptedValue.toLocaleString()}`,
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
  ];

  if (wizardOpen) {
    return <CreateQuoteWizard onClose={() => setWizardOpen(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quotes</h1>
        <button
          onClick={() => setWizardOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Quote
        </button>
      </div>

      {/* Analytics tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-4"
          >
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
                ? quotes.length
                : quotes.filter((q) => q.status === f.value).length;
            if (f.value !== "all" && count === 0) return null;
            return (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  statusFilter === f.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted/50"
                )}
              >
                {f.label}{" "}
                <span className="ml-1 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search quotes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-64"
          />
        </div>
      </div>

      {/* Quotes list */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Quote</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No quotes match your filters
                </td>
              </tr>
            )}
            {filtered.map((q) => {
              const brand = getBrand(q.brandId);
              const client = getClient(q.clientId);
              const sc = statusConfig[q.status];
              const StatusIcon = sc.icon;
              return (
                <tr
                  key={q.id}
                  onClick={() => navigate(`/creator/quotes/${q.id}`)}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{q.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {q.negotiationType === "with_negotiation"
                        ? "With negotiation"
                        : "Direct invoice"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={brand?.logo}
                        alt={brand?.name}
                        className="h-6 w-6 rounded-full bg-muted"
                      />
                      <div>
                        <p className="text-sm">{brand?.name ?? "—"}</p>
                        {client && (
                          <p className="text-xs text-muted-foreground">
                            {q.clientCountry}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs">
                      {q.quoteType === "framework_contract"
                        ? "Framework"
                        : "One-time"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        sc.bg,
                        sc.color
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {q.amount > 0
                      ? `$${q.amount.toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {q.deadline ? (
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(q.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    ) : (
                      "No deadline"
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(q.receivedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
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
