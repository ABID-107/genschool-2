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
    value: "0",
    icon: Building2,
    color: "teal" as const,
    description: "Registered institutions",
    href: "/super-admin/schools",
  },
  {
    label: "Active Admins",
    value: "0",
    icon: ShieldCheck,
    color: "amber" as const,
    description: "School administrators",
    href: "/super-admin/admins",
  },
  {
    label: "Total Teachers",
    value: "0",
    icon: Users,
    color: "navy" as const,
    description: "Across all schools",
    href: "#",
  },
  {
    label: "Total Students",
    value: "0",
    icon: GraduationCap,
    color: "teal" as const,
    description: "Enrolled learners",
    href: "#",
  },
];

const modules = [
  {
    title: "School Management",
    description: "Register, manage, and monitor all educational institutions on the platform.",
    icon: School,
    color: "teal" as const,
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
    color: "navy" as const,
    href: "/super-admin/analytics",
  },
  {
    title: "Global Settings",
    description: "Configure platform-wide policies, branding, and system preferences.",
    icon: Globe,
    color: "teal" as const,
    href: "/super-admin/settings",
  },
];

const colorMap = {
  teal: { icon: "bg-teal-500/15 text-teal-600" },
  amber: { icon: "bg-amber-500/15 text-amber-600" },
  navy: { icon: "bg-navy-500/15 text-navy-600" },
};

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-navy-900"
        >
          Super Admin Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-sm text-navy-500 mt-1"
        >
          Welcome to the GenSchool platform management console.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const c = colorMap[stat.color];
          const content = (
            <div className="bg-white rounded-xl border border-navy-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all h-full">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-navy-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-navy-900 tracking-tight">{stat.value}</p>
                  <p className="text-xs text-navy-400">{stat.description}</p>
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
          <h2 className="text-lg font-semibold text-navy-900">Platform Modules</h2>
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
                  className="bg-white rounded-xl border border-navy-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group h-full"
                >
                  <div className={`w-10 h-10 rounded-lg ${c.icon} flex items-center justify-center mb-3`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-semibold text-navy-900 mb-1 group-hover:text-amber-600 transition-colors">{mod.title}</h3>
                  <p className="text-xs text-navy-500 leading-relaxed">{mod.description}</p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-navy-200 p-6">
        <h2 className="text-lg font-semibold text-navy-900 mb-1">Quick Actions</h2>
        <p className="text-sm text-navy-500 mb-5">Frequently used platform management tasks.</p>
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
                <div className="flex items-center gap-3 p-3 rounded-xl border border-navy-200 bg-navy-50/50 hover:bg-navy-50 hover:border-navy-300 transition-all text-left cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-navy-100 text-navy-600 flex items-center justify-center">
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy-900">{action.label}</p>
                    <p className="text-[11px] text-navy-400">{action.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-navy-300" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
