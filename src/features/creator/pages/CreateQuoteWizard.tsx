import { useState } from "react";
import { brands, clients, offers } from "@/data";
import type { QuoteType, NegotiationType } from "@/types";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  X,
  Check,
  FileText,
  Repeat,
  User,
  Globe,
  Receipt,
  Package,
  CalendarDays,
  MessageSquare,
  Send,
  Search,
} from "lucide-react";

interface WizardData {
  // Step 1
  title: string;
  quoteType: QuoteType | "";
  // Step 2
  clientMode: "existing" | "new";
  clientId: string;
  newClientName: string;
  newClientEmail: string;
  clientCountry: string;
  taxationType: string;
  // Step 3
  selectedOfferIds: string[];
  // Step 4
  hasDeadline: boolean;
  deadline: string;
  negotiationType: NegotiationType | "";
}

const initialData: WizardData = {
  title: "",
  quoteType: "",
  clientMode: "existing",
  clientId: "",
  newClientName: "",
  newClientEmail: "",
  clientCountry: "",
  taxationType: "",
  selectedOfferIds: [],
  hasDeadline: false,
  deadline: "",
  negotiationType: "",
};

const countries = [
  "US",
  "GB",
  "DE",
  "FR",
  "CA",
  "AU",
  "NL",
  "SE",
  "JP",
  "BR",
];

const taxOptions = [
  "W-9",
  "W-8BEN",
  "VAT registered",
  "EU VAT",
  "No tax ID",
  "Other",
];

const steps = [
  { label: "Quote Details", icon: FileText },
  { label: "Client Info", icon: User },
  { label: "Select Offers", icon: Package },
  { label: "Terms", icon: CalendarDays },
];

