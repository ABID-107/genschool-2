"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ScrollText,
  Search,
  Filter,
  Clock,
  User,
  Building2,
  ShieldCheck,
} from "lucide-react";

const logs = [
  { id: 1, action: "School Registered", user: "Super Admin", target: "Oakridge International", type: "school", timestamp: "2 min ago", status: "success" },
  { id: 2, action: "Admin Created", user: "Super Admin", target: "lisa@oakridge.edu", type: "admin", timestamp: "5 min ago", status: "success" },
  { id: 3, action: "Plan Changed", user: "Super Admin", target: "Riverside Academy → Professional", type: "plan", timestamp: "1 hour ago", status: "success" },
  { id: 4, action: "School Deactivated", user: "Super Admin", target: "St. Mary's Convent", type: "school", timestamp: "3 hours ago", status: "warning" },
  { id: 5, action: "Login Attempt", user: "john@riverside.edu", target: "Failed login", type: "auth", timestamp: "5 hours ago", status: "error" },
  { id: 6, action: "Settings Updated", user: "Super Admin", target: "Platform branding", type: "settings", timestamp: "1 day ago", status: "success" },
  { id: 7, action: "Admin Deactivated", user: "Super Admin", target: "michael@stmarys.edu", type: "admin", timestamp: "2 days ago", status: "warning" },
];

const statusColors: Record<string, string> = {
  success: "bg-teal-50 text-teal-600 border-teal-200",
  warning: "bg-amber-50 text-amber-600 border-amber-200",
  error: "bg-red-50 text-red-600 border-red-200",
};

const typeIcons: Record<string, React.ElementType> = {
  school: Building2,
  admin: ShieldCheck,
  plan: ScrollText,
  auth: User,
  settings: ScrollText,
};

export default function AuditLogPage() {
  const [search, setSearch] = useState("");

  const filtered = logs.filter((log) =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-navy-900">Audit Log</h1>
        <p className="text-sm text-navy-500 mt-1">
          Track all platform-wide administrative actions and events.
        </p>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit log..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-navy-200 text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-all"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-navy-200 text-navy-600 text-sm font-medium hover:bg-navy-50 transition-all">
          <Filter size={16} />
          Filters
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-navy-200 text-navy-600 text-sm font-medium hover:bg-navy-50 transition-all">
          <Clock size={16} />
          Export
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-navy-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-200 bg-navy-50/50">
                <th className="text-left text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">Action</th>
                <th className="text-left text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">User</th>
                <th className="text-left text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">Target</th>
                <th className="text-center text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => {
                const TypeIcon = typeIcons[log.type] || ScrollText;
                return (
                  <tr key={log.id} className="border-b border-navy-100 hover:bg-navy-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-500 flex items-center justify-center">
                          <TypeIcon size={15} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-navy-900">{log.action}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-navy-600">
                        <User size={14} />
                        {log.user}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-navy-500">{log.target}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColors[log.status] || ""}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-xs text-navy-400">{log.timestamp}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <ScrollText size={40} className="empty-state-icon" />
            <p className="empty-state-title">No log entries found</p>
            <p className="empty-state-text">Try adjusting your search criteria.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
