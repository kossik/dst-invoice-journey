import { useParams } from "react-router-dom";
import { invoices, creators, brands } from "@/data";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileEdit,
  Printer,
} from "lucide-react";
import type { InvoiceStatus } from "@/types";

/* ─── Status helpers ─── */

const statusConfig: Record<
  InvoiceStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  paid: { label: "Paid", color: "bg-success/10 text-success", icon: CheckCircle2 },
  sent: { label: "Awaiting Payment", color: "bg-warning/10 text-warning", icon: Clock },
  overdue: { label: "Overdue", color: "bg-destructive/10 text-destructive", icon: AlertTriangle },
  draft: { label: "Draft", color: "bg-muted text-muted-foreground", icon: FileEdit },
};

/* ─── Page ─── */

export function InvoicePage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const invoice = invoices.find((i) => i.id === invoiceId);

  if (!invoice) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-4xl font-bold text-muted-foreground">404</p>
          <p className="mt-2 text-sm text-muted-foreground">Invoice not found</p>
        </div>
      </div>
    );
  }

  const creator = creators.find((c) => c.id === invoice.creatorId);
  const brand = brands.find((b) => b.id === invoice.brandId);
  const status = statusConfig[invoice.status];
  const StatusIcon = status.icon;
  const subtotal = invoice.items.reduce((s, i) => s + i.amount, 0);
  const isPaid = invoice.status === "paid";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:py-16">
      {/* Top actions bar (print) */}
      <div className="mb-4 flex justify-end print:hidden">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
      </div>

      {/* Invoice document */}
      <div className="rounded-2xl border bg-card shadow-sm">
        {/* Header */}
        <div className="border-b px-8 py-8 sm:px-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">INVOICE</h1>
              <p className="mt-1.5 font-mono text-sm text-muted-foreground">
                {invoice.id}
              </p>
            </div>
            <div
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium",
                status.color
              )}
            >
              <StatusIcon className="h-4 w-4" />
              {status.label}
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="grid gap-8 border-b px-8 py-8 sm:grid-cols-2 sm:px-10">
          {/* From (Creator) */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              From
            </p>
            <div className="mt-3 flex items-center gap-3">
              {creator && (
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="h-11 w-11 rounded-full bg-muted"
                />
              )}
              <div>
                <p className="font-medium">{creator?.name ?? "—"}</p>
                <p className="text-sm text-muted-foreground">
                  {creator?.email}
                </p>
              </div>
            </div>
          </div>

          {/* To (Brand) */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Bill To
            </p>
            <div className="mt-3 flex items-center gap-3">
              {brand && (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-11 w-11 rounded-full bg-muted"
                />
              )}
              <div>
                <p className="font-medium">{brand?.name ?? "—"}</p>
                <p className="text-sm text-muted-foreground">{brand?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-6 border-b px-8 py-6 text-sm sm:grid-cols-4 sm:px-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Issued
            </p>
            <p className="mt-1.5 font-medium tabular-nums">
              {formatDate(invoice.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Due Date
            </p>
            <p className="mt-1.5 font-medium tabular-nums">
              {formatDate(invoice.dueDate)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Currency
            </p>
            <p className="mt-1.5 font-medium">{invoice.currency}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Amount Due
            </p>
            <p className="mt-1.5 text-xl font-bold tabular-nums">
              {formatCurrency(invoice.amount, invoice.currency)}
            </p>
          </div>
        </div>

        {/* Line items */}
        <div className="px-8 py-8 sm:px-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                <th className="pb-4 pr-4">Description</th>
                <th className="pb-4 pr-4 text-right">Qty</th>
                <th className="pb-4 pr-4 text-right">Rate</th>
                <th className="pb-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-4 pr-4">
                    <p className="font-medium">{item.description}</p>
                    {item.detail && (
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {item.detail}
                      </p>
                    )}
                  </td>
                  <td className="py-4 pr-4 text-right align-top tabular-nums text-muted-foreground">
                    {item.quantity}
                  </td>
                  <td className="py-4 pr-4 text-right align-top tabular-nums text-muted-foreground">
                    {formatCurrency(item.rate, invoice.currency)}
                  </td>
                  <td className="py-4 text-right align-top tabular-nums font-medium">
                    {formatCurrency(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums font-medium">
                  {formatCurrency(subtotal, invoice.currency)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3 text-lg font-bold">
                <span>Total</span>
                <span className="tabular-nums">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        {invoice.note && (
          <div className="border-t px-8 py-6 sm:px-10">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Note
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">{invoice.note}</p>
          </div>
        )}

        {/* Pay button */}
        {!isPaid && (
          <div className="border-t px-8 py-8 sm:px-10 print:hidden">
            <button className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90">
              {invoice.status === "draft" ? "Send & Pay" : "Pay"}{" "}
              {formatCurrency(invoice.amount, invoice.currency)}
            </button>
          </div>
        )}

        {/* Paid stamp */}
        {isPaid && (
          <div className="border-t px-8 py-8 sm:px-10">
            <div className="flex items-center justify-center gap-2 rounded-xl bg-success/10 py-3.5 text-sm font-semibold text-success">
              <CheckCircle2 className="h-4 w-4" />
              Paid — Thank you!
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Powered by <span className="font-semibold">destream</span>
      </p>
    </div>
  );
}
