"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Hash,
  School,
  User,
  ShieldCheck,
  CreditCard,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Edit3,
} from "lucide-react";

interface SchoolDetail {
  id: string;
  name: string;
  slug: string;
  schoolType: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  eiin: string | null;
  domain: string | null;
  logo: string | null;
  isActive: boolean;
  createdAt: string;
  users: { id: string; name: string; email: string; phone: string | null; isActive: boolean }[];
  subscriptions: {
    id: string;
    status: string;
    startDate: string;
    endDate: string | null;
    plan: { id: string; name: string; price: number; period: string };
  }[];
  classes: { id: string; name: string; numericId: number }[];
}

export default function SchoolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [school, setSchool] = useState<SchoolDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSchool = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/super-admin/schools/${params.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "School not found");
      setSchool(data.school);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load school");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchSchool();
  }, [fetchSchool]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-navy-400" />
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-400 flex items-center justify-center mb-4">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-lg font-bold text-navy-900 mb-1">School Not Found</h2>
        <p className="text-sm text-navy-500 mb-6">{error || "The requested school could not be found."}</p>
        <Link
          href="/super-admin/schools"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 transition-all no-underline"
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
            className="p-2 rounded-lg hover:bg-navy-100 text-navy-400 hover:text-navy-600 transition-all no-underline"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-navy-900">{school.name}</h1>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                school.isActive
                  ? "bg-teal-50 text-teal-600 border border-teal-200"
                  : "bg-navy-100 text-navy-500 border border-navy-200"
              }`}>
                {school.isActive ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                {school.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-navy-500 mt-0.5">{school.slug}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* School Info */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl border border-navy-200 p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Building2 size={18} />
              </div>
              <h2 className="text-base font-semibold text-navy-900">School Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-navy-400 font-medium uppercase tracking-wider mb-1">School Name</p>
                <p className="text-sm font-semibold text-navy-900">{school.name}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400 font-medium uppercase tracking-wider mb-1">Slug</p>
                <p className="text-sm text-navy-700">{school.slug}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400 font-medium uppercase tracking-wider mb-1">School Type</p>
                <p className="text-sm text-navy-700 capitalize">{school.schoolType.toLowerCase()}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400 font-medium uppercase tracking-wider mb-1">EIIN</p>
                <p className="text-sm text-navy-700">{school.eiin || "—"}</p>
              </div>
              {school.email && (
                <div>
                  <p className="text-xs text-navy-400 font-medium uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm text-navy-700">{school.email}</p>
                </div>
              )}
              {school.phone && (
                <div>
                  <p className="text-xs text-navy-400 font-medium uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm text-navy-700">{school.phone}</p>
                </div>
              )}
              {school.address && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-navy-400 font-medium uppercase tracking-wider mb-1">Address</p>
                  <p className="text-sm text-navy-700">{school.address}</p>
                  {school.city && <p className="text-sm text-navy-700">{school.city}{school.state ? `, ${school.state}` : ""}{school.country ? `, ${school.country}` : ""}</p>}
                </div>
              )}
            </div>
          </motion.div>

          {/* Admin Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-navy-200 p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <h2 className="text-base font-semibold text-navy-900">School Administrators</h2>
            </div>
            {school.users.length === 0 ? (
              <p className="text-sm text-navy-400">No administrators assigned.</p>
            ) : (
              <div className="space-y-3">
                {school.users.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-navy-50/50 border border-navy-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy-900">{admin.name}</p>
                        <p className="text-xs text-navy-400">{admin.email}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      admin.isActive
                        ? "bg-teal-50 text-teal-600 border border-teal-200"
                        : "bg-navy-100 text-navy-500 border border-navy-200"
                    }`}>
                      {admin.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl border border-navy-200 p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <CreditCard size={18} />
              </div>
              <h2 className="text-base font-semibold text-navy-900">Subscription</h2>
            </div>
            {activeSub ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
                  <p className="text-xs text-teal-600 font-medium uppercase tracking-wider mb-0.5">Current Plan</p>
                  <p className="text-lg font-bold text-teal-800">{activeSub.plan.name}</p>
                  <p className="text-xs text-teal-600">${activeSub.plan.price}/{activeSub.plan.period}</p>
                </div>
                <div>
                  <p className="text-xs text-navy-400 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    activeSub.status === "active"
                      ? "bg-teal-50 text-teal-600 border border-teal-200"
                      : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}>
                    {activeSub.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-navy-400 mb-1">Started</p>
                  <p className="text-sm text-navy-700">
                    {new Date(activeSub.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-navy-400">No active subscription.</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-navy-200 p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-navy-100 text-navy-600 flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <h2 className="text-base font-semibold text-navy-900">Details</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-navy-400 mb-0.5">Created</p>
                <p className="text-sm text-navy-700">
                  {new Date(school.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-navy-400 mb-0.5">Total Administrators</p>
                <p className="text-sm font-semibold text-navy-900">{school.users.length}</p>
              </div>
              <div>
                <p className="text-xs text-navy-400 mb-0.5">Total Classes</p>
                <p className="text-sm font-semibold text-navy-900">{school.classes.length}</p>
              </div>
            </div>
          </motion.div>

          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`/api/super-admin/schools/${school.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isActive: !school.isActive }),
                  });
                  if (res.ok) {
                    fetchSchool();
                  }
                } catch {
                  alert("Failed to update school status");
                }
              }}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                school.isActive
                  ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                  : "bg-teal-50 text-teal-600 border border-teal-200 hover:bg-teal-100"
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
