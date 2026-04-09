import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { creators, offers } from "@/data";
import { cn } from "@/lib/utils";
import type { OfferCategory } from "@/types";
import {
  Search,
  Star,
  Users,
  Briefcase,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

const categoryLabels: Record<OfferCategory, string> = {
  in_stream_ads: "In-Stream Ads",
  brand_ambassador: "Brand Ambassador",
  native_integration: "Native Integration",
  sponsored_video: "Sponsored Video",
  social_post: "Social Post",
  shoutout: "Shoutout",
  product_review: "Product Review",
  podcast_ad: "Podcast Ad",
};

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function BrandStorefront() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<OfferCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"rating" | "followers" | "deals">(
    "rating",
  );

  const filtered = creators.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !c.name.toLowerCase().includes(q) &&
        !c.bio.toLowerCase().includes(q)
      )
        return false;
    }
    if (catFilter !== "all") {
      if (!c.categories.includes(catFilter)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "followers") return b.followers - a.followers;
    return b.completedDeals - a.completedDeals;
  });

  const allCategories = Array.from(
    new Set(creators.flatMap((c) => c.categories)),
  ) as OfferCategory[];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Creator Storefront</h1>
        <p className="text-sm text-muted-foreground">
          Browse {creators.length} creators on the platform
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search creators…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "rating" | "followers" | "deals")
            }
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          >
            <option value="rating">Top Rated</option>
            <option value="followers">Most Followers</option>
            <option value="deals">Most Deals</option>
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setCatFilter("all")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            catFilter === "all"
              ? "bg-primary text-white"
              : "bg-muted text-muted-foreground hover:bg-accent",
          )}
        >
          All
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              catFilter === cat
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-accent",
            )}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        Showing {sorted.length} creator{sorted.length !== 1 && "s"}
      </p>

      {/* Creator grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((creator) => {
          const creatorOffers = offers.filter(
            (o) => o.creatorId === creator.id && o.active,
          );
          const priceRange =
            creatorOffers.length > 0
              ? `$${Math.min(...creatorOffers.map((o) => o.price))}–$${Math.max(...creatorOffers.map((o) => o.price))}`
              : "—";

          return (
            <button
              key={creator.id}
              onClick={() => navigate(`/brand/storefront/${creator.id}`)}
              className="group flex flex-col rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="h-10 w-10 shrink-0 rounded-full bg-muted"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold">
                      {creator.name}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {creator.bio}
                  </p>
                </div>
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1">
                {creator.categories.slice(0, 2).map((cat) => (
                  <span
                    key={cat}
                    className="rounded-md bg-muted/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {categoryLabels[cat]}
                  </span>
                ))}
                {creator.categories.length > 2 && (
                  <span className="rounded-md bg-muted/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    +{creator.categories.length - 2}
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center gap-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-500" />
                  {creator.rating}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {formatFollowers(creator.followers)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {creator.completedDeals} deals
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="font-medium">{priceRange}</span>
                <span className="text-muted-foreground">
                  {creatorOffers.length} offer
                  {creatorOffers.length !== 1 && "s"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No creators match your filters.
        </div>
      )}
    </div>
  );
}
