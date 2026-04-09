import type { Quote, PipelineStep, PipelineStepStatus } from "@/types";

const STATUS_ORDER = [
  "draft",
  "sent",
  "pending",
  "in_negotiation",
  "accepted",
  "awaiting_payment",
  "payment_overdue",
  "paid",
  "paid_late",
  "in_progress",
  "completed",
] as const;

const TERMINAL = new Set(["declined", "expired", "cancelled"]);

function isPast(current: string, target: string): boolean {
  const ci = STATUS_ORDER.indexOf(current as (typeof STATUS_ORDER)[number]);
  const ti = STATUS_ORDER.indexOf(target as (typeof STATUS_ORDER)[number]);
  if (ci === -1 || ti === -1) return false;
  return ci > ti;
}

function stepStatus(
  current: string,
  stepTarget: string,
): PipelineStepStatus {
  if (current === stepTarget) return "active";
  if (isPast(current, stepTarget)) return "completed";
  return "upcoming";
}

export function buildPipelineSteps(quote: Quote): PipelineStep[] {
  const s = quote.status;
  const isTerminal = TERMINAL.has(s);

  if (quote.initiator === "client") {
    return buildClientInitiated(quote, s, isTerminal);
  }
  return buildCreatorInitiated(quote, s, isTerminal);
}

function buildCreatorInitiated(
  quote: Quote,
  s: string,
  isTerminal: boolean,
): PipelineStep[] {
  const steps: PipelineStep[] = [
    {
      key: "created",
      label: "Quote Created",
      status: "completed",
      completedAt: quote.receivedAt,
    },
    {
      key: "details",
      label: "Details Completed",
      status: s === "draft" ? "active" : "completed",
    },
    {
      key: "sent",
      label: "Sent to Client",
      status: stepStatus(s, "sent"),
    },
    {
      key: "client_review",
      label: "Client Review",
      status: stepStatus(s, "pending"),
    },
  ];

  if (quote.negotiationType === "with_negotiation") {
    steps.push({
      key: "negotiation",
      label: "Negotiation",
      status: stepStatus(s, "in_negotiation"),
    });
  } else {
    steps.push({
      key: "negotiation",
      label: "Negotiation",
      status: "skipped",
      note: "Direct invoice — skipped",
    });
  }

  steps.push(
    {
      key: "accepted",
      label: "Accepted",
      status: stepStatus(s, "accepted"),
    },
    {
      key: "invoice_sent",
      label: "Invoice Sent",
      status: quote.invoiceIds?.length
        ? "completed"
        : isPast(s, "accepted")
          ? "active"
          : "upcoming",
    },
    {
      key: "awaiting_payment",
      label: "Awaiting Payment",
      status: stepStatus(s, "awaiting_payment"),
    },
    {
      key: "payment_confirmed",
      label: "Payment Confirmed",
      status:
        s === "paid" || s === "paid_late"
          ? "completed"
          : isPast(s, "paid")
            ? "completed"
            : "upcoming",
      completedAt: quote.paidAt,
    },
    {
      key: "in_progress",
      label: "In Progress",
      status: stepStatus(s, "in_progress"),
    },
    {
      key: "completed",
      label: "Completed",
      status: s === "completed" ? "completed" : "upcoming",
      completedAt: quote.completedAt,
    },
  );

  if (isTerminal) {
    return applyTerminal(steps, s);
  }

  return steps;
}

function buildClientInitiated(
  quote: Quote,
  s: string,
  isTerminal: boolean,
): PipelineStep[] {
  const steps: PipelineStep[] = [
    {
      key: "order_received",
      label: "Order Received",
      status: "completed",
      completedAt: quote.receivedAt,
    },
    {
      key: "creator_review",
      label: "Creator Review",
      status: stepStatus(s, "pending"),
    },
  ];

  if (quote.negotiationType === "with_negotiation") {
    steps.push({
      key: "negotiation",
      label: "Negotiation",
      status: stepStatus(s, "in_negotiation"),
    });
  } else {
    steps.push({
      key: "negotiation",
      label: "Negotiation",
      status: "skipped",
      note: "Direct invoice — skipped",
    });
  }

  steps.push(
    {
      key: "accepted",
      label: "Accepted",
      status: stepStatus(s, "accepted"),
    },
    {
      key: "invoice_sent",
      label: "Invoice Sent",
      status: quote.invoiceIds?.length
        ? "completed"
        : isPast(s, "accepted")
          ? "active"
          : "upcoming",
    },
    {
      key: "awaiting_payment",
      label: "Awaiting Payment",
      status: stepStatus(s, "awaiting_payment"),
    },
    {
      key: "payment_confirmed",
      label: "Payment Confirmed",
      status:
        s === "paid" || s === "paid_late"
          ? "completed"
          : isPast(s, "paid")
            ? "completed"
            : "upcoming",
      completedAt: quote.paidAt,
    },
    {
      key: "in_progress",
      label: "In Progress",
      status: stepStatus(s, "in_progress"),
    },
    {
      key: "completed",
      label: "Completed",
      status: s === "completed" ? "completed" : "upcoming",
      completedAt: quote.completedAt,
    },
  );

  if (isTerminal) {
    return applyTerminal(steps, s);
  }

  return steps;
}

function applyTerminal(steps: PipelineStep[], status: string): PipelineStep[] {
  const terminalLabel =
    status === "declined"
      ? "Declined"
      : status === "expired"
        ? "Expired"
        : "Cancelled";

  let foundActive = false;
  const result = steps.map((step) => {
    if (step.status === "completed") return step;
    if (!foundActive) {
      foundActive = true;
      return { ...step, key: status, label: terminalLabel, status: "active" as const, note: `Quote ${terminalLabel.toLowerCase()}` };
    }
    return { ...step, status: "upcoming" as const };
  });

  return result;
}
