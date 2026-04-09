import { useState, useMemo } from "react";
import { clients, brands } from "@/data";
import type { ClientStatus } from "@/types";
import { cn } from "@/lib/utils";
import {
  Users,
  Rocket,
  Clock,
  DollarSign,
  Plus,
  FileText,
  Search,
} from "lucide-react";

const statusConfig: Record<
  ClientStatus,
  { label: string; color: string; bg: string }
> = {
  campaign_active: {
    label: "Campaign Active",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  awaiting_payment: {
    label: "Awaiting Payment",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  negotiation: {
    label: "Negotiation",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  inactive: {
    label: "Inactive",
    color: "text-gray-500",
    bg: "bg-gray-50 border-gray-200",
  },
};

const filterOptions: { value: ClientStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "campaign_active", label: "Active" },
  { value: "awaiting_payment", label: "Awaiting Payment" },
  { value: "negotiation", label: "Negotiation" },
  { value: "inactive", label: "Inactive" },
];

function getBrand(brandId: string) {
  return brands.find((b) => b.id === brandId);
}

export function CreatorClients() {
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "all">(
    "all"
  );
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (search) {
        const brand = getBrand(c.brandId);
        const q = search.toLowerCase();
        if (
          !brand?.name.toLowerCase().includes(q) &&
          !c.notes?.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [statusFilter, search]);

  const totalClients = clients.length;
  const activeCampaigns = clients.filter(
    (c) => c.status === "campaign_active"
  ).length;
  const awaitingPayment = clients.filter(
    (c) => c.status === "awaiting_payment"
  ).length;
  const totalOpen = clients.reduce((sum, c) => sum + c.openContractsAmount, 0);

  const stats = [
    {
      label: "Total Clients",
      value: totalClients,
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Active Campaigns",
      value: activeCampaigns,
      icon: Rocket,
      color: "text-emerald-600",
    },
    {
      label: "Awaiting Payment",
      value: awaitingPayment,
      icon: Clock,
      color: "text-amber-600",
    },
    {
      label: "Open Contracts",
      value: `$${totalOpen.toLocaleString()}`,
      icon: DollarSign,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            New Client
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors">
            <FileText className="h-4 w-4" />
            Create Quote
          </button>
        </div>
      </div>

      {/* Analytics tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted/50 p-2">
                <s.icon className={cn("h-5 w-5", s.color)} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((f) => {
            const count =
              f.value === "all"
                ? clients.length
                : clients.filter((c) => c.status === f.value).length;
            return (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  statusFilter === f.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted/50"
                )}
              >
                {f.label}{" "}
                <span className="ml-1 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search clients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-64"
          />
        </div>
      </div>

      {/* Client list */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Contracts</th>
              <th className="px-4 py-3 text-right">Open Amount</th>
              <th className="px-4 py-3">Last Activity</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No clients match your filters
                </td>
              </tr>
            )}
            {filtered.map((client) => {
              const brand = getBrand(client.brandId);
              const sc = statusConfig[client.status];
              return (
                <tr
                  key={client.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={brand?.logo}
                        alt={brand?.name}
                        className="h-8 w-8 rounded-full bg-muted"
                      />
                      <div>
                        <p className="font-medium">
                          {brand?.name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {brand?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        sc.bg,
                        sc.color
                      )}
                    >
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {client.contractsCount}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {client.openContractsAmount > 0
                      ? `$${client.openContractsAmount.toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(client.lastActivityAt).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                    {client.notes ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
