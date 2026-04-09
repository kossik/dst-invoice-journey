import { invoices, payments, brands, quotes, activityEvents } from "@/data";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import {
  DollarSign,
  Clock,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Send,
  FilePlus,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

/* ─── Analytics Cards ─── */

const totalEarned = payments.reduce((s, p) => s + p.amount, 0);
const pendingInvoices = invoices.filter((i) => i.status === "sent");
const pendingAmount = pendingInvoices.reduce((s, i) => s + i.amount, 0);
const overdueCount = invoices.filter((i) => i.status === "overdue").length;

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent?: "green" | "yellow" | "red";
}) {
  const colors = {
    green: "bg-success/10 text-success",
    yellow: "bg-warning/10 text-warning",
    red: "bg-destructive/10 text-destructive",
  };
  const defaultColor = "bg-muted text-muted-foreground";
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            accent ? colors[accent] : defaultColor
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

/* ─── Quotes Awaiting Action ─── */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-success/10 text-success",
    sent: "bg-warning/10 text-warning",
    overdue: "bg-destructive/10 text-destructive",
    draft: "bg-muted text-muted-foreground",
    pending: "bg-warning/10 text-warning",
    accepted: "bg-success/10 text-success",
    declined: "bg-destructive/10 text-destructive",
    expired: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        map[status] ?? map.draft
      )}
    >
      {status}
    </span>
  );
}

