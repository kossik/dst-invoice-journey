import { invoices, brands } from "@/data";
import { formatCurrency, cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Invoice } from "@/types";

const statusColor: Record<string, string> = {
  paid: "border-l-success bg-success/5 text-success",
  sent: "border-l-warning bg-warning/5 text-warning",
  overdue: "border-l-destructive bg-destructive/5 text-destructive",
  draft: "border-l-muted-foreground bg-muted/50 text-muted-foreground",
};

const statusDot: Record<string, string> = {
  paid: "bg-success",
  sent: "bg-warning",
  overdue: "bg-destructive",
  draft: "bg-muted-foreground",
};

function InvoiceChip({ inv }: { inv: Invoice }) {
  const brand = brands.find((b) => b.id === inv.brandId);
  return (
    <div className="group/chip relative">
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-md border-l-2 px-2 py-1.5 text-xs transition-colors hover:shadow-sm",
          statusColor[inv.status] ?? statusColor.draft
        )}
      >
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            statusDot[inv.status]
          )}
        />
        <span className="min-w-0 flex-1 truncate font-medium text-foreground">
          {brand?.name ?? "Unknown"}
        </span>
        <span className="shrink-0 font-mono text-[10px] tabular-nums font-semibold">
          {formatCurrency(inv.amount, inv.currency)}
        </span>
      </div>

      {/* Tooltip on hover */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-56 -translate-x-1/2 rounded-lg border bg-card p-3 shadow-lg group-hover/chip:block">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">
            {inv.id}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
              statusColor[inv.status]
            )}
          >
            {inv.status}
          </span>
        </div>
        <p className="mt-1 text-sm font-medium text-foreground">
          {brand?.name}
        </p>
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          {inv.items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span className="truncate pr-2">{item.description}</span>
              <span className="shrink-0 tabular-nums">
                {formatCurrency(item.amount, inv.currency)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between border-t pt-2 text-xs font-semibold">
          <span>Total</span>
          <span className="tabular-nums">
            {formatCurrency(inv.amount, inv.currency)}
          </span>
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">
          Due {new Date(inv.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-card" />
      </div>
    </div>
  );
}

export function CreatorCalendar() {
  const today = new Date(2026, 3, 9);
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const startOffset = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const dayInvoices: Record<number, Invoice[]> = {};
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

  // Count totals for the month
  const monthInvoices = Object.values(dayInvoices).flat();
  const paidTotal = monthInvoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.amount, 0);
  const pendingTotal = monthInvoices
    .filter((i) => i.status === "sent")
    .reduce((s, i) => s + i.amount, 0);
  const overdueTotal = monthInvoices
    .filter((i) => i.status === "overdue")
    .reduce((s, i) => s + i.amount, 0);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Build cells array with empty leading + day cells
  const cells: ({ type: "empty" } | { type: "day"; day: number })[] = [];
  for (let i = 0; i < startOffset; i++) cells.push({ type: "empty" });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ type: "day", day: d });
  // Pad trailing to complete last week
  while (cells.length % 7 !== 0) cells.push({ type: "empty" });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Payment Calendar
          </h1>
          <p className="text-sm text-muted-foreground">
            Track invoice due dates and payment status
          </p>
        </div>
      </div>

      {/* Month summary chips */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Paid</span>
          <span className="text-sm font-semibold text-success">
            {formatCurrency(paidTotal)}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-warning" />
          <span className="text-xs text-muted-foreground">Pending</span>
          <span className="text-sm font-semibold text-warning">
            {formatCurrency(pendingTotal)}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
          <span className="text-xs text-muted-foreground">Overdue</span>
          <span className="text-sm font-semibold text-destructive">
            {formatCurrency(overdueTotal)}
          </span>
        </div>
      </div>

      {/* Calendar card */}
      <div className="rounded-xl border bg-card">
        {/* Calendar nav */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="rounded-md p-1.5 hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[160px] text-center text-base font-semibold">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="rounded-md p-1.5 hover:bg-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => {
              setViewMonth(today.getMonth());
              setViewYear(today.getFullYear());
            }}
            className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent"
          >
            Today
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 border-b bg-muted/30">
          {weekdays.map((d) => (
            <div
              key={d}
              className="border-r px-2 py-2 text-center text-xs font-medium text-muted-foreground last:border-r-0"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {cells.map((cell, idx) => {
            if (cell.type === "empty") {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[110px] border-r border-b bg-muted/10 last:border-r-0"
                />
              );
            }
            const { day } = cell;
            const isToday =
              day === today.getDate() &&
              viewMonth === today.getMonth() &&
              viewYear === today.getFullYear();
            const invs = dayInvoices[day];
            const isLastCol = (idx + 1) % 7 === 0;

            return (
              <div
                key={day}
                className={cn(
                  "flex min-h-[110px] flex-col border-b p-1.5",
                  !isLastCol && "border-r",
                  isToday && "bg-primary/[0.03]"
                )}
              >
                {/* Day number */}
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                      isToday
                        ? "bg-primary font-semibold text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {day}
                  </span>
                  {invs && invs.length > 0 && (
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {formatCurrency(
                        invs.reduce((s, i) => s + i.amount, 0)
                      )}
                    </span>
                  )}
                </div>

                {/* Invoice chips */}
                <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                  {invs?.map((inv) => (
                    <InvoiceChip key={inv.id} inv={inv} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-success" /> Paid
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-warning" /> Pending
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-destructive" /> Overdue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-muted-foreground" /> Draft
        </span>
      </div>
    </div>
  );
}
