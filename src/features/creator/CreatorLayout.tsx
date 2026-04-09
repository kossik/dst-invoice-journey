import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Globe,
  Puzzle,
  Wallet,
  Users,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { activeCreator } from "@/data";
import { useState } from "react";

const sidebarItems = [
  { label: "Dashboard", to: "/creator", icon: LayoutDashboard, end: true },
  { label: "Quotes", to: "/creator/quotes", icon: FileText, badge: 3 },
  { label: "Payment Calendar", to: "/creator/calendar", icon: CalendarDays },
  { label: "Clients", to: "/creator/clients", icon: Users },
  { label: "Public Offers", to: "/creator/offers", icon: Globe },
  { label: "Payouts", to: "/creator/payouts", icon: Wallet },
  { label: "Integrations", to: "/creator/integrations", icon: Puzzle },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 flex h-full w-64 flex-col border-r bg-card pt-[calc(2rem+36px)] transition-transform lg:sticky lg:translate-x-0 lg:pt-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand header inside sidebar on desktop */}
        <div className="hidden h-14 items-center border-b px-5 lg:flex">
          <span className="text-lg font-bold tracking-tight">destream</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.badge && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User pill */}
        <div className="border-t p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <img
              src={activeCreator.avatar}
              alt={activeCreator.name}
              className="h-8 w-8 rounded-full bg-muted"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{activeCreator.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {activeCreator.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function CreatorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-36px)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-[36px] z-20 flex h-14 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 hover:bg-accent lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="text-lg font-bold tracking-tight lg:hidden">
            destream
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
