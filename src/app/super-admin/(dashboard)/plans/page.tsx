"use client";

import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, Building2, Users, Database } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "For small schools getting started",
    features: ["Up to 200 students", "5 teachers", "Basic analytics", "Email support", "1 school"],
    color: "brand" as const,
    popular: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "For growing institutions",
    features: ["Up to 1,000 students", "50 teachers", "Advanced analytics", "Priority support", "1 school", "Custom branding"],
    color: "amber" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large institutions & chains",
    features: ["Unlimited students", "Unlimited teachers", "Full analytics suite", "24/7 dedicated support", "Multi-school support", "API access", "Custom integrations"],
    color: "brand" as const,
    popular: false,
  },
];

export default function PlansPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Subscription Plans</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Manage platform subscription tiers and pricing.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative bg-[var(--bg-secondary)] rounded-xl border ${
              plan.popular ? "border-[var(--color-warning)]/20 ring-2 ring-amber-200" : "border-[var(--border-light)]"
            } p-6 hover:shadow-lg transition-all`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--color-warning)] text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                Most Popular
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg ${
                plan.color === "brand" ? "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]" :
                "bg-[var(--color-warning-bg)] text-[var(--color-warning)]"
              } flex items-center justify-center`}>
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">{plan.name}</h3>
                <p className="text-xs text-[var(--text-muted)]">{plan.description}</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-[var(--text-primary)]">{plan.price}</span>
              <span className="text-sm text-[var(--text-muted)]">{plan.period}</span>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[var(--brand-primary)] mt-0.5 shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                plan.popular
                  ? "bg-[var(--color-warning)] text-white hover:bg-amber-400"
                  : "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-mid)]"
              }`}>
                Edit Plan
              </button>
              <button className="px-4 py-2.5 rounded-xl border border-[var(--border-light)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--bg-tertiary)] transition-all">
                Usage
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] p-6"
      >
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Plan Usage Overview</h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">Current distribution of schools across plans.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Starter", count: "1", icon: Building2, bg: "bg-[var(--brand-primary)]/10", text: "text-[var(--brand-primary)]" },
            { label: "Professional", count: "2", icon: Users, bg: "bg-[var(--color-warning-bg)]", text: "text-[var(--color-warning)]" },
            { label: "Enterprise", count: "2", icon: Database, bg: "bg-[var(--brand-primary)]/10", text: "text-[var(--brand-primary)]" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border-light)]">
                <div className={`w-10 h-10 rounded-lg ${item.bg} ${item.text} flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
                  <p className="text-xl font-bold text-[var(--text-primary)]">{item.count} schools</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
