import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { creators, offers } from "@/data";
import { cn, formatCurrency } from "@/lib/utils";
import type { OfferCategory } from "@/types";
import {
  ArrowLeft,
  Star,
  Users,
  Briefcase,
  ShoppingBag,
  Repeat,
  Zap,
  X,
  CheckCircle2,
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

export function BrandCreatorDetail() {
  const { creatorId } = useParams<{ creatorId: string }>();
  const navigate = useNavigate();
  const creator = creators.find((c) => c.id === creatorId);

  const [orderOffer, setOrderOffer] = useState<string | null>(null);
  const [orderSent, setOrderSent] = useState(false);

  if (!creator) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Creator not found.
      </div>
    );
  }

  const activeOffers = offers.filter(
    (o) => o.creatorId === creator.id && o.active,
  );
  const selectedOffer = orderOffer
    ? offers.find((o) => o.id === orderOffer)
    : null;

  function handlePlaceOrder() {
    setOrderSent(true);
    setTimeout(() => {
      setOrderOffer(null);
      setOrderSent(false);
    }, 2000);
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/brand/storefront")}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Storefront
      </button>

      {/* Creator profile header */}
      <div className="flex items-start gap-4">
        <img
          src={creator.avatar}
          alt={creator.name}
          className="h-16 w-16 rounded-full bg-muted"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{creator.name}</h1>
          <p className="text-sm text-muted-foreground">{creator.bio}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-500" />
              {creator.rating}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {formatFollowers(creator.followers)} followers
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" />
              {creator.completedDeals} completed deals
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {creator.categories.map((cat) => (
              <span
                key={cat}
                className="rounded-md bg-muted/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {categoryLabels[cat]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Offers */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">
          Available Services ({activeOffers.length})
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeOffers.map((offer) => (
            <div
              key={offer.id}
              className="flex flex-col rounded-xl border border-border bg-card p-5 space-y-3"
            >
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold">{offer.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {categoryLabels[offer.category]}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium",
                      offer.billing === "recurring"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-gray-50 text-gray-600",
                    )}
                  >
                    {offer.billing === "recurring" ? (
                      <Repeat className="h-2.5 w-2.5" />
                    ) : (
                      <Zap className="h-2.5 w-2.5" />
                    )}
                    {offer.billing === "recurring" ? "Recurring" : "One-time"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="text-lg font-bold">
                  {formatCurrency(offer.price, offer.currency)}
                  {offer.billing === "recurring" && (
                    <span className="text-xs font-normal text-muted-foreground">
                      /month
                    </span>
                  )}
                </span>
                <button
                  onClick={() => setOrderOffer(offer.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-6 shadow-xl">
            {orderSent ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <p className="text-lg font-semibold">Order Placed!</p>
                <p className="text-center text-sm text-muted-foreground">
                  Your request for &ldquo;{selectedOffer.title}&rdquo; has been
                  sent to {creator.name}.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Place Order</h3>
                  <button
                    onClick={() => setOrderOffer(null)}
                    className="rounded-md p-1 hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {selectedOffer.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {categoryLabels[selectedOffer.category]}
                    </p>
                  </div>
                  <span className="font-bold">
                    {formatCurrency(
                      selectedOffer.price,
                      selectedOffer.currency,
                    )}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Message (optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Any specific requirements…"
                      className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
