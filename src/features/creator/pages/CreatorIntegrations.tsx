import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface Integration {
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  color: string;
}

const integrations: Integration[] = [
  {
    name: "Google Calendar",
    description: "Sync payment due dates and reminders to your calendar",
    icon: "https://www.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png",
    connected: true,
    color: "border-blue-200 bg-blue-50",
  },
  {
    name: "Stripe",
    description: "Accept credit card payments directly on invoices",
    icon: "https://images.stripeassets.com/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg",
    connected: false,
    color: "border-violet-200 bg-violet-50",
  },
  {
    name: "PayPal",
    description: "Enable PayPal as a payment method for your clients",
    icon: "https://www.paypalobjects.com/webstatic/icon/pp258.png",
    connected: false,
    color: "border-blue-200 bg-blue-50",
  },
  {
    name: "Slack",
    description: "Get invoice and payment notifications in Slack",
    icon: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png",
    connected: false,
    color: "border-purple-200 bg-purple-50",
  },
  {
    name: "QuickBooks",
    description: "Auto-sync invoices and payments with QuickBooks",
    icon: "https://quickbooks.intuit.com/oidam/intuit/ic/en_us/logos/quickbooks-icon-green-65x65.png",
    connected: false,
    color: "border-green-200 bg-green-50",
  },
  {
    name: "Notion",
    description: "Track invoice statuses in your Notion workspace",
    icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    connected: false,
    color: "border-neutral-200 bg-neutral-50",
  },
];

export function CreatorIntegrations() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
        <p className="text-sm text-muted-foreground">
          Connect your favorite tools to streamline your workflow
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((item) => (
          <div
            key={item.name}
            className={cn(
              "group relative rounded-xl border p-5 transition-shadow hover:shadow-md",
              item.connected ? item.color : "bg-card"
            )}
          >
            <div className="flex items-start gap-4">
              <img
                src={item.icon}
                alt={item.name}
                className="h-10 w-10 rounded-lg object-contain"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{item.name}</h3>
                  {item.connected && (
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success uppercase">
                      Connected
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
            <button
              className={cn(
                "mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                item.connected
                  ? "bg-white/60 text-foreground hover:bg-white/80"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {item.connected ? "Manage" : "Connect"}
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
