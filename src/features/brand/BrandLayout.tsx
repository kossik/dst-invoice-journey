import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Receipt,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { brands } from "@/data";
import { useState } from "react";

const activeBrand = brands[0]!;

const sidebarItems = [
  { label: "Dashboard", to: "/brand", icon: LayoutDashboard, end: true },
  { label: "Storefront", to: "/brand/storefront", icon: ShoppingBag },
  { label: "My Quotes", to: "/brand/quotes", icon: FileText },
  { label: "Invoices", to: "/brand/invoices", icon: Receipt },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 flex h-full w-64 flex-col border-r bg-card pt-[calc(2rem+36px)] transition-transform lg:sticky lg:translate-x-0 lg:pt-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="hidden h-14 items-center border-b px-5 lg:flex">
          <span className="text-lg font-bold tracking-tight">destream</span>
          <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            BRAND
          </span>
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
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <img
              src={activeBrand.logo}
              alt={activeBrand.name}
              className="h-8 w-8 rounded-full bg-muted"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {activeBrand.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {activeBrand.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function BrandLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-36px)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-[36px] z-20 flex h-14 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 hover:bg-accent lg:hidden"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <span className="text-lg font-bold tracking-tight lg:hidden">
            destream
          </span>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
