"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Eye,
} from "lucide-react";
import RegisterSchoolModal from "@/components/super-admin/RegisterSchoolModal";
import { getSchools, updateSchool, MockSchool } from "@/store/superAdminDataStore";

export default function SchoolsPage() {
  const [search, setSearch] = useState("");
  const [schools, setSchools] = useState<MockSchool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const fetchSchools = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSchools(getSchools());
      setIsLoading(false);
    }, 400);
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const handleRegisterSuccess = () => {
    setShowModal(false);
    fetchSchools();
  };

  const handleToggleStatus = (school: MockSchool) => {
    const newStatus = school.status === "active" ? "inactive" : "active";
    if (!confirm(`Are you sure you want to ${newStatus === "active" ? "activate" : "deactivate"} ${school.name}?`)) return;

    updateSchool(school.id, {
      isActive: newStatus === "active",
      status: newStatus,
    });
    setActionMenu(null);
    fetchSchools();
  };

  const filtered = schools.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Schools</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Manage all registered educational institutions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSchools}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[var(--border-light)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--bg-tertiary)] transition-all disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="glass-button-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          >
            <Plus size={16} />
            Register School
          </button>
        </div>
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
            placeholder="Search schools..."
            className="glass-input w-full h-10 pl-10 pr-4 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "active", "inactive"].map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === opt
                  ? "bg-[var(--brand-primary)] text-white"
                  : "bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]"
              }`}
            >
              {opt === "all" ? "All" : opt === "active" ? "Active" : "Inactive"}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[var(--text-muted)]" />
          </div>
        ) : (
          <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-light)] bg-[var(--bg-tertiary)]/50">
                    <th className="text-left text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">School</th>
                    <th className="text-left text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">Contact</th>
                    <th className="text-left text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">Location</th>
                    <th className="text-center text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-center text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">Plan</th>
                    <th className="text-center text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((school) => (
                    <tr key={school.id} className="border-b border-[var(--border-light)] hover:bg-[var(--bg-tertiary)]/30 transition-colors relative">
                      <td className="px-5 py-4">
                        <Link
                          href={`/super-admin/schools/${school.id}`}
                          className="flex items-center gap-3 no-underline"
                        >
                          <div className="w-9 h-9 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
                            <Building2 size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[var(--text-primary)] truncate hover:text-[var(--brand-primary)] transition-colors">
                              {school.name}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] truncate">{school.slug}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {school.email && (
                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                              <Mail size={12} />
                              <span className="truncate max-w-[180px]">{school.email}</span>
                            </div>
                          )}
                          {school.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                              <Phone size={12} />
                              {school.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {school.city && (
                          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                            <MapPin size={12} />
                            {school.city}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          school.status === "active"
                            ? "badge-green"
                            : "badge-rose"
                        }`}>
                          {school.status === "active" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {school.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-xs font-medium text-[var(--text-primary)]">{school.plan}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenu(actionMenu === school.id ? null : school.id);
                            }}
                            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {actionMenu === school.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] shadow-lg z-20 py-1">
                              <Link
                                href={`/super-admin/schools/${school.id}`}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors no-underline"
                                onClick={() => setActionMenu(null)}
                              >
                                <Eye size={14} />
                                View Details
                              </Link>
                              <button
                                onClick={() => handleToggleStatus(school)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left"
                              >
                                {school.status === "active" ? (
                                  <XCircle size={14} className="text-[var(--color-error)]" />
                                ) : (
                                  <CheckCircle2 size={14} className="text-[var(--color-success)]" />
                                )}
                                {school.status === "active" ? "Deactivate" : "Activate"}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Building2 size={40} className="text-[var(--text-muted)] opacity-40 mb-3" />
                <p className="font-semibold text-[var(--text-primary)]">
                  {search || statusFilter !== "all" ? "No schools found" : "No schools registered yet"}
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  {search || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Click the 'Register School' button to add your first institution."}
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {actionMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActionMenu(null)}
        />
      )}

      <RegisterSchoolModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
}
