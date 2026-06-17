"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Eye,
  Trash2,
} from "lucide-react";
import RegisterSchoolModal from "@/components/super-admin/RegisterSchoolModal";

interface School {
  id: string;
  name: string;
  slug: string;
  schoolType: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: "active" | "inactive";
  plan: string;
  admin: { name: string; email: string } | null;
  students: number;
  teachers: number;
  joined: string;
}

export default function SchoolsPage() {
  const [search, setSearch] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const fetchSchools = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/super-admin/schools");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setSchools(data.schools || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load schools");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const handleRegisterSuccess = () => {
    setShowModal(false);
    fetchSchools();
  };

  const handleToggleStatus = async (school: School) => {
    if (!confirm(`Are you sure you want to ${school.status === "active" ? "deactivate" : "activate"} ${school.name}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/super-admin/schools/${school.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: school.status !== "active" }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      fetchSchools();
      setActionMenu(null);
    } catch {
      alert("Failed to update school status");
    }
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
          <h1 className="text-2xl font-bold text-navy-900">Schools</h1>
          <p className="text-sm text-navy-500 mt-1">
            Manage all registered educational institutions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSchools}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border border-navy-200 text-navy-600 text-sm font-medium hover:bg-navy-50 transition-all disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-all shadow-sm"
          >
            <Plus size={16} />
            Register School
          </button>
        </div>
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
            placeholder="Search schools..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-navy-200 text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "active", "inactive"].map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === opt
                  ? "bg-navy-900 text-white"
                  : "bg-white border border-navy-200 text-navy-500 hover:bg-navy-50"
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
        className="bg-white rounded-xl border border-navy-200 overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-navy-400" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-400 flex items-center justify-center mb-3">
              <XCircle size={24} />
            </div>
            <p className="text-sm font-medium text-navy-900 mb-1">Failed to load schools</p>
            <p className="text-xs text-navy-500 mb-4">{error}</p>
            <button
              onClick={fetchSchools}
              className="px-4 py-2 rounded-xl bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-200 bg-navy-50/50">
                  <th className="text-left text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">School</th>
                  <th className="text-left text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">Contact</th>
                  <th className="text-left text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">Location</th>
                  <th className="text-center text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-center text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">Plan</th>
                  <th className="text-center text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((school) => (
                  <tr key={school.id} className="border-b border-navy-100 hover:bg-navy-50/50 transition-colors relative">
                    <td className="px-5 py-4">
                      <Link
                        href={`/super-admin/schools/${school.id}`}
                        className="flex items-center gap-3 no-underline"
                      >
                        <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                          <Building2 size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-navy-900 truncate hover:text-teal-600 transition-colors">
                            {school.name}
                          </p>
                          <p className="text-xs text-navy-400 truncate">{school.slug}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        {school.email && (
                          <div className="flex items-center gap-1.5 text-xs text-navy-500">
                            <Mail size={12} />
                            <span className="truncate max-w-[180px]">{school.email}</span>
                          </div>
                        )}
                        {school.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-navy-500">
                            <Phone size={12} />
                            {school.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {school.city && (
                        <div className="flex items-center gap-1.5 text-xs text-navy-500">
                          <MapPin size={12} />
                          {school.city}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        school.status === "active"
                          ? "bg-teal-50 text-teal-600 border border-teal-200"
                          : "bg-navy-100 text-navy-500 border border-navy-200"
                      }`}>
                        {school.status === "active" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {school.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-xs font-medium text-navy-700">{school.plan}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionMenu(actionMenu === school.id ? null : school.id);
                          }}
                          className="p-2 rounded-lg hover:bg-navy-100 text-navy-400 hover:text-navy-600 transition-all"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        {actionMenu === school.id && (
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-navy-200 shadow-lg z-20 py-1">
                            <Link
                              href={`/super-admin/schools/${school.id}`}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-navy-700 hover:bg-navy-50 transition-colors no-underline"
                              onClick={() => setActionMenu(null)}
                            >
                              <Eye size={14} />
                              View Details
                            </Link>
                            <button
                              onClick={() => handleToggleStatus(school)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-navy-700 hover:bg-navy-50 transition-colors text-left"
                            >
                              {school.status === "active" ? (
                                <Trash2 size={14} className="text-red-400" />
                              ) : (
                                <CheckCircle2 size={14} className="text-teal-500" />
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
        )}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <Building2 size={40} className="empty-state-icon" />
            <p className="empty-state-title">
              {search || statusFilter !== "all" ? "No schools found" : "No schools registered yet"}
            </p>
            <p className="empty-state-text">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Click the 'Register School' button to add your first institution."}
            </p>
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
