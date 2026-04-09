import { useState } from "react";
import { useParams } from "react-router-dom";
import { creators, offers } from "@/data";
import { cn, formatCurrency } from "@/lib/utils";
import type { Offer, OfferCategory } from "@/types";
import {
  Star,
  Users,
  Briefcase,
  Repeat,
  Zap,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  CheckCircle2,
  Calendar,
  MessageSquare,
  FileText,
} from "lucide-react";

/* ─── Helpers ─── */

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

/* ─── Cart item type ─── */

interface CartItem {
  offerId: string;
  comment: string;
  conditions: string;
  desiredDate: string;
  deadline: string;
}

/* ─── Component ─── */

export function PublicCreatorPage() {
  const { creatorId } = useParams<{ creatorId: string }>();
  const creator = creators.find((c) => c.id === creatorId);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [expandedCartItem, setExpandedCartItem] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!creator) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-16 text-center text-sm text-muted-foreground">
        Creator not found.
      </div>
    );
  }

  const activeOffers = offers.filter(
    (o) => o.creatorId === creator.id && o.active,
  );

  const isInCart = (offerId: string) => cart.some((c) => c.offerId === offerId);

  function addToCart(offer: Offer) {
    if (isInCart(offer.id)) return;
    setCart((prev) => [
      ...prev,
      {
        offerId: offer.id,
        comment: "",
        conditions: "",
        desiredDate: "",
        deadline: "",
      },
    ]);
  }

  function removeFromCart(offerId: string) {
    setCart((prev) => prev.filter((c) => c.offerId !== offerId));
    if (expandedCartItem === offerId) setExpandedCartItem(null);
  }

  function updateCartItem(offerId: string, patch: Partial<CartItem>) {
    setCart((prev) =>
      prev.map((c) => (c.offerId === offerId ? { ...c, ...patch } : c)),
    );
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  const cartTotal = cart.reduce((sum, item) => {
    const offer = offers.find((o) => o.id === item.offerId);
    return sum + (offer?.price ?? 0);
  }, 0);

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ─── Left: Creator profile + offers ─── */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* Creator header */}
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
                  {creator.completedDeals} deals
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
            <div className="grid gap-4 sm:grid-cols-2">
              {activeOffers.map((offer) => {
                const inCart = isInCart(offer.id);
                return (
                  <div
                    key={offer.id}
                    className={cn(
                      "flex flex-col rounded-xl border bg-card p-5 space-y-3 transition-colors",
                      inCart
                        ? "border-primary/40 bg-primary/[0.02]"
                        : "border-border",
                    )}
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
                          {offer.billing === "recurring"
                            ? "Recurring"
                            : "One-time"}
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
                      {inCart ? (
                        <button
                          onClick={() => removeFromCart(offer.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                          <Minus className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart(offer)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Right: Cart sidebar ─── */}
        <div className="w-full shrink-0 lg:w-96">
          <div className="sticky top-4 space-y-4 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <ShoppingCart className="h-5 w-5" />
                Cart
              </h2>
              {cart.length > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
                  {cart.length}
                </span>
              )}
            </div>

            {cart.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Add services to your cart to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  const offer = offers.find((o) => o.id === item.offerId)!;
                  const isExpanded = expandedCartItem === item.offerId;
                  return (
                    <div
                      key={item.offerId}
                      className="rounded-lg border border-border bg-background p-3 space-y-2"
                    >
                      {/* Cart item header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {offer.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(offer.price, offer.currency)}
                            {offer.billing === "recurring" && "/mo"}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.offerId)}
                          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Expand/collapse details */}
                      <button
                        onClick={() =>
                          setExpandedCartItem(
                            isExpanded ? null : item.offerId,
                          )
                        }
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        <FileText className="h-3 w-3" />
                        {isExpanded
                          ? "Hide details"
                          : "Add comments & conditions"}
                      </button>

                      {isExpanded && (
                        <div className="space-y-2 pt-1">
                          <div>
                            <label className="mb-0.5 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                              <MessageSquare className="h-3 w-3" />
                              Comment
                            </label>
                            <textarea
                              rows={2}
                              value={item.comment}
                              onChange={(e) =>
                                updateCartItem(item.offerId, {
                                  comment: e.target.value,
                                })
                              }
                              placeholder="Specific requirements…"
                              className="w-full resize-none rounded-md border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="mb-0.5 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                              <FileText className="h-3 w-3" />
                              Conditions
                            </label>
                            <textarea
                              rows={2}
                              value={item.conditions}
                              onChange={(e) =>
                                updateCartItem(item.offerId, {
                                  conditions: e.target.value,
                                })
                              }
                              placeholder="Payment terms, usage rights…"
                              className="w-full resize-none rounded-md border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="mb-0.5 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                Desired Date
                              </label>
                              <input
                                type="date"
                                value={item.desiredDate}
                                onChange={(e) =>
                                  updateCartItem(item.offerId, {
                                    desiredDate: e.target.value,
                                  })
                                }
                                className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                              />
                            </div>
                            <div>
                              <label className="mb-0.5 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                Deadline
                              </label>
                              <input
                                type="date"
                                value={item.deadline}
                                onChange={(e) =>
                                  updateCartItem(item.offerId, {
                                    deadline: e.target.value,
                                  })
                                }
                                className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Total */}
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total
                  </span>
                  <span className="text-lg font-bold">
                    {formatCurrency(cartTotal, "USD")}
                  </span>
                </div>

                {/* Checkout button */}
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  Proceed to Request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Registration / Checkout modal ─── */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-lg space-y-5 rounded-xl border border-border bg-card p-6 shadow-xl">
            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                <p className="text-xl font-semibold">Request Sent!</p>
                <p className="max-w-xs text-center text-sm text-muted-foreground">
                  Your request with {cart.length} service
                  {cart.length !== 1 && "s"} has been sent to{" "}
                  {creator.name}. They will review and get back to you shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Register & Send Request
                  </h3>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="rounded-md p-1 hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Order summary */}
                <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Order Summary
                  </p>
                  {cart.map((item) => {
                    const offer = offers.find((o) => o.id === item.offerId)!;
                    return (
                      <div
                        key={item.offerId}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="truncate">{offer.title}</span>
                        <span className="shrink-0 font-medium">
                          {formatCurrency(offer.price, offer.currency)}
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between border-t border-border pt-2 text-sm font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(cartTotal, "USD")}</span>
                  </div>
                </div>

                {/* Registration form */}
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Create an account to send your request
                  </p>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Smith"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Corporate Email
                    </label>
                    <input
                      type="email"
                      placeholder="john@acme.com"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  Register & Send Request
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
