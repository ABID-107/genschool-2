"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldCheck,
  Mail,
  Phone,
  User,
  Building2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";

interface School {
  id: string;
  name: string;
}

interface NewAdmin {
  id: number;
  name: string;
  email: string;
  phone: string;
  school: string;
  role: string;
  status: string;
  lastActive: string;
}

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (admin: NewAdmin) => void;
}

export default function AddAdminModal({
  isOpen,
  onClose,
  onSuccess,
}: AddAdminModalProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    schoolId: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      resetForm();
      fetchSchools();
    }
  }, [isOpen]);

  const fetchSchools = async () => {
    setIsLoadingSchools(true);
    try {
      const res = await fetch("/api/super-admin/schools");
      const data = await res.json();
      setSchools(data.schools || []);
    } catch {
      // Silently fail — school selector will be empty
    } finally {
      setIsLoadingSchools(false);
    }
  };

  const resetForm = () => {
    setError("");
    setSuccess(false);
    setErrors({});
    setTouched(new Set());
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      schoolId: "",
      isActive: true,
    });
  };

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  }, [isSubmitting, onClose]);

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => new Set(prev).add(field));
    validateField(field, typeof value === "string" ? value : String(value));
  };

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case "name":
        if (!value.trim()) newErrors[field] = "Name is required";
        else if (value.trim().length < 2) newErrors[field] = "Name must be at least 2 characters";
        else delete newErrors[field];
        break;
      case "email":
        if (!value.trim()) newErrors[field] = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors[field] = "Invalid email format";
        else delete newErrors[field];
        break;
      case "phone":
        if (value && !/^[\d\s+\-()]{7,20}$/.test(value)) newErrors[field] = "Invalid phone number";
        else delete newErrors[field];
        break;
      case "password":
        if (!value) newErrors[field] = "Password is required";
        else if (value.length < 8) newErrors[field] = "Password must be at least 8 characters";
        else delete newErrors[field];
        break;
      case "confirmPassword":
        if (!value) newErrors[field] = "Please confirm the password";
        else if (value !== formData.password) newErrors[field] = "Passwords do not match";
        else delete newErrors[field];
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[field];
  };

  const validateForm = (): boolean => {
    let valid = true;
    const fieldsToTouch = new Set(touched);

    ["name", "email", "password", "confirmPassword"].forEach((f) => {
      fieldsToTouch.add(f);
      if (!validateField(f, formData[f as keyof typeof formData] as string)) valid = false;
    });

    setTouched(fieldsToTouch);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/super-admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          password: formData.password,
          schoolId: formData.schoolId || undefined,
          isActive: formData.isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create admin");
        setIsSubmitting(false);
        return;
      }

      const newAdmin: NewAdmin = {
        id: Date.now(),
        name: data.admin.name,
        email: data.admin.email,
        phone: data.admin.phone || "",
        school: data.admin.school,
        role: "Admin",
        status: "active",
        lastActive: "Just now",
      };

      setSuccess(true);
      setTimeout(() => {
        onSuccess(newAdmin);
        handleClose();
      }, 1500);
    } catch {
      setError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return touched.has(field) ? errors[field] : undefined;
  };

  const inputClass = (field: string) => {
    const err = getFieldError(field);
    return `w-full h-10 px-3 rounded-xl bg-white border text-sm transition-all focus:outline-none focus:ring-2 ${
      err
        ? "border-red-300 text-red-900 focus:ring-red-500/20 focus:border-red-400"
        : "border-navy-200 text-navy-900 focus:ring-amber-500/20 focus:border-amber-500"
    }`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative bg-white rounded-2xl shadow-xl border border-navy-200 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy-900">Add Admin</h2>
                  <p className="text-xs text-navy-400">Create a new school administrator</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 rounded-lg hover:bg-navy-100 text-navy-400 hover:text-navy-600 transition-all disabled:opacity-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-1">Admin Created!</h3>
                  <p className="text-sm text-navy-500 text-center">
                    {formData.name} has been added as a school administrator.
                  </p>
                </motion.div>
              ) : (
                <>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2.5 p-3 mb-5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700"
                    >
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-400">
                          <User size={16} />
                        </div>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder="e.g. Dr. Sarah Mitchell"
                          className={`${inputClass("name")} pl-10`}
                        />
                      </div>
                      {getFieldError("name") && (
                        <p className="text-xs text-red-500 mt-1">{getFieldError("name")}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-400">
                          <Mail size={16} />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="admin@school.com"
                          className={`${inputClass("email")} pl-10`}
                        />
                      </div>
                      {getFieldError("email") && (
                        <p className="text-xs text-red-500 mt-1">{getFieldError("email")}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        Phone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-400">
                          <Phone size={16} />
                        </div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="+1 234 567 890"
                          className={`${inputClass("phone")} pl-10`}
                        />
                      </div>
                      {getFieldError("phone") && (
                        <p className="text-xs text-red-500 mt-1">{getFieldError("phone")}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        School
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-400">
                          <Building2 size={16} />
                        </div>
                        <select
                          value={formData.schoolId}
                          onChange={(e) => updateField("schoolId", e.target.value)}
                          className={`${inputClass("schoolId")} pl-10 appearance-none`}
                        >
                          <option value="">Select a school (optional)</option>
                          {schools.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-1.5">
                          Password <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-400">
                            <Lock size={16} />
                          </div>
                          <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => updateField("password", e.target.value)}
                            placeholder="Min. 8 characters"
                            className={`${inputClass("password")} pl-10`}
                          />
                        </div>
                        {getFieldError("password") && (
                          <p className="text-xs text-red-500 mt-1">{getFieldError("password")}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-1.5">
                          Confirm Password <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => updateField("confirmPassword", e.target.value)}
                          placeholder="Re-enter password"
                          className={inputClass("confirmPassword")}
                        />
                        {getFieldError("confirmPassword") && (
                          <p className="text-xs text-red-500 mt-1">{getFieldError("confirmPassword")}</p>
                        )}
                      </div>
                    </div>

                    <label className="flex items-center justify-between p-3 rounded-xl border border-navy-100 hover:bg-navy-50/50 transition-colors cursor-pointer">
                      <div>
                        <p className="text-sm font-medium text-navy-900">Active Status</p>
                        <p className="text-xs text-navy-400">Admin can access the platform immediately</p>
                      </div>
                      <div
                        onClick={() => updateField("isActive", !formData.isActive)}
                        className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${
                          formData.isActive ? "bg-teal-500" : "bg-navy-200"
                        } relative`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                          formData.isActive ? "left-5" : "left-1"
                        }`} />
                      </div>
                    </label>
                  </div>
                </>
              )}
            </div>

            {!success && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-navy-200 bg-navy-50/50 shrink-0">
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl text-navy-500 text-sm font-medium hover:bg-navy-100 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-navy-950 text-sm font-semibold hover:bg-amber-400 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      Create Admin
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
