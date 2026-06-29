"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Hash,
  School,
  ShieldCheck,
  CreditCard,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getSchoolById, updateSchool, MockSchool } from "@/store/superAdminDataStore";

export default function SchoolDetailPage() {
  const params = useParams();
  const [school, setSchool] = useState<MockSchool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSchool = useCallback(() => {
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      const found = getSchoolById(params.id as string);
      if (found) {
        setSchool(found);
      } else {
        setError("School not found");
      }
      setIsLoading(false);
    }, 300);
  }, [params.id]);

  useEffect(() => {
    fetchSchool();
  }, [fetchSchool]);

  const handleToggleStatus = () => {
    if (!school) return;
    const newStatus = school.isActive ? "inactive" : "active";
    updateSchool(school.id, { isActive: !school.isActive, status: newStatus as "active" | "inactive" });
    fetchSchool();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">School Not Found</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">{error || "The requested school could not be found."}</p>
        <Link
          href="/super-admin/schools"
          className="glass-button-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium no-underline"
        >
          <ArrowLeft size={16} />
          Back to Schools
        </Link>
      </div>
    );
  }

  const activeSub = school.subscriptions?.[0];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Link
            href="/super-admin/schools"
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all no-underline"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">{school.name}</h1>
              <span className={`badge ${
                school.isActive ? "badge-green" : "badge-rose"
              }`}>
                {school.isActive ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                {school.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{school.slug}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center">
                <Building2 size={18} />
              </div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">School Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">School Name</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{school.name}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">Slug</p>
                <p className="text-sm text-[var(--text-secondary)]">{school.slug}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">School Type</p>
                <p className="text-sm text-[var(--text-secondary)] capitalize">{school.schoolType.toLowerCase()}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">EIIN</p>
                <p className="text-sm text-[var(--text-secondary)]">{school.eiin || "\u2014"}</p>
              </div>
              {school.email && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm text-[var(--text-secondary)]">{school.email}</p>
                </div>
              )}
              {school.phone && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm text-[var(--text-secondary)]">{school.phone}</p>
                </div>
              )}
              {school.address && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">Address</p>
                  <p className="text-sm text-[var(--text-secondary)]">{school.address}</p>
                  {school.city && <p className="text-sm text-[var(--text-secondary)]">{school.city}{school.state ? `, ${school.state}` : ""}{school.country ? `, ${school.country}` : ""}</p>}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">School Administrators</h2>
            </div>
            {school.users.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No administrators assigned.</p>
            ) : (
              <div className="space-y-3">
                {school.users.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-light)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{admin.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{admin.email}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      admin.isActive ? "badge-green" : "badge-rose"
                    }`}>
                      {admin.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center">
                <CreditCard size={18} />
              </div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Subscription</h2>
            </div>
            {activeSub ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-accent)]/30">
                  <p className="text-xs text-[var(--brand-primary)] font-medium uppercase tracking-wider mb-0.5">Current Plan</p>
                  <p className="text-lg font-bold text-[var(--brand-dark)]">{activeSub.plan.name}</p>
                  <p className="text-xs text-[var(--brand-primary)]">${activeSub.plan.price}/{activeSub.plan.period}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Status</p>
                  <span className={`badge ${
                    activeSub.status === "active" ? "badge-green" : "badge-amber"
                  }`}>
                    {activeSub.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Started</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {new Date(activeSub.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">No active subscription.</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] text-[var(--brand-primary)] flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Details</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-0.5">Created</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {new Date(school.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-0.5">Administrators</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{school.users.length}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-0.5">Classes</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{school.classes.length}</p>
              </div>
            </div>
          </motion.div>

          <div className="flex gap-2">
            <button
              onClick={handleToggleStatus}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                school.isActive
                  ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
                  : "badge-green border"
              }`}
            >
              {school.isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
