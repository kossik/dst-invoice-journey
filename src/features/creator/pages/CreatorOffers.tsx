import { offers, activeCreator } from "@/data";
import { formatCurrency, cn } from "@/lib/utils";
import type { OfferCategory } from "@/types";
import {
  Plus,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  Search,
  Repeat,
  Tv,
  Users,
  MonitorPlay,
  Video,
  MessageCircle,
  Megaphone,
  Star,
  Mic,
} from "lucide-react";
import { useState } from "react";

/* ─── Category config ─── */

const categoryConfig: Record<
  OfferCategory,
  { label: string; icon: React.ElementType; color: string }
> = {
  in_stream_ads: { label: "In-Stream Ads", icon: Tv, color: "bg-blue-500/10 text-blue-500" },
  brand_ambassador: { label: "Brand Ambassador", icon: Users, color: "bg-purple-500/10 text-purple-500" },
  native_integration: { label: "Native Integration", icon: MonitorPlay, color: "bg-emerald-500/10 text-emerald-500" },
  sponsored_video: { label: "Sponsored Video", icon: Video, color: "bg-orange-500/10 text-orange-500" },
  social_post: { label: "Social Post", icon: MessageCircle, color: "bg-pink-500/10 text-pink-500" },
  shoutout: { label: "Shoutout", icon: Megaphone, color: "bg-yellow-500/10 text-yellow-600" },
  product_review: { label: "Product Review", icon: Star, color: "bg-cyan-500/10 text-cyan-600" },
  podcast_ad: { label: "Podcast Ad", icon: Mic, color: "bg-indigo-500/10 text-indigo-500" },
};

const categories: OfferCategory[] = Object.keys(categoryConfig) as OfferCategory[];

/* ─── Stats ─── */

const myOffers = offers.filter((o) => o.creatorId === activeCreator.id);
const totalOffers = myOffers.length;
const activeOffers = myOffers.filter((o) => o.active).length;
const totalSales = myOffers.reduce((s, o) => s + o.salesCount, 0);
const totalRevenue = myOffers.reduce((s, o) => s + o.totalEarned, 0);

/* ─── Stat Card ─── */

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            accent ?? "bg-muted text-muted-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

/* ─── Billing badge ─── */

function BillingBadge({ billing }: { billing: "one_time" | "recurring" }) {
  return billing === "recurring" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-[11px] font-medium text-purple-600">
      <Repeat className="h-3 w-3" />
      Recurring
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      One-time
    </span>
  );
}

/* ─── Page ─── */

export function CreatorOffers() {
  const [catFilter, setCatFilter] = useState<OfferCategory | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = myOffers.filter((o) => {
    if (catFilter !== "all" && o.category !== catFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.title.toLowerCase().includes(q) ||
        categoryConfig[o.category].label.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header + CTA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Public Offers</h1>
          <p className="text-sm text-muted-foreground">
            Services visible on your payment page for brands to purchase.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add New Offer
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Offers"
          value={String(totalOffers)}
          icon={Package}
          accent="bg-primary/10 text-primary"
        />
        <StatCard
          label="Active"
          value={String(activeOffers)}
          icon={TrendingUp}
          accent="bg-success/10 text-success"
        />
        <StatCard
          label="Total Sales"
          value={totalSales.toLocaleString()}
          icon={ShoppingCart}
          accent="bg-warning/10 text-warning"
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          accent="bg-success/10 text-success"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setCatFilter("all")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              catFilter === "all"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50"
            )}
          >
            All
          </button>
          {categories.map((cat) => {
            const cfg = categoryConfig[cat];
            const count = myOffers.filter((o) => o.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  catFilter === cat
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50"
                )}
              >
                {cfg.label}
                <span className="ml-1 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search offers…"
            className="h-8 w-full rounded-lg border bg-transparent pl-8 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring sm:w-56"
          />
        </div>
      </div>

      {/* Offers list */}
      <div className="rounded-xl border bg-card">
        {/* Table header — desktop */}
        <div className="hidden grid-cols-[1fr_auto_auto_auto_auto_auto] items-center gap-4 border-b px-5 py-3 text-xs font-medium text-muted-foreground md:grid">
          <span>Offer</span>
          <span className="w-24 text-right">Price</span>
          <span className="w-20 text-center">Type</span>
          <span className="w-16 text-right">Sales</span>
          <span className="w-24 text-right">Earned</span>
          <span className="w-16 text-center">Status</span>
        </div>

        {filtered.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            No offers found.
          </p>
        )}

        {filtered.map((offer) => {
          const cfg = categoryConfig[offer.category];
          const CatIcon = cfg.icon;
          return (
            <div
              key={offer.id}
              className="grid grid-cols-[1fr_auto] items-center gap-4 border-b px-5 py-4 last:border-b-0 md:grid-cols-[1fr_auto_auto_auto_auto_auto]"
            >
              {/* Title + category */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    cfg.color
                  )}
                >
                  <CatIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{offer.title}</p>
                  <p className="text-xs text-muted-foreground">{cfg.label}</p>
                </div>
              </div>

              {/* Price */}
              <p className="w-24 text-right text-sm font-semibold tabular-nums">
                {formatCurrency(offer.price, offer.currency)}
              </p>

              {/* Billing type */}
              <div className="hidden w-20 justify-center md:flex">
                <BillingBadge billing={offer.billing} />
              </div>

              {/* Sales */}
              <p className="hidden w-16 text-right text-sm tabular-nums md:block">
                {offer.salesCount}
              </p>

              {/* Earned */}
              <p className="hidden w-24 text-right text-sm font-semibold tabular-nums text-success md:block">
                {formatCurrency(offer.totalEarned, offer.currency)}
              </p>

              {/* Active status */}
              <div className="hidden w-16 justify-center md:flex">
                <span
                  className={cn(
                    "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                    offer.active
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {offer.active ? "Active" : "Paused"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
