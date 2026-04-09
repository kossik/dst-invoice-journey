import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  quotes,
  brands,
  clients,
  offers,
  invoices,
  negotiationMessages,
  recurringTasks,
} from "@/data";
import { buildPipelineSteps } from "@/lib/pipeline";
import type { PipelineStep, QuoteStatus } from "@/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  FileText,
  Package,
  Repeat,
  ChevronDown,
  ChevronUp,
  Play,
  Ban,
  Check,
  ArrowRight,
} from "lucide-react";

/* ─── Status badge config ─── */

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
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  pending: "Pending",
  in_negotiation: "In Negotiation",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
  awaiting_payment: "Awaiting Payment",
  payment_overdue: "Payment Overdue",
  paid: "Paid",
  paid_late: "Paid Late",
  cancelled: "Cancelled",
  in_progress: "In Progress",
  completed: "Completed",
};

const invoiceStatusColors: Record<string, { color: string; bg: string }> = {
  draft: { color: "text-gray-600", bg: "bg-gray-50 border-gray-200" },
  sent: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  paid: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  overdue: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

const recurringStatusColors: Record<string, { color: string; bg: string }> = {
  upcoming: { color: "text-gray-600", bg: "bg-gray-50 border-gray-200" },
  invoiced: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  paid: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  overdue: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
  completed: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
};

/* ─── Main Component ─── */

export function QuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quote = quotes.find((q) => q.id === id);

  const [localStatus, setLocalStatus] = useState<QuoteStatus>(
    quote?.status ?? "draft",
  );
  const [chatExpanded, setChatExpanded] = useState(false);

  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-lg text-muted-foreground">Quote not found</p>
        <button
          onClick={() => navigate("/creator/quotes")}
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotes
        </button>
      </div>
    );
  }

  const pipelineSteps = buildPipelineSteps({ ...quote, status: localStatus });
  const brand = brands.find((b) => b.id === quote.brandId);
  const client = clients.find((c) => c.id === quote.clientId);
  const quoteOffers = (quote.offerIds ?? [])
    .map((oid) => offers.find((o) => o.id === oid))
    .filter(Boolean);
  const oneTimeOffers = quoteOffers.filter((o) => o!.billing === "one_time");
  const recurringOffers = quoteOffers.filter((o) => o!.billing === "recurring");
  const quoteInvoices = invoices.filter((inv) => inv.quoteId === quote.id);
  const quoteNegotiations = negotiationMessages.filter(
    (m) => m.quoteId === quote.id,
  );
  const quoteRecurringTasks = recurringTasks.filter(
    (t) => t.quoteId === quote.id,
  );

  const sc = statusColors[localStatus] ?? statusColors.draft;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <button
          onClick={() => navigate("/creator/quotes")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotes
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">{quote.title}</h1>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
              sc.bg,
              sc.color,
            )}
          >
            {statusLabels[localStatus] ?? localStatus}
          </span>
          <span className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {quote.quoteType === "framework_contract"
              ? "Framework Contract"
              : "One-time"}
          </span>
          <span className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {quote.initiator === "creator"
              ? "Created by you"
              : "Client order"}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Client Info Card */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-4">
              {brand && (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-12 w-12 rounded-full bg-muted"
                />
              )}
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-lg">{brand?.name ?? "—"}</p>
                <p className="text-sm text-muted-foreground">
                  {brand?.email}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {quote.clientCountry && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs">
                      {quote.clientCountry}
                    </span>
                  )}
                  {quote.taxationType && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs">
                      {quote.taxationType}
                    </span>
                  )}
                  {client && (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs",
                        client.status === "campaign_active"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : client.status === "negotiation"
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : client.status === "awaiting_payment"
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : "border-gray-200 bg-gray-50 text-gray-600",
                      )}
                    >
                      {client.status === "campaign_active"
                        ? "Active"
                        : client.status === "negotiation"
                          ? "Negotiation"
                          : client.status === "awaiting_payment"
                            ? "Awaiting Payment"
                            : "Inactive"}
                    </span>
                  )}
                </div>
                {brand?.companyInfo && (
                  <p className="text-xs text-muted-foreground pt-1">
                    {brand.companyInfo}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* One-time Offers */}
          {oneTimeOffers.length > 0 && (
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                <Package className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold">One-time Services</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-2.5">Offer</th>
                      <th className="px-5 py-2.5">Category</th>
                      <th className="px-5 py-2.5 text-right">Price</th>
                      <th className="px-5 py-2.5">Invoice</th>
                      <th className="px-5 py-2.5">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {oneTimeOffers.map((offer) => {
                      const inv = quoteInvoices.find((i) =>
                        i.offerIds?.includes(offer!.id),
                      );
                      const invSc = inv
                        ? invoiceStatusColors[inv.status]
                        : null;
                      return (
                        <tr
                          key={offer!.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-5 py-3 font-medium">
                            {offer!.title}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground capitalize">
                            {offer!.category.replace(/_/g, " ")}
                          </td>
                          <td className="px-5 py-3 text-right font-medium">
                            {formatCurrency(offer!.price, offer!.currency)}
                          </td>
                          <td className="px-5 py-3">
                            {inv ? (
                              <span className="text-xs font-medium text-primary">
                                {inv.id}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            {inv && invSc ? (
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                                  invSc.bg,
                                  invSc.color,
                                )}
                              >
                                {inv.status.charAt(0).toUpperCase() +
                                  inv.status.slice(1)}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
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
          )}

          {/* Recurring Offers */}
          {recurringOffers.length > 0 && (
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                <Repeat className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold">Recurring Services</h2>
              </div>
              <div className="divide-y divide-border">
                {recurringOffers.map((offer) => {
                  const tasks = quoteRecurringTasks.filter(
                    (t) => t.offerId === offer!.id,
                  );
                  return (
                    <div key={offer!.id} className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{offer!.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {offer!.category.replace(/_/g, " ")} ·{" "}
                            {formatCurrency(offer!.price, offer!.currency)}
                            /month
                          </p>
                        </div>
                      </div>
                      {tasks.length > 0 && (
                        <div className="overflow-x-auto rounded-lg border border-border">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border bg-muted/30 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                <th className="px-4 py-2">Period</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Invoice</th>
                                <th className="px-4 py-2 text-right">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {tasks.map((task) => {
                                const rsc =
                                  recurringStatusColors[task.status] ??
                                  recurringStatusColors.upcoming;
                                return (
                                  <tr
                                    key={task.id}
                                    className="border-b border-border last:border-0"
                                  >
                                    <td className="px-4 py-2.5 font-medium">
                                      {task.period}
                                    </td>
                                    <td className="px-4 py-2.5">
                                      <span
                                        className={cn(
                                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                                          rsc.bg,
                                          rsc.color,
                                        )}
                                      >
                                        {task.status.charAt(0).toUpperCase() +
                                          task.status.slice(1)}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2.5">
                                      {task.invoiceId ? (
                                        <span className="text-xs font-medium text-primary">
                                          {task.invoiceId}
                                        </span>
                                      ) : (
                                        <span className="text-xs text-muted-foreground">
                                          —
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-2.5 text-right font-medium">
                                      {formatCurrency(
                                        task.amount,
                                        task.currency,
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Negotiation Block */}
          {quote.negotiationType === "with_negotiation" && (
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold">Negotiation</h2>
                {quoteNegotiations.length > 3 && (
                  <button
                    onClick={() => setChatExpanded(!chatExpanded)}
                    className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {chatExpanded ? (
                      <>
                        Show less <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        Show all ({quoteNegotiations.length}){" "}
                        <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="p-5 space-y-3">
                {(chatExpanded
                  ? quoteNegotiations
                  : quoteNegotiations.slice(-3)
                ).map((msg) => {
                  if (msg.type === "system") {
                    return (
                      <div
                        key={msg.id}
                        className="text-center text-xs text-muted-foreground italic py-1"
                      >
                        {msg.message}
                        <span className="ml-2 opacity-60">
                          {formatDate(msg.timestamp)}
                        </span>
                      </div>
                    );
                  }

                  if (msg.type === "revision") {
                    return (
                      <div
                        key={msg.id}
                        className="flex justify-start"
                      >
                        <div className="max-w-[80%] rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-1.5">
                          <p className="text-xs font-medium text-amber-800">
                            {msg.authorName} requested changes
                          </p>
                          {msg.revisions?.map((rev, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-xs"
                            >
                              <span className="font-medium text-muted-foreground">
                                {rev.field}:
                              </span>
                              <span className="line-through text-red-600">
                                {rev.oldValue}
                              </span>
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              <span className="text-emerald-700 font-medium">
                                {rev.newValue}
                              </span>
                            </div>
                          ))}
                          <p className="text-[10px] text-muted-foreground">
                            {formatDate(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  const isCreator = msg.author === "creator";
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        isCreator ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3 space-y-1",
                          isCreator
                            ? "bg-primary text-white"
                            : "bg-muted/60",
                        )}
                      >
                        <p className="text-xs font-medium opacity-80">
                          {msg.authorName}
                        </p>
                        <p className="text-sm">{msg.message}</p>
                        <p
                          className={cn(
                            "text-[10px]",
                            isCreator
                              ? "text-white/60"
                              : "text-muted-foreground",
                          )}
                        >
                          {formatDate(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {/* Faux input */}
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <input
                    type="text"
                    placeholder="Type a message…"
                    disabled
                    className="flex-1 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <button
                    disabled
                    className="rounded-lg bg-primary/50 p-2 text-white disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Terms Block */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold mb-3">Terms</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="text-sm font-medium">
                  {quote.deadline ? formatDate(quote.deadline) : "No deadline"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Negotiation Type
                </p>
                <p className="text-sm font-medium">
                  {quote.negotiationType === "with_negotiation"
                    ? "With Negotiation"
                    : "Direct Invoice"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Late Payment
                </p>
                <span
                  className={cn(
                    "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                    quote.allowLatePayment
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700",
                  )}
                >
                  {quote.allowLatePayment ? "Allowed" : "Not allowed"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — Pipeline + Actions */}
        <div className="lg:sticky lg:top-20 lg:self-start space-y-4">
          <PipelineSidebar steps={pipelineSteps} />
          <ActionButtons
            status={localStatus}
            onStatusChange={setLocalStatus}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Pipeline Sidebar ─── */

function PipelineSidebar({ steps }: { steps: PipelineStep[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-semibold mb-4">Pipeline</h2>
      <div className="relative space-y-0">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div key={step.key + i} className="flex gap-3">
              {/* Dot + Line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2",
                    step.status === "completed" &&
                      "border-emerald-500 bg-emerald-500 text-white",
                    step.status === "active" &&
                      "border-primary bg-primary text-white animate-pulse",
                    step.status === "upcoming" &&
                      "border-gray-300 bg-white",
                    step.status === "skipped" &&
                      "border-gray-200 bg-gray-100",
                  )}
                >
                  {step.status === "completed" && (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  {step.status === "active" && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-[24px]",
                      step.status === "completed"
                        ? "bg-emerald-300"
                        : step.status === "active"
                          ? "bg-primary/30"
                          : "border-l-2 border-dashed border-gray-300",
                    )}
                  />
                )}
              </div>
              {/* Content */}
              <div className="pb-4">
                <p
                  className={cn(
                    "text-sm font-medium leading-7",
                    step.status === "skipped" &&
                      "line-through text-muted-foreground",
                    step.status === "upcoming" && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                )}
                {step.note && (
                  <p className="text-xs text-muted-foreground italic">
                    {step.note}
                  </p>
                )}
                {step.completedAt && (
                  <p className="text-xs text-muted-foreground">
                    {formatDate(step.completedAt)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Action Buttons ─── */

function ActionButtons({
  status,
  onStatusChange,
}: {
  status: QuoteStatus;
  onStatusChange: (s: QuoteStatus) => void;
}) {
  const terminal = new Set<QuoteStatus>([
    "completed",
    "cancelled",
    "declined",
    "expired",
  ]);

  return (
    <div className="space-y-2">
      {status === "draft" && (
        <button
          onClick={() => onStatusChange("sent")}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
        >
          <Send className="h-4 w-4" />
          Send to Client
        </button>
      )}
      {(status === "sent" || status === "pending") && (
        <div className="w-full rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm text-center text-muted-foreground">
          <Clock className="inline h-4 w-4 mr-1.5" />
          Awaiting response…
        </div>
      )}
      {status === "in_negotiation" && (
        <button
          onClick={() => onStatusChange("sent")}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
        >
          <Send className="h-4 w-4" />
          Re-send Quote
        </button>
      )}
      {status === "accepted" && (
        <button
          onClick={() => onStatusChange("awaiting_payment")}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Generate Invoice
        </button>
      )}
      {status === "awaiting_payment" && (
        <button
          onClick={() => onStatusChange("paid")}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          Confirm Payment
        </button>
      )}
      {(status === "paid" || status === "paid_late") && (
        <button
          onClick={() => onStatusChange("in_progress")}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
        >
          <Play className="h-4 w-4" />
          Start Work
        </button>
      )}
      {status === "in_progress" && (
        <button
          onClick={() => onStatusChange("completed")}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          Mark Completed
        </button>
      )}
      {status === "completed" && (
        <div className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-center text-emerald-700 font-medium">
          <CheckCircle2 className="inline h-4 w-4 mr-1.5" />
          Quote Completed
        </div>
      )}
      {status === "declined" && (
        <div className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-center text-red-700 font-medium">
          <XCircle className="inline h-4 w-4 mr-1.5" />
          Quote Declined
        </div>
      )}
      {status === "expired" && (
        <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-center text-gray-500 font-medium">
          <Clock className="inline h-4 w-4 mr-1.5" />
          Quote Expired
        </div>
      )}
      {status === "cancelled" && (
        <div className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-center text-red-700 font-medium">
          <Ban className="inline h-4 w-4 mr-1.5" />
          Quote Cancelled
        </div>
      )}
      {!terminal.has(status) && (
        <button
          onClick={() => onStatusChange("cancelled")}
          className="w-full text-center text-xs text-red-500 hover:text-red-700 transition-colors py-1"
        >
          Cancel Quote
        </button>
      )}
    </div>
  );
}
