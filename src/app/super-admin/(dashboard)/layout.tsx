"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useSuperAdminStore } from "@/store/superAdminStore";

const navItems = [
  { href: "/super-admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/super-admin/schools", label: "Schools", icon: Building2 },
  { href: "/super-admin/admins", label: "Admins", icon: Users },
  { href: "/super-admin/plans", label: "Plans", icon: CreditCard },
  { href: "/super-admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/super-admin/audit-log", label: "Audit Log", icon: ScrollText },
  { href: "/super-admin/settings", label: "Settings", icon: Settings },
];

const breadcrumbMap: Record<string, string> = {
  "/super-admin": "Dashboard",
  "/super-admin/schools": "Schools",
  "/super-admin/admins": "Admins",
  "/super-admin/plans": "Plans",
  "/super-admin/analytics": "Analytics",
  "/super-admin/audit-log": "Audit Log",
  "/super-admin/settings": "Settings",
};

function getBreadcrumbs(pathname: string): { href: string; label: string }[] {
  const crumbs: { href: string; label: string }[] = [{ href: "/super-admin", label: "Dashboard" }];
  if (pathname === "/super-admin") return crumbs;

  const matchedKey = Object.keys(breadcrumbMap).find((key) => pathname === key);
  if (matchedKey) {
    crumbs.push({ href: pathname, label: breadcrumbMap[matchedKey] });
    return crumbs;
  }

  const parentKey = Object.keys(breadcrumbMap).find((key) => pathname.startsWith(key + "/"));
  if (parentKey) {
    crumbs.push({ href: parentKey, label: breadcrumbMap[parentKey] });
    const rest = pathname.slice(parentKey.length + 1);
    crumbs.push({ href: pathname, label: rest.charAt(0).toUpperCase() + rest.slice(1) });
  }

  return crumbs;
}

export default function SuperAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout, hydrate } = useSuperAdminStore();
  const breadcrumbs = getBreadcrumbs(pathname);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/super-admin/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = useCallback(() => {
    logout();
    router.replace("/super-admin/login");
  }, [logout, router]);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 glass-sidebar flex flex-col shrink-0 fixed h-full z-30 transition-all duration-300 ${
          sidebarOpen
            ? "translate-x-0 visible"
            : "-translate-x-full invisible lg:translate-x-0 lg:visible"
        }`}
      >
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--border-sidebar)] shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-mid)] flex items-center justify-center shadow-sm">
            <Shield size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <span className="text-base font-bold tracking-tight block leading-tight text-[var(--text-sidebar)]">GenSchool</span>
            <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest">Super Admin</span>
          </div>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1 rounded-lg hover:bg-[var(--sidebar-hover-bg)] text-[var(--text-sidebar-muted)] transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/super-admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                  isActive
                    ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] border border-[var(--sidebar-active-border)] shadow-sm"
                    : "text-[var(--text-sidebar-muted)] hover:text-[var(--text-sidebar)] hover:bg-[var(--sidebar-hover-bg)]"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--border-sidebar)]">
          <div className="px-3 py-2 mb-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--border-sidebar)]">
            <p className="text-xs text-[var(--text-sidebar-muted)] truncate">{user?.email || "superadmin@genschool.com"}</p>
            <p className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider">SUPER_ADMIN</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-sidebar-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <header className="h-16 bg-[var(--bg-secondary)]/80 backdrop-blur-md border-b border-[var(--border-color)] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-muted)]"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <nav className="flex items-center gap-1.5 text-sm min-w-0" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
                  {i > 0 && <ChevronRight size={14} className="text-[var(--text-muted)] shrink-0" />}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="font-semibold text-[var(--text-primary)] truncate">{crumb.label}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors truncate no-underline"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-amber-50/50 border border-amber-200/50">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
                Dev Mode
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-mid)] flex items-center justify-center text-white font-bold text-xs shrink-0">
              SA
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
