import {
  debitCard,
  withdrawalMethods,
  payoutTransactions,
} from "@/data";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { PayoutStatus } from "@/types";
import {
  CreditCard,
  Landmark,
  Wallet,
  Bitcoin,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

/* ─── Helpers ─── */

const methodMap = Object.fromEntries(withdrawalMethods.map((m) => [m.id, m]));

const methodIcon: Record<string, React.ElementType> = {
  bank_transfer: Landmark,
  paypal: Wallet,
  crypto: Bitcoin,
  debit_card: CreditCard,
};

function StatusBadge({ status }: { status: PayoutStatus }) {
  const styles: Record<PayoutStatus, string> = {
    completed: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    failed: "bg-destructive/10 text-destructive",
  };
  const icons: Record<PayoutStatus, React.ElementType> = {
    completed: CheckCircle2,
    pending: Clock,
    failed: XCircle,
  };
  const Icon = icons[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        styles[status]
      )}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

/* ─── Debit Card ─── */

function DebitCardBlock() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-700 p-6 text-white shadow-lg">
      {/* decorative circles */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-400">
            destream debit card
          </p>
          <p className="mt-3 text-3xl font-bold tabular-nums">
            {formatCurrency(debitCard.balance, debitCard.currency)}
          </p>
          <p className="mt-1 text-xs text-zinc-400">Available balance</p>
        </div>
        <CreditCard className="h-8 w-8 text-zinc-400" />
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div className="space-y-1 text-sm">
          <p className="tabular-nums text-zinc-300">
            •••• •••• •••• {debitCard.lastFour}
          </p>
          <p className="text-xs text-zinc-500">{debitCard.cardHolder}</p>
        </div>
        <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow transition hover:bg-zinc-100">
          Top Up Card
        </button>
      </div>
    </div>
  );
}

/* ─── Withdrawal Methods ─── */

function WithdrawalMethodsBlock() {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h2 className="font-semibold">Withdrawal Methods</h2>
          <p className="text-xs text-muted-foreground">
            {withdrawalMethods.length} configured
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90">
          <Plus className="h-3.5 w-3.5" />
          Add Method
        </button>
      </div>

      <div className="divide-y">
        {withdrawalMethods.map((m) => {
          const Icon = methodIcon[m.type] ?? Wallet;
          return (
            <div
              key={m.id}
              className="flex items-center gap-4 px-5 py-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.details}</p>
              </div>
              {m.isDefault && (
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                  Default
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Transactions Table ─── */

function TransactionsBlock() {
  const sorted = [...payoutTransactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h2 className="font-semibold">Withdrawal History</h2>
          <p className="text-xs text-muted-foreground">
            {payoutTransactions.length} transactions
          </p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs font-medium text-muted-foreground">
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Method</th>
              <th className="px-5 py-3 text-right">Amount</th>
              <th className="px-5 py-3 text-right">Fee</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sorted.map((tx) => {
              const method = methodMap[tx.methodId];
              const Icon = method
                ? methodIcon[method.type] ?? Wallet
                : Wallet;
              return (
                <tr key={tx.id} className="transition hover:bg-muted/40">
                  <td className="whitespace-nowrap px-5 py-3 tabular-nums">
                    {formatDate(tx.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{method?.label ?? "—"}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums font-medium">
                    {formatCurrency(tx.amount, tx.currency)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums text-muted-foreground">
                    {tx.fee > 0
                      ? `-${formatCurrency(tx.fee, tx.currency)}`
                      : "Free"}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="divide-y md:hidden">
        {sorted.map((tx) => {
          const method = methodMap[tx.methodId];
          const Icon = method ? methodIcon[method.type] ?? Wallet : Wallet;
          return (
            <div key={tx.id} className="flex items-center gap-3 px-5 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {method?.label ?? "Withdrawal"}
                  </p>
                  <span className="tabular-nums text-sm font-medium">
                    {formatCurrency(tx.amount, tx.currency)}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(tx.createdAt)}
                  </p>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Page ─── */

export function CreatorPayouts() {
  const totalWithdrawn = payoutTransactions
    .filter((t) => t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payouts</h1>
          <p className="text-sm text-muted-foreground">
            Total withdrawn:{" "}
            <span className="font-medium text-foreground">
              {formatCurrency(totalWithdrawn)}
            </span>
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90">
          <ArrowUpRight className="h-4 w-4" />
          Withdraw Funds
        </button>
      </div>

      {/* Top row: card + methods */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DebitCardBlock />
        <WithdrawalMethodsBlock />
      </div>

      {/* Transactions */}
      <TransactionsBlock />
    </div>
  );
}