export function CreateQuoteWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(initialData);

  const update = (patch: Partial<WizardData>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const canNext = (): boolean => {
    switch (step) {
      case 0:
        return data.title.trim().length > 0 && data.quoteType !== "";
      case 1:
        if (data.clientMode === "existing") {
          return data.clientId !== "";
        }
        return (
          data.newClientName.trim().length > 0 &&
          data.newClientEmail.trim().length > 0 &&
          data.clientCountry !== "" &&
          data.taxationType !== ""
        );
      case 2:
        return true; // offers optional
      case 3:
        return (
          data.negotiationType !== "" &&
          (!data.hasDeadline || data.deadline !== "")
        );
      default:
        return false;
    }
  };

  const next = () => {
    if (step < 3) setStep(step + 1);
  };
  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = () => {
    // In a real app this would POST; we just close the wizard
    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Quote</h1>
        <button
          onClick={onClose}
          className="rounded-lg border border-border p-2 hover:bg-muted/50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => {
          const StepIcon = s.icon;
          const isActive = i === step;
          const isDone = i < step;
          return (
            <div key={i} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => i < step && setStep(i)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : isDone
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer"
                      : "bg-muted/30 text-muted-foreground border border-transparent"
                )}
              >
                {isDone ? (
                  <Check className="h-4 w-4 shrink-0" />
                ) : (
                  <StepIcon className="h-4 w-4 shrink-0" />
                )}
                <span className="hidden sm:inline truncate">{s.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="rounded-xl border border-border bg-card p-6">
        {step === 0 && <Step1 data={data} update={update} />}
        {step === 1 && <Step2 data={data} update={update} />}
        {step === 2 && <Step3 data={data} update={update} />}
        {step === 3 && <Step4 data={data} update={update} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={step === 0 ? onClose : prev}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {step === 0 ? "Cancel" : "Back"}
        </button>

        {step < 3 ? (
          <button
            onClick={next}
            disabled={!canNext()}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              canNext()
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {step === 2 ? (
              <>
                {data.selectedOfferIds.length === 0 ? "Skip" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canNext()}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-colors",
              canNext()
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
            Create Quote
          </button>
        )}
      </div>
    </div>
  );
}

/* ───────── Step 1: Quote Details ───────── */
function Step1({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Quote Details</h2>
        <p className="text-sm text-muted-foreground">
          Name your quote and choose the contract type
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Quote Title
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="e.g. Summer Campaign — 3 Videos"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Quote Type</label>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => update({ quoteType: "framework_contract" })}
              className={cn(
                "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                data.quoteType === "framework_contract"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <Repeat className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <p className="font-medium">Framework Contract</p>
                <p className="text-xs text-muted-foreground">
                  Ongoing agreement with multiple invoices over time
                </p>
              </div>
            </button>
            <button
              onClick={() => update({ quoteType: "one_time" })}
              className={cn(
                "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                data.quoteType === "one_time"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-medium">One-time Service</p>
                <p className="text-xs text-muted-foreground">
                  Single deliverable with one invoice
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Step 2: Client Info ───────── */
function Step2({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  const [clientSearch, setClientSearch] = useState("");

  const existingClients = clients
    .map((c) => {
      const brand = brands.find((b) => b.id === c.brandId);
      return { ...c, brandName: brand?.name ?? "Unknown", brandLogo: brand?.logo };
    })
    .filter((c) => {
      if (!clientSearch) return true;
      const q = clientSearch.toLowerCase();
      return (
        c.brandName.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.taxationType.toLowerCase().includes(q)
      );
    });

  const handleSelectClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    update({
      clientId,
      clientCountry: client?.country ?? "",
      taxationType: client?.taxationType ?? "",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Client Information</h2>
        <p className="text-sm text-muted-foreground">
          Select an existing client or add a new one
        </p>
      </div>

      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => update({ clientMode: "existing", newClientName: "", newClientEmail: "" })}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            data.clientMode === "existing"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-muted/50"
          )}
        >
          Existing Client
        </button>
        <button
          onClick={() => update({ clientMode: "new", clientId: "" })}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            data.clientMode === "new"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-muted/50"
          )}
        >
          New Client
        </button>
      </div>

      {data.clientMode === "existing" ? (
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients…"
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {existingClients.length === 0 && (
              <p className="col-span-2 py-4 text-center text-sm text-muted-foreground">
                No clients found
              </p>
            )}
            {existingClients.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectClient(c.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors",
                  data.clientId === c.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <img
                  src={c.brandLogo}
                  alt={c.brandName}
                  className="h-8 w-8 rounded-full bg-muted"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.brandName}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.contractsCount} contracts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.country} · {c.taxationType}
                  </p>
                </div>
                {data.clientId === c.id && (
                  <Check className="ml-auto h-4 w-4 shrink-0 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Company / Client Name
              </label>
              <input
                type="text"
                value={data.newClientName}
                onChange={(e) => update({ newClientName: e.target.value })}
                placeholder="Acme Corp"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Contact Email
              </label>
              <input
                type="email"
                value={data.newClientEmail}
                onChange={(e) => update({ newClientEmail: e.target.value })}
                placeholder="contact@acme.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Country & Tax — only for new clients */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Country of Residence
              </label>
              <select
                value={data.clientCountry}
                onChange={(e) => update({ clientCountry: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">Select country…</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                <Receipt className="h-4 w-4 text-muted-foreground" />
                Taxation
              </label>
              <select
                value={data.taxationType}
                onChange={(e) => update({ taxationType: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">Select tax type…</option>
                {taxOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ───────── Step 3: Select Offers ───────── */
function Step3({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  const activeOffers = offers.filter((o) => o.active && o.creatorId === "cr-1");

  const toggle = (id: string) => {
    const ids = data.selectedOfferIds.includes(id)
      ? data.selectedOfferIds.filter((x) => x !== id)
      : [...data.selectedOfferIds, id];
    update({ selectedOfferIds: ids });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Include Offers</h2>
        <p className="text-sm text-muted-foreground">
          Select which offers to include in this quote. You can skip this step.
        </p>
      </div>

      {data.selectedOfferIds.length > 0 && (
        <p className="text-sm font-medium text-primary">
          {data.selectedOfferIds.length} offer
          {data.selectedOfferIds.length > 1 ? "s" : ""} selected
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {activeOffers.map((offer) => {
          const selected = data.selectedOfferIds.includes(offer.id);
          return (
            <button
              key={offer.id}
              onClick={() => toggle(offer.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  selected ? "bg-primary text-white" : "bg-muted"
                )}
              >
                {selected ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Package className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{offer.title}</p>
                <p className="text-xs text-muted-foreground">
                  {offer.billing === "recurring" ? "Recurring" : "One-time"} ·{" "}
                  ${offer.price.toLocaleString()}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── Step 4: Terms ───────── */
function Step4({
  data,
  update,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Terms & Delivery</h2>
        <p className="text-sm text-muted-foreground">
          Set a deadline and choose how negotiations work
        </p>
      </div>

      {/* Deadline */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          Deadline
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => update({ hasDeadline: false, deadline: "" })}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              !data.hasDeadline
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted/50"
            )}
          >
            No deadline
          </button>
          <button
            onClick={() => update({ hasDeadline: true })}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              data.hasDeadline
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted/50"
            )}
          >
            Set deadline
          </button>
        </div>
        {data.hasDeadline && (
          <input
            type="date"
            value={data.deadline}
            onChange={(e) => update({ deadline: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        )}
      </div>

      {/* Negotiation type */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">Negotiation Style</label>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => update({ negotiationType: "direct_invoice" })}
            className={cn(
              "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors",
              data.negotiationType === "direct_invoice"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30"
            )}
          >
            <Send className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-medium">Direct Invoice</p>
              <p className="text-xs text-muted-foreground">
                Skip negotiation — send the invoice straight away
              </p>
            </div>
          </button>
          <button
            onClick={() => update({ negotiationType: "with_negotiation" })}
            className={cn(
              "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors",
              data.negotiationType === "with_negotiation"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30"
            )}
          >
            <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="font-medium">With Negotiation</p>
              <p className="text-xs text-muted-foreground">
                Allow the client to discuss terms before finalizing
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Summary preview */}
      {data.negotiationType !== "" && (
        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <h3 className="mb-2 text-sm font-semibold">Summary</h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <dt className="text-muted-foreground">Title</dt>
            <dd className="font-medium">{data.title}</dd>
            <dt className="text-muted-foreground">Type</dt>
            <dd>
              {data.quoteType === "framework_contract"
                ? "Framework Contract"
                : "One-time Service"}
            </dd>
            <dt className="text-muted-foreground">Client</dt>
            <dd>
              {data.clientMode === "existing"
                ? brands.find(
                    (b) =>
                      b.id ===
                      clients.find((c) => c.id === data.clientId)?.brandId
                  )?.name ?? "—"
                : data.newClientName || "—"}
            </dd>
            <dt className="text-muted-foreground">Country</dt>
            <dd>{data.clientCountry || "—"}</dd>
            <dt className="text-muted-foreground">Tax</dt>
            <dd>{data.taxationType || "—"}</dd>
            <dt className="text-muted-foreground">Offers</dt>
            <dd>
              {data.selectedOfferIds.length > 0
                ? `${data.selectedOfferIds.length} selected`
                : "None"}
            </dd>
            <dt className="text-muted-foreground">Deadline</dt>
            <dd>
              {data.hasDeadline && data.deadline
                ? new Date(data.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No deadline"}
            </dd>
            <dt className="text-muted-foreground">Negotiation</dt>
            <dd>
              {data.negotiationType === "direct_invoice"
                ? "Direct Invoice"
                : "With Negotiation"}
            </dd>
          </dl>
        </div>
      )}
    </div>
  );
}
