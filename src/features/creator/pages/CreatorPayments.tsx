import { cn, formatCurrency } from "@/lib/utils";
import {
  Copy,
  Check,
  ExternalLink,
  Palette,
  Globe,
  Lightbulb,
  Link2,
  Eye,
  FileText,
  Receipt,
  CreditCard,
  Heart,
  DollarSign,
  Pencil,
} from "lucide-react";
import { useState } from "react";

/* ─── Fake analytics data ─── */

const slugDefault = "alex-morgan";
const baseDomain = "pay.destream.io";

const serviceFunnel = {
  visits: 1243,
  quotes: 87,
  invoices: 34,
  paid: 21,
};

const donateFunnel = {
  visits: 856,
  started: 124,
  completed: 78,
  total: 2340,
};

/* ─── URL Block ─── */

function PageUrlBlock({
  slug,
  customDomain,
}: {
  slug: string;
  customDomain: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = customDomain || `${baseDomain}/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Your Payment Page
      </p>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
          <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-medium">https://{url}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors hover:bg-accent"
        >
          {copied ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
        <a
          href={`https://${url}`}
          target="_blank"
          rel="noreferrer"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors hover:bg-accent"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

/* ─── Slug Editor ─── */

function SlugEditor({
  slug,
  onSave,
}: {
  slug: string;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(slug);

  const save = () => {
    onSave(draft.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
    setEditing(false);
  };

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Page Slug</p>
          <p className="text-xs text-muted-foreground">
            {baseDomain}/<span className="font-medium text-foreground">{slug}</span>
          </p>
        </div>
        {!editing && (
          <button
            onClick={() => {
              setDraft(slug);
              setEditing(true);
            }}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
        )}
      </div>
      {editing && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center rounded-lg border bg-muted/50 px-3">
            <span className="shrink-0 text-sm text-muted-foreground">
              {baseDomain}/
            </span>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-w-0 flex-1 bg-transparent py-2 text-sm font-medium outline-none"
              autoFocus
            />
          </div>
          <button
            onClick={save}
            className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-accent"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Custom Domain ─── */

function CustomDomainBlock({
  domain,
  onSave,
}: {
  domain: string;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(domain);

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Custom Domain</p>
            <p className="text-xs text-muted-foreground">
              {domain || "Not configured — using default destream URL"}
            </p>
          </div>
        </div>
        {!editing && (
          <button
            onClick={() => {
              setDraft(domain);
              setEditing(true);
            }}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
          >
            {domain ? "Change" : "Add"}
          </button>
        )}
      </div>
      {editing && (
        <div className="mt-3 flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="pay.yourdomain.com"
            className="min-w-0 flex-1 rounded-lg border bg-muted/50 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            autoFocus
          />
          <button
            onClick={() => {
              onSave(draft);
              setEditing(false);
            }}
            className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-accent"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Funnel Chart ─── */

function FunnelStep({
  label,
  value,
  max,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  max: number;
  icon: React.ElementType;
  accent: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-3.5 w-3.5", accent)} />
          <span className="font-medium">{label}</span>
        </div>
        <span className="tabular-nums font-semibold">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className={cn("h-2 rounded-full transition-all", accent.replace("text-", "bg-"))}
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </div>
    </div>
  );
}

function ConversionLabel({ from, to }: { from: number; to: number }) {
  const rate = from > 0 ? ((to / from) * 100).toFixed(1) : "0";
  return (
    <div className="flex justify-center">
      <span className="text-[10px] font-medium text-muted-foreground">
        {rate}% →
      </span>
    </div>
  );
}

function ServiceFunnel() {
  const f = serviceFunnel;
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Services Funnel
      </p>
      <p className="mt-1 text-lg font-semibold">
        {f.paid} paid <span className="text-sm font-normal text-muted-foreground">of {f.visits} visits</span>
      </p>
      <div className="mt-4 space-y-1">
        <FunnelStep label="Page Visits" value={f.visits} max={f.visits} icon={Eye} accent="text-primary" />
        <ConversionLabel from={f.visits} to={f.quotes} />
        <FunnelStep label="Quotes Sent" value={f.quotes} max={f.visits} icon={FileText} accent="text-warning" />
        <ConversionLabel from={f.quotes} to={f.invoices} />
        <FunnelStep label="Invoices Created" value={f.invoices} max={f.visits} icon={Receipt} accent="text-accent-foreground" />
        <ConversionLabel from={f.invoices} to={f.paid} />
        <FunnelStep label="Paid" value={f.paid} max={f.visits} icon={CreditCard} accent="text-success" />
      </div>
    </div>
  );
}

function DonateFunnel() {
  const f = donateFunnel;
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Donations Funnel
      </p>
      <p className="mt-1 text-lg font-semibold">
        {formatCurrency(f.total)}{" "}
        <span className="text-sm font-normal text-muted-foreground">
          from {f.completed} donations
        </span>
      </p>
      <div className="mt-4 space-y-1">
        <FunnelStep label="Page Visits" value={f.visits} max={f.visits} icon={Eye} accent="text-primary" />
        <ConversionLabel from={f.visits} to={f.started} />
        <FunnelStep label="Started Payment" value={f.started} max={f.visits} icon={Heart} accent="text-warning" />
        <ConversionLabel from={f.started} to={f.completed} />
        <FunnelStep label="Completed" value={f.completed} max={f.visits} icon={DollarSign} accent="text-success" />
      </div>
    </div>
  );
}

/* ─── Page ─── */

export function CreatorPayments() {
  const [slug, setSlug] = useState(slugDefault);
  const [customDomain, setCustomDomain] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payment Page</h1>
        <p className="text-sm text-muted-foreground">
          Configure your public payment page and track its performance.
        </p>
      </div>

      {/* ── URL + Actions ── */}
      <PageUrlBlock slug={slug} customDomain={customDomain} />

      {/* ── Settings row ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SlugEditor slug={slug} onSave={setSlug} />
        <CustomDomainBlock domain={customDomain} onSave={setCustomDomain} />
      </div>

      {/* ── Customize + Tip ── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        {/* Customize Theme */}
        <button className="flex items-center gap-4 rounded-xl border bg-card p-5 text-left transition-colors hover:bg-accent/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Customize Theme</p>
            <p className="text-xs text-muted-foreground">
              Colors, layout, logo, and branding for your page
            </p>
          </div>
        </button>

        {/* Link-in-bio tip */}
        <div className="flex items-start gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Maximize Your Conversions</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Use your payment page link as your <strong className="text-foreground">link in bio</strong> on
              YouTube, Twitch, Instagram, TikTok, and X. A single unified link lets
              brands find you, request quotes, and pay — all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* ── Funnels ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ServiceFunnel />
        <DonateFunnel />
      </div>
    </div>
  );
}