function QuotesSection() {
  const actionable = quotes.filter(
    (q) => q.status === "pending" || q.status === "accepted"
  );
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h2 className="font-semibold">Quotes</h2>
          <p className="text-xs text-muted-foreground">
            {actionable.filter((q) => q.status === "pending").length} awaiting
            your action
          </p>
        </div>
      </div>
      <div className="divide-y">
        {actionable.length === 0 && (
          <p className="px-5 py-6 text-center text-sm text-muted-foreground">
            No pending quotes
          </p>
        )}
        {actionable.map((q) => {
          const brand = brands.find((b) => b.id === q.brandId);
          return (
            <div
              key={q.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-sm"
            >
              <img
                src={brand?.logo}
                alt={brand?.name}
                className="h-7 w-7 rounded-full bg-muted"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{q.title}</p>
                <p className="text-xs text-muted-foreground">{brand?.name}</p>
              </div>
              <span className="shrink-0 tabular-nums font-medium">
                {formatCurrency(q.amount, q.currency)}
              </span>
              <StatusBadge status={q.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Payment Calendar (Mini) ─── */

function PaymentCalendarMini() {
  const today = new Date(2026, 3, 9); // April 9, 2026
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const startOffset = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();

  // Build map: day number -> invoices
  const dayInvoices: Record<number, typeof invoices> = {};
  invoices.forEach((inv) => {
    const due = new Date(inv.dueDate);
    if (due.getMonth() === viewMonth && due.getFullYear() === viewYear) {
      const d = due.getDate();
      if (!dayInvoices[d]) dayInvoices[d] = [];
      dayInvoices[d]!.push(inv);
    }
  });

  const monthName = firstDay.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h2 className="font-semibold">Payment Calendar</h2>
        <div className="flex items-center gap-3">
          <Link
            to="/creator/calendar"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Full view <ArrowRight className="h-3 w-3" />
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="rounded-md p-1 hover:bg-accent"
            >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[140px] text-center text-sm font-medium">
            {monthName}
          </span>
          <button
            onClick={nextMonth}
            className="rounded-md p-1 hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {/* Day headers */}
        <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
          {days.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        {/* Calendar cells */}
        <div className="grid grid-cols-7">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="p-1" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday =
              day === today.getDate() &&
              viewMonth === today.getMonth() &&
              viewYear === today.getFullYear();
            const invs = dayInvoices[day];
            return (
              <div
                key={day}
                className={cn(
                  "relative flex min-h-[48px] flex-col items-center rounded-lg p-1 text-xs",
                  isToday && "bg-primary/5 font-semibold"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full",
                    isToday && "bg-primary text-primary-foreground"
                  )}
                >
                  {day}
                </span>
                {invs && (
                  <div className="mt-0.5 flex flex-wrap justify-center gap-0.5">
                    {invs.map((inv) => (
                      <span
                        key={inv.id}
                        title={`${inv.id} — ${formatCurrency(inv.amount)} (${inv.status})`}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          inv.status === "paid" && "bg-success",
                          inv.status === "sent" && "bg-warning",
                          inv.status === "overdue" && "bg-destructive",
                          inv.status === "draft" && "bg-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-3 border-t pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-success" /> Paid
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-warning" /> Pending
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-destructive" /> Overdue
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-muted-foreground" /> Draft
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Activity Log (Bank-style) ─── */

type ActivityFilter = "all" | "credit" | "debit" | "invoices" | "quotes";

function activityIcon(type: string, direction?: string) {
  if (direction === "credit")
    return <ArrowDownLeft className="h-4 w-4 text-success" />;
  if (direction === "debit")
    return <ArrowUpRight className="h-4 w-4 text-destructive" />;
  switch (type) {
    case "invoice_paid":
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    case "invoice_sent":
      return <Send className="h-4 w-4 text-blue-500" />;
    case "invoice_created":
      return <FilePlus className="h-4 w-4 text-muted-foreground" />;
    case "invoice_overdue":
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case "quote_received":
      return <MessageSquare className="h-4 w-4 text-warning" />;
    case "quote_accepted":
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    case "payout":
      return <Banknote className="h-4 w-4 text-blue-500" />;
    case "fee":
      return <Receipt className="h-4 w-4 text-muted-foreground" />;
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
}

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    invoice_paid: "Payment",
    invoice_sent: "Invoice Sent",
    invoice_created: "Draft Created",
    invoice_overdue: "Overdue",
    quote_received: "Quote",
    quote_accepted: "Quote Accepted",
    payout: "Payout",
    fee: "Fee",
  };
  return map[type] ?? type;
}

function ActivitySection() {
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = [...activityEvents]
    .filter((evt) => {
      if (filter === "credit") return evt.direction === "credit";
      if (filter === "debit") return evt.direction === "debit";
      if (filter === "invoices")
        return evt.type.startsWith("invoice_");
      if (filter === "quotes") return evt.type.startsWith("quote_");
      return true;
    })
    .filter((evt) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        evt.description.toLowerCase().includes(q) ||
        evt.actor.toLowerCase().includes(q) ||
        evt.type.toLowerCase().includes(q)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  const filters: { label: string; value: ActivityFilter }[] = [
    { label: "All", value: "all" },
    { label: "Incoming", value: "credit" },
    { label: "Outgoing", value: "debit" },
    { label: "Invoices", value: "invoices" },
    { label: "Quotes", value: "quotes" },
  ];

  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold">Activity</h2>
        <p className="text-xs text-muted-foreground">
          Transaction history
        </p>
      </div>

      {/* Filters + Search bar */}
      <div className="flex flex-wrap items-center gap-2 border-b px-5 py-3">
        <div className="flex flex-wrap gap-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative ml-auto min-w-[180px]">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="h-8 w-full rounded-lg border bg-background pl-8 pr-3 text-xs outline-none transition-colors placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Table header */}
      <div className="hidden items-center gap-3 border-b bg-muted/30 px-5 py-2 text-xs font-medium text-muted-foreground sm:flex">
        <span className="w-7" />
        <span className="flex-1">Description</span>
        <span className="w-24 text-center">Type</span>
        <span className="w-32 text-right">Date</span>
        <span className="w-28 text-right">Amount</span>
      </div>

      {/* Rows */}
      <div className="divide-y">
        {filtered.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No transactions match your filters
          </p>
        )}
        {filtered.map((evt) => {
          const isCredit = evt.direction === "credit";
          const isDebit = evt.direction === "debit";
          return (
            <div
              key={evt.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 text-sm transition-colors hover:bg-muted/20 sm:flex-nowrap"
            >
              {/* Icon */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                {activityIcon(evt.type, evt.direction)}
              </div>

              {/* Description */}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{evt.description}</p>
                <p className="text-xs text-muted-foreground sm:hidden">
                  {typeLabel(evt.type)} · {formatDate(evt.timestamp)}
                </p>
              </div>

              {/* Type badge (desktop) */}
              <span className="hidden w-24 text-center sm:block">
                <span
                  className={cn(
                    "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                    isCredit && "bg-success/10 text-success",
                    isDebit && "bg-destructive/10 text-destructive",
                    !isCredit && !isDebit && "bg-muted text-muted-foreground"
                  )}
                >
                  {typeLabel(evt.type)}
                </span>
              </span>

              {/* Date (desktop) */}
              <span className="hidden w-32 text-right text-xs text-muted-foreground sm:block">
                {formatDate(evt.timestamp)}
                <br />
                {new Date(evt.timestamp).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              {/* Amount */}
              <span
                className={cn(
                  "w-28 text-right font-mono text-sm font-semibold tabular-nums",
                  isCredit && "text-success",
                  isDebit && "text-destructive",
                  !isCredit && !isDebit && "text-muted-foreground"
                )}
              >
                {evt.amount != null
                  ? `${isDebit ? "−" : isCredit ? "+" : ""}${formatCurrency(evt.amount, evt.currency)}`
                  : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Dashboard ─── */

export function CreatorDashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your invoicing activity
        </p>
      </div>

      {/* 1. Analytics cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Earned"
          value={formatCurrency(totalEarned)}
          sub={`${payments.length} payments received`}
          icon={DollarSign}
          accent="green"
        />
        <StatCard
          label="Pending"
          value={formatCurrency(pendingAmount)}
          sub={`${pendingInvoices.length} invoices awaiting`}
          icon={Clock}
          accent="yellow"
        />
        <StatCard
          label="Overdue"
          value={String(overdueCount)}
          sub="invoices past due"
          icon={AlertTriangle}
          accent="red"
        />
        <StatCard
          label="Total Invoices"
          value={String(invoices.length)}
          sub={`across ${brands.length} brands`}
          icon={FileText}
        />
      </div>

      {/* 2-column layout: Quotes + Calendar */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 2. Quotes awaiting action */}
        <QuotesSection />
        {/* 3. Payment calendar (mini, links to full page) */}
        <PaymentCalendarMini />
      </div>

      {/* 4. Activity log */}
      <ActivitySection />
    </div>
  );
}
