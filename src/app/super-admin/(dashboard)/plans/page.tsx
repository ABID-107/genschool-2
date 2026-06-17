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
    color: "teal",
    popular: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "For growing institutions",
    features: ["Up to 1,000 students", "50 teachers", "Advanced analytics", "Priority support", "1 school", "Custom branding"],
    color: "amber",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large institutions & chains",
    features: ["Unlimited students", "Unlimited teachers", "Full analytics suite", "24/7 dedicated support", "Multi-school support", "API access", "Custom integrations"],
    color: "navy",
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
        <h1 className="text-2xl font-bold text-navy-900">Subscription Plans</h1>
        <p className="text-sm text-navy-500 mt-1">
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
            className={`relative bg-white rounded-xl border ${
              plan.popular ? "border-amber-300 ring-2 ring-amber-200" : "border-navy-200"
            } p-6 hover:shadow-lg transition-all`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-navy-950 text-[11px] font-bold rounded-full uppercase tracking-wider">
                Most Popular
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg ${
                plan.color === "teal" ? "bg-teal-50 text-teal-600" :
                plan.color === "amber" ? "bg-amber-50 text-amber-600" :
                "bg-navy-100 text-navy-600"
              } flex items-center justify-center`}>
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-900">{plan.name}</h3>
                <p className="text-xs text-navy-400">{plan.description}</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-navy-900">{plan.price}</span>
              <span className="text-sm text-navy-400">{plan.period}</span>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-teal-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-navy-600">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                plan.popular
                  ? "bg-amber-500 text-navy-950 hover:bg-amber-400"
                  : "bg-navy-900 text-white hover:bg-navy-800"
              }`}>
                Edit Plan
              </button>
              <button className="px-4 py-2.5 rounded-xl border border-navy-200 text-navy-600 text-sm font-medium hover:bg-navy-50 transition-all">
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
        className="bg-white rounded-xl border border-navy-200 p-6"
      >
        <h2 className="text-lg font-semibold text-navy-900 mb-1">Plan Usage Overview</h2>
        <p className="text-sm text-navy-500 mb-5">Current distribution of schools across plans.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Starter", count: "12", icon: Building2, color: "bg-teal-500", text: "text-teal-600", bg: "bg-teal-50" },
            { label: "Professional", count: "24", icon: Users, color: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50" },
            { label: "Enterprise", count: "8", icon: Database, color: "bg-navy-600", text: "text-navy-600", bg: "bg-navy-100" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl border border-navy-100">
                <div className={`w-10 h-10 rounded-lg ${item.bg} ${item.text} flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm text-navy-500">{item.label}</p>
                  <p className="text-xl font-bold text-navy-900">{item.count} schools</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
