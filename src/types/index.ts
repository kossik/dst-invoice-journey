export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  email: string;
  bio: string;
  categories: OfferCategory[];
  followers: number;
  rating: number;
  completedDeals: number;
  paymentDetails: {
    method: string;
    info: string;
  };
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  email: string;
  companyInfo: string;
}

export interface InvoiceItem {
  description: string;
  detail?: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  creatorId: string;
  brandId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  createdAt: string;
  dueDate: string;
  note?: string;
  quoteId?: string;
  offerIds?: string[];
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  paidAt: string;
  method: string;
}

export interface ActivityEvent {
  id: string;
  type: "invoice_created" | "invoice_sent" | "invoice_paid" | "invoice_overdue" | "quote_received" | "quote_accepted" | "payout" | "fee";
  description: string;
  actor: string;
  timestamp: string;
  amount?: number;
  currency?: string;
  direction?: "credit" | "debit";
}

export type QuoteType = "framework_contract" | "one_time";
export type QuoteStatus =
  | "draft"
  | "sent"
  | "pending"
  | "in_negotiation"
  | "accepted"
  | "declined"
  | "expired"
  | "awaiting_payment"
  | "payment_overdue"
  | "paid"
  | "paid_late"
  | "cancelled"
  | "in_progress"
  | "completed";
export type NegotiationType = "direct_invoice" | "with_negotiation";

export interface Quote {
  id: string;
  brandId: string;
  clientId?: string;
  title: string;
  quoteType: QuoteType;
  amount: number;
  currency: string;
  status: QuoteStatus;
  clientCountry?: string;
  taxationType?: string;
  offerIds?: string[];
  deadline?: string;
  negotiationType: NegotiationType;
  receivedAt: string;
  expiresAt?: string;
  initiator: "creator" | "client";
  allowLatePayment?: boolean;
  invoiceIds?: string[];
  completedAt?: string;
  paidAt?: string;
}

export type PayoutStatus = "completed" | "pending" | "failed";

export interface WithdrawalMethod {
  id: string;
  type: "bank_transfer" | "paypal" | "crypto" | "debit_card";
  label: string;
  details: string;
  isDefault: boolean;
}

export interface PayoutTransaction {
  id: string;
  amount: number;
  currency: string;
  fee: number;
  status: PayoutStatus;
  methodId: string;
  createdAt: string;
  completedAt?: string;
}

export interface DebitCard {
  balance: number;
  currency: string;
  lastFour: string;
  cardHolder: string;
  expiresAt: string;
}

export type OfferCategory =
  | "in_stream_ads"
  | "brand_ambassador"
  | "native_integration"
  | "sponsored_video"
  | "social_post"
  | "shoutout"
  | "product_review"
  | "podcast_ad";

export type OfferBilling = "one_time" | "recurring";

export interface Offer {
  id: string;
  creatorId: string;
  title: string;
  category: OfferCategory;
  billing: OfferBilling;
  price: number;
  currency: string;
  active: boolean;
  salesCount: number;
  totalEarned: number;
  createdAt: string;
}

/* ─── Negotiation ─── */

export type NegotiationMessageType = "message" | "revision" | "system";

export interface NegotiationRevision {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface NegotiationMessage {
  id: string;
  quoteId: string;
  author: "creator" | "client" | "system";
  authorName: string;
  message: string;
  timestamp: string;
  type: NegotiationMessageType;
  revisions?: NegotiationRevision[];
}

/* ─── Pipeline ─── */

export type PipelineStepStatus = "completed" | "active" | "upcoming" | "skipped";

export interface PipelineStep {
  key: string;
  label: string;
  description?: string;
  status: PipelineStepStatus;
  completedAt?: string;
  note?: string;
}

/* ─── Recurring Tasks ─── */

export type RecurringTaskStatus = "upcoming" | "invoiced" | "paid" | "overdue" | "completed";

export interface RecurringTask {
  id: string;
  quoteId: string;
  offerId: string;
  period: string;
  status: RecurringTaskStatus;
  invoiceId?: string;
  amount: number;
  currency: string;
}

/* ─── Clients ─── */

export type ClientStatus = "inactive" | "awaiting_payment" | "negotiation" | "campaign_active";

export interface Client {
  id: string;
  brandId: string;
  status: ClientStatus;
  contractsCount: number;
  openContractsAmount: number;
  currency: string;
  country: string;
  taxationType: string;
  lastActivityAt: string;
  notes?: string;
}
