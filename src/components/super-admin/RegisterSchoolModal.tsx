"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  ShieldCheck,
  CreditCard,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Hash,
  School,
} from "lucide-react";
import { getPlans, registerSchool, MockPlan } from "@/store/superAdminDataStore";

interface FormData {
  schoolName: string;
  schoolSlug: string;
  schoolType: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  eiin: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  confirmPassword: string;
  planId: string;
}

interface FormErrors {
  [key: string]: string;
}

interface RegisterSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterSchoolModal({
  isOpen,
  onClose,
  onSuccess,
}: RegisterSchoolModalProps) {
  const [step, setStep] = useState(1);
  const [plans, setPlans] = useState<MockPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState<FormData>({
    schoolName: "",
    schoolSlug: "",
    schoolType: "SCHOOL",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    eiin: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: "",
    confirmPassword: "",
    planId: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
      resetForm();
    }
  }, [isOpen]);

  const fetchPlans = () => {
    setIsLoading(true);
    setTimeout(() => {
      const allPlans = getPlans();
      setPlans(allPlans);
      if (allPlans.length > 0 && !formData.planId) {
        setFormData((prev) => ({ ...prev, planId: allPlans[0].id }));
      }
      setIsLoading(false);
    }, 300);
  };

  const resetForm = () => {
    setStep(1);
    setError("");
    setSuccess(false);
    setErrors({});
    setTouched(new Set());
    setFormData({
      schoolName: "",
      schoolSlug: "",
      schoolType: "SCHOOL",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      eiin: "",
      adminName: "",
      adminEmail: "",
      adminPhone: "",
      adminPassword: "",
      confirmPassword: "",
      planId: "",
    });
  };

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  }, [isSubmitting, onClose]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);
  };

  const updateField = (field: keyof FormData, value: string) => {
    const newData = { ...formData, [field]: value };

    if (field === "schoolName" && formData.schoolSlug === generateSlug(formData.schoolName)) {
      newData.schoolSlug = generateSlug(value);
    }

    setFormData(newData);
    setTouched((prev) => new Set(prev).add(field));

    validateField(field, newData);
  };

  const validateField = (field: string, data: FormData) => {
    const newErrors = { ...errors };
    const value = data[field as keyof FormData];

    switch (field) {
      case "schoolName":
        if (!value.trim()) {
          newErrors[field] = "School name is required";
        } else if (value.trim().length < 2) {
          newErrors[field] = "School name must be at least 2 characters";
        } else {
          delete newErrors[field];
        }
        break;

      case "schoolSlug":
        if (!value.trim()) {
          newErrors[field] = "School slug is required";
        } else if (!/^[a-z0-9-]+$/.test(value)) {
          newErrors[field] = "Slug can only contain lowercase letters, numbers, and hyphens";
        } else {
          delete newErrors[field];
        }
        break;

      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field] = "Invalid email format";
        } else {
          delete newErrors[field];
        }
        break;

      case "phone":
        if (value && !/^[\d\s+\-()]{7,20}$/.test(value)) {
          newErrors[field] = "Invalid phone number";
        } else {
          delete newErrors[field];
        }
        break;

      case "adminName":
        if (!value.trim()) {
          newErrors[field] = "Admin name is required";
        } else if (value.trim().length < 2) {
          newErrors[field] = "Name must be at least 2 characters";
        } else {
          delete newErrors[field];
        }
        break;

      case "adminEmail":
        if (!value.trim()) {
          newErrors[field] = "Admin email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field] = "Invalid email format";
        } else {
          delete newErrors[field];
        }
        break;

      case "adminPassword":
        if (!value) {
          newErrors[field] = "Password is required";
        } else if (value.length < 8) {
          newErrors[field] = "Password must be at least 8 characters";
        } else {
          delete newErrors[field];
        }
        break;

      case "confirmPassword":
        if (!value) {
          newErrors[field] = "Please confirm the password";
        } else if (value !== data.adminPassword) {
          newErrors[field] = "Passwords do not match";
        } else {
          delete newErrors[field];
        }
        break;

      case "planId":
        if (!value) {
          newErrors[field] = "Please select a subscription plan";
        } else {
          delete newErrors[field];
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[field];
  };

  const validateStep = (stepNum: number): boolean => {
    let valid = true;
    const fieldsToTouch = new Set(touched);

    if (stepNum === 1) {
      const fields = ["schoolName", "schoolSlug"];
      fields.forEach((f) => {
        fieldsToTouch.add(f);
        if (!validateField(f, formData)) valid = false;
      });
    } else if (stepNum === 2) {
      const fields = ["adminName", "adminEmail", "adminPassword", "confirmPassword"];
      fields.forEach((f) => {
        fieldsToTouch.add(f);
        if (!validateField(f, formData)) valid = false;
      });
    } else if (stepNum === 3) {
      if (!formData.planId) {
        valid = false;
        fieldsToTouch.add("planId");
        setErrors((prev) => ({ ...prev, planId: "Please select a subscription plan" }));
      }
    }

    setTouched(fieldsToTouch);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    setTimeout(() => {
      try {
        registerSchool({
          name: formData.schoolName.trim(),
          slug: formData.schoolSlug.trim(),
          schoolType: formData.schoolType,
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          address: formData.address.trim() || undefined,
          city: formData.city.trim() || undefined,
          state: formData.state.trim() || undefined,
          country: formData.country.trim() || undefined,
          eiin: formData.eiin.trim() || undefined,
          planId: formData.planId,
          adminName: formData.adminName.trim(),
          adminEmail: formData.adminEmail.trim(),
          adminPhone: formData.adminPhone.trim() || undefined,
        });

        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1500);
      } catch {
        setError("Failed to register school. Please try again.");
        setIsSubmitting(false);
      }
    }, 1000);
  };

  const getFieldError = (field: string): string | undefined => {
    return touched.has(field) ? errors[field] : undefined;
  };

  const inputClass = (field: string) => {
    const err = getFieldError(field);
    return `glass-input w-full h-10 px-3 text-sm transition-all ${
      err
        ? "border-red-300 text-red-900 focus:ring-red-500/20 focus:border-red-400"
        : ""
    } ${field.includes("phone") || field.includes("adminPhone") || field.includes("plan") ? "" : ""}`;
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
            className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-light)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center">
                  <Building2 size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">Register School</h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Step {step} of 3
                    {step === 1 && " \u2014 School Information"}
                    {step === 2 && " \u2014 Admin Account"}
                    {step === 3 && " \u2014 Subscription Plan"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all disabled:opacity-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-tertiary)]/50 border-b border-[var(--border-light)]">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      s === step
                        ? "bg-[var(--brand-primary)] text-white"
                        : s < step
                          ? "bg-[var(--brand-accent)]/30 text-[var(--brand-primary)]"
                          : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                    }`}
                  >
                    {s < step ? <CheckCircle2 size={14} /> : s}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-[11px] font-semibold ${
                      s === step ? "text-[var(--brand-primary)]" : "text-[var(--text-muted)]"
                    }`}>
                      {s === 1 ? "School" : s === 2 ? "Admin" : "Plan"}
                    </p>
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-0.5 mx-1 ${
                      s < step ? "bg-[var(--brand-accent)]" : "bg-[var(--border-light)]"
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">School Registered!</h3>
                  <p className="text-sm text-[var(--text-muted)] text-center">
                    {formData.schoolName} has been registered successfully.
                  </p>
                </motion.div>
              ) : (
                <>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2.5 p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700"
                    >
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 size={24} className="animate-spin text-[var(--text-muted)]" />
                    </div>
                  ) : (
                    <>
                      {step === 1 && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                School Name <span className="text-rose-400">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                                  <Building2 size={16} />
                                </div>
                                <input
                                  type="text"
                                  value={formData.schoolName}
                                  onChange={(e) => updateField("schoolName", e.target.value)}
                                  placeholder="e.g. Green Valley International"
                                  className={`${inputClass("schoolName")} pl-10`}
                                />
                              </div>
                              {getFieldError("schoolName") && (
                                <p className="text-xs text-rose-500 mt-1">{getFieldError("schoolName")}</p>
                              )}
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                School Slug <span className="text-rose-400">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                                  <Hash size={16} />
                                </div>
                                <input
                                  type="text"
                                  value={formData.schoolSlug}
                                  onChange={(e) => updateField("schoolSlug", e.target.value)}
                                  placeholder="e.g. green-valley-international"
                                  className={`${inputClass("schoolSlug")} pl-10`}
                                />
                              </div>
                              {getFieldError("schoolSlug") && (
                                <p className="text-xs text-rose-500 mt-1">{getFieldError("schoolSlug")}</p>
                              )}
                              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                                Used in URLs: /{formData.schoolSlug || "school-slug"}
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                School Type
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                                  <School size={16} />
                                </div>
                                <select
                                  value={formData.schoolType}
                                  onChange={(e) => updateField("schoolType", e.target.value)}
                                  className={`${inputClass("schoolType")} pl-10 appearance-none`}
                                >
                                  <option value="SCHOOL">School</option>
                                  <option value="COLLEGE">College</option>
                                  <option value="UNIVERSITY">University</option>
                                  <option value="COACHING">Coaching Center</option>
                                  <option value="MADRASAH">Madrasah</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                EIIN / Registration No.
                              </label>
                              <input
                                type="text"
                                value={formData.eiin}
                                onChange={(e) => updateField("eiin", e.target.value)}
                                placeholder="Optional"
                                className={inputClass("eiin")}
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                Email
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                                  <Mail size={16} />
                                </div>
                                <input
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => updateField("email", e.target.value)}
                                  placeholder="school@example.com"
                                  className={`${inputClass("email")} pl-10`}
                                />
                              </div>
                              {getFieldError("email") && (
                                <p className="text-xs text-rose-500 mt-1">{getFieldError("email")}</p>
                              )}
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                Phone
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
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
                                <p className="text-xs text-rose-500 mt-1">{getFieldError("phone")}</p>
                              )}
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                Address
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 flex items-start pointer-events-none text-[var(--text-muted)]">
                                  <MapPin size={16} />
                                </div>
                                <textarea
                                  value={formData.address}
                                  onChange={(e) => updateField("address", e.target.value)}
                                  placeholder="123 Education Lane"
                                  rows={2}
                                  className={`${inputClass("address")} pl-10 pt-2.5 resize-none h-auto`}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                City
                              </label>
                              <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => updateField("city", e.target.value)}
                                placeholder="New York"
                                className={inputClass("city")}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                  State
                                </label>
                                <input
                                  type="text"
                                  value={formData.state}
                                  onChange={(e) => updateField("state", e.target.value)}
                                  placeholder="NY"
                                  className={inputClass("state")}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                  Country
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                                    <Globe size={16} />
                                  </div>
                                  <input
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) => updateField("country", e.target.value)}
                                    placeholder="USA"
                                    className={`${inputClass("country")} pl-10`}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-4"
                        >
                          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-4">
                            <div className="flex items-start gap-3">
                              <ShieldCheck size={18} className="text-amber-600 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-sm font-semibold text-amber-800">School Admin Account</p>
                                <p className="text-xs text-amber-700 mt-0.5">
                                  This account will be created as the primary administrator for {formData.schoolName}.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                Full Name <span className="text-rose-400">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                                  <User size={16} />
                                </div>
                                <input
                                  type="text"
                                  value={formData.adminName}
                                  onChange={(e) => updateField("adminName", e.target.value)}
                                  placeholder="e.g. Dr. Sarah Mitchell"
                                  className={`${inputClass("adminName")} pl-10`}
                                />
                              </div>
                              {getFieldError("adminName") && (
                                <p className="text-xs text-rose-500 mt-1">{getFieldError("adminName")}</p>
                              )}
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                Email <span className="text-rose-400">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                                  <Mail size={16} />
                                </div>
                                <input
                                  type="email"
                                  value={formData.adminEmail}
                                  onChange={(e) => updateField("adminEmail", e.target.value)}
                                  placeholder="admin@school.com"
                                  className={`${inputClass("adminEmail")} pl-10`}
                                />
                              </div>
                              {getFieldError("adminEmail") && (
                                <p className="text-xs text-rose-500 mt-1">{getFieldError("adminEmail")}</p>
                              )}
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                Phone
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                                  <Phone size={16} />
                                </div>
                                <input
                                  type="tel"
                                  value={formData.adminPhone}
                                  onChange={(e) => updateField("adminPhone", e.target.value)}
                                  placeholder="+1 234 567 890"
                                  className={`${inputClass("adminPhone")} pl-10`}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                Password <span className="text-rose-400">*</span>
                              </label>
                              <input
                                type="password"
                                value={formData.adminPassword}
                                onChange={(e) => updateField("adminPassword", e.target.value)}
                                placeholder="Min. 8 characters"
                                className={inputClass("adminPassword")}
                              />
                              {getFieldError("adminPassword") && (
                                <p className="text-xs text-rose-500 mt-1">{getFieldError("adminPassword")}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                Confirm Password <span className="text-rose-400">*</span>
                              </label>
                              <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => updateField("confirmPassword", e.target.value)}
                                placeholder="Re-enter password"
                                className={inputClass("confirmPassword")}
                              />
                              {getFieldError("confirmPassword") && (
                                <p className="text-xs text-rose-500 mt-1">{getFieldError("confirmPassword")}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-4"
                        >
                          <div className="p-4 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-accent)]/30 mb-2">
                            <div className="flex items-start gap-3">
                              <CreditCard size={18} className="text-[var(--brand-primary)] mt-0.5 shrink-0" />
                              <div>
                                <p className="text-sm font-semibold text-[var(--brand-dark)]">Choose a Subscription Plan</p>
                                <p className="text-xs text-[var(--brand-primary)] mt-0.5">
                                  Select the plan that best fits {formData.schoolName || "your school"}&apos;s needs.
                                </p>
                              </div>
                            </div>
                          </div>

                          {getFieldError("planId") && (
                            <p className="text-xs text-rose-500">{getFieldError("planId")}</p>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {plans.map((plan) => {
                              const isSelected = formData.planId === plan.id;
                              return (
                                <button
                                  key={plan.id}
                                  type="button"
                                  onClick={() => {
                                    updateField("planId", plan.id);
                                    setTouched((prev) => new Set(prev).add("planId"));
                                    setErrors((prev) => {
                                      const next = { ...prev };
                                      delete next.planId;
                                      return next;
                                    });
                                  }}
                                  className={`relative text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                    isSelected
                                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 shadow-sm"
                                      : "border-[var(--border-light)] bg-[var(--bg-secondary)] hover:border-[var(--brand-accent)]"
                                  }`}
                                >
                                  {plan.isPopular && (
                                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-500 text-navy-950 text-[10px] font-bold rounded-full uppercase tracking-wider whitespace-nowrap">
                                      Popular
                                    </div>
                                  )}
                                  <div className="mb-3">
                                    <h4 className="text-sm font-bold text-[var(--text-primary)]">{plan.name}</h4>
                                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{plan.description}</p>
                                  </div>
                                  <div className="flex items-baseline gap-0.5 mb-3">
                                    <span className="text-xl font-bold text-[var(--text-primary)]">${plan.price}</span>
                                    <span className="text-[11px] text-[var(--text-muted)]">/{plan.period}</span>
                                  </div>
                                  <div className="space-y-1.5">
                                    {plan.features.slice(0, 4).map((feature) => (
                                      <div key={feature} className="flex items-start gap-1.5">
                                        <CheckCircle2 size={11} className="text-[var(--brand-primary)] mt-0.5 shrink-0" />
                                        <span className="text-[11px] text-[var(--text-secondary)]">{feature}</span>
                                      </div>
                                    ))}
                                    {plan.features.length > 4 && (
                                      <p className="text-[10px] text-[var(--text-muted)] pt-1">
                                        +{plan.features.length - 4} more features
                                      </p>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {!success && !isLoading && (
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[var(--border-light)] bg-[var(--bg-tertiary)]/50 shrink-0">
                <div>
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      disabled={isSubmitting}
                      className="px-4 py-2.5 rounded-xl border border-[var(--border-light)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--bg-tertiary)] transition-all disabled:opacity-50"
                    >
                      Back
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 rounded-xl text-[var(--text-muted)] text-sm font-medium hover:bg-[var(--bg-tertiary)] transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  {step < 3 ? (
                    <button
                      onClick={() => {
                        if (validateStep(step)) {
                          setStep(step + 1);
                        }
                      }}
                      className="glass-button-primary px-5 py-2.5 rounded-xl text-sm font-semibold"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="glass-button-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          <Building2 size={16} />
                          Register School
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
