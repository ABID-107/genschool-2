"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Users,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  School,
  Activity,
  Globe,
  Settings,
  ArrowRight,
} from "lucide-react";

const stats = [
  {
    label: "Total Schools",
    value: "5",
    icon: Building2,
    color: "brand" as const,
    description: "Registered institutions",
    href: "/super-admin/schools",
  },
  {
    label: "Active Admins",
    value: "6",
    icon: ShieldCheck,
    color: "amber" as const,
    description: "School administrators",
    href: "/super-admin/admins",
  },
  {
    label: "Total Teachers",
    value: "427",
    icon: Users,
    color: "brand" as const,
    description: "Across all schools",
    href: "#",
  },
  {
    label: "Total Students",
    value: "6,152",
    icon: GraduationCap,
    color: "amber" as const,
    description: "Enrolled learners",
    href: "#",
  },
];

const modules = [
  {
    title: "School Management",
    description: "Register, manage, and monitor all educational institutions on the platform.",
    icon: School,
    color: "brand" as const,
    href: "/super-admin/schools",
  },
  {
    title: "Admin Oversight",
    description: "Manage school-level administrators with role-based access controls.",
    icon: ShieldCheck,
    color: "amber" as const,
    href: "/super-admin/admins",
  },
  {
    title: "Platform Analytics",
    description: "Comprehensive insights into platform usage, growth, and performance metrics.",
    icon: TrendingUp,
    color: "brand" as const,
    href: "/super-admin/analytics",
  },
  {
    title: "Global Settings",
    description: "Configure platform-wide policies, branding, and system preferences.",
    icon: Globe,
    color: "amber" as const,
    href: "/super-admin/settings",
  },
];

const colorMap = {
  brand: {
    icon: "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]",
    card: "border-[var(--border-light)] hover:border-[var(--brand-accent)]/40",
  },
  amber: {
    icon: "bg-[var(--amber-50)] text-[var(--amber-600)]",
    card: "border-[var(--border-light)] hover:border-[var(--amber-300)]",
  },
};

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-[var(--text-primary)]"
        >
          Super Admin Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-sm text-[var(--text-muted)] mt-1"
        >
          Welcome to the GenSchool platform management console.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const c = colorMap[stat.color];
          const content = (
            <div className="stat-card h-full">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[var(--text-muted)]">{stat.label}</p>
                  <p className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{stat.value}</p>
                  <p className="text-xs text-[var(--text-muted)]">{stat.description}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );

          if (stat.href === "#") {
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
              >
                {content}
              </motion.div>
            );
          }

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
            >
              <Link href={stat.href} className="block no-underline">{content}</Link>
            </motion.div>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Platform Modules</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            const c = colorMap[mod.color];
            return (
              <Link key={mod.title} href={mod.href} className="no-underline">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="card card-hover p-5 h-full"
                >
                  <div className={`w-10 h-10 rounded-lg ${c.icon} flex items-center justify-center mb-3`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--brand-primary)] transition-colors">{mod.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{mod.description}</p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Quick Actions</h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">Frequently used platform management tasks.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Register School", icon: School, desc: "Add a new institution", href: "/super-admin/schools" },
            { label: "Create Admin", icon: ShieldCheck, desc: "Assign school admin", href: "/super-admin/admins" },
            { label: "View Reports", icon: Activity, desc: "Platform analytics", href: "/super-admin/analytics" },
            { label: "System Config", icon: Settings, desc: "Global settings", href: "/super-admin/settings" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href} className="no-underline">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-light)] bg-[var(--bg-tertiary)]/30 hover:bg-[var(--bg-tertiary)]/60 hover:border-[var(--brand-accent)]/40 transition-all text-left cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center">
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{action.label}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{action.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-[var(--text-muted)]" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
