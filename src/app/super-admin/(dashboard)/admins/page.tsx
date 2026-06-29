"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import AddAdminModal from "@/components/super-admin/AddAdminModal";
import { getStoredAdmins } from "@/store/superAdminDataStore";
import type { MockAdmin } from "@/store/superAdminDataStore";

export default function AdminsPage() {
  const [search, setSearch] = useState("");
  const [admins, setAdmins] = useState<MockAdmin[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setAdmins(getStoredAdmins());
  }, []);

  const handleAddSuccess = (newAdmin: MockAdmin) => {
    setAdmins((prev) => [newAdmin, ...prev]);
    setShowModal(false);
  };

  const filtered = admins.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.school.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">School Admins</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Manage administrators across all schools.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="glass-button-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
        >
          <Plus size={16} />
          Add Admin
        </button>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search admins..."
            className="glass-input w-full h-10 pl-10 pr-4 text-sm"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-light)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--bg-tertiary)] transition-all">
          <Filter size={16} />
          Filters
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-light)] bg-[var(--bg-tertiary)]/50">
                <th className="text-left text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">Admin</th>
                <th className="text-left text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">Contact</th>
                <th className="text-left text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">School</th>
                <th className="text-left text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">Role</th>
                <th className="text-center text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">Last Active</th>
                <th className="text-center text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((admin) => (
                <tr key={admin.id} className="border-b border-[var(--border-light)] hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{admin.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                        <Mail size={12} />
                        {admin.email}
                      </div>
                      {admin.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                          <Phone size={12} />
                          {admin.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                      <Building2 size={12} />
                      {admin.school}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-[var(--text-secondary)]">{admin.role}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`badge ${
                      admin.status === "active" ? "badge-green" : "badge-rose"
                    }`}>
                      {admin.status === "active" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-[var(--text-muted)]">{admin.lastActive}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShieldCheck size={40} className="text-[var(--text-muted)] opacity-40 mb-3" />
            <p className="font-semibold text-[var(--text-primary)]">No admins found</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Try adjusting your search criteria.</p>
          </div>
        )}
      </motion.div>

      <AddAdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
