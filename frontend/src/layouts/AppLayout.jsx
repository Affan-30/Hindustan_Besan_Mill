import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, Users, Truck, FileBarChart, LogOut, Menu, X,
  Wheat, Banknote, Package, Receipt, CalendarRange, IndianRupee,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const navSections = [
  {
    title: "Overview",
    items: [{ to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    title: "Daily Operations",
    items: [
      { to: "/app/daily-entry", label: "Daily Entry", icon: ClipboardList },
      { to: "/app/production", label: "Production", icon: Wheat },
      { to: "/app/worker-payments", label: "Worker Payments", icon: Banknote },
      { to: "/app/other-payments", label: "Other Payments", icon: Receipt },
      { to: "/app/raw-materials", label: "Raw Materials", icon: Package },
      { to: "/app/bills", label: "Bills", icon: FileBarChart },
    ],
  },
  {
    title: "Sales",
    items: [
      { to: "/app/sales", label: "Payment Received", icon: IndianRupee },
    ],
  },
  {
    title: "Management",
    items: [
      { to: "/app/workers", label: "Workers", icon: Users },
      { to: "/app/suppliers", label: "Suppliers", icon: Truck },
    ],
  },
  {
    title: "Reports",
    items: [
      { to: "/app/reports/daily", label: "Today's Report", icon: FileBarChart },
      { to: "/app/reports/range", label: "Date Range Report", icon: CalendarRange },
      { to: "/app/reports/monthly", label: "Monthly Report", icon: CalendarRange },
    ],
  },
];

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-wheat-200">
  <div className="flex gap-3 items-center justify-center">
    <div className="w-25 h-25 rounded-lg overflow-hidden bg-white flex items-center justify-center">
      <img
        src="/logo.jpg"
        alt="Hindustan Besan Mill"
        className="w-full h-full object-contain"
      />
    </div>
    <div> 
      <p className="text-2xl font-display font-bold text-ink-900 leading-tight">Hindustan <br /> Besan Mill</p> 
      <p className="text-xs text-ink-800/60">Production &amp; Expense System</p> 
      </div>
  </div>
</div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wide text-ink-800/40">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-mustard-500 text-white"
                        : "text-ink-800 hover:bg-wheat-100"
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-wheat-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-900">{user?.name}</p>
            <p className="text-xs text-ink-800/60">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="text-ink-800/60 hover:text-brick-600" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white border-r border-wheat-200 no-print">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden no-print">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">{SidebarContent}</aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-wheat-200 px-4 py-3 flex items-center justify-between no-print">
          <button onClick={() => setMobileOpen(true)} className="text-ink-900">
            <Menu size={24} />
          </button>
          <span className="font-display font-semibold text-ink-900">Hindustan Besan Mill</span>
          <div className="w-6" />
        </header>

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}