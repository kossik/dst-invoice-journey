import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "User Dashboard", to: "/creator" },
  { label: "Brand View", to: "/brand" },
  { label: "Public Page", to: "/p/cr-1" },
  { label: "Invoice", to: "/invoice/INV-002" },
];

export function SuperHeader() {
  return (
    <div className="bg-foreground text-background text-xs">
      <div className="mx-auto flex max-w-screen-2xl items-center gap-1 overflow-x-auto px-4 py-1.5">
        <span className="mr-3 shrink-0 font-semibold tracking-wide opacity-60 uppercase">
          Mockup Nav
        </span>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "shrink-0 rounded-sm px-2.5 py-1 transition-colors",
                isActive
                  ? "bg-white/20 font-medium text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white/80"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
