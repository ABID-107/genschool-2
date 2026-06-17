"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
} from "lucide-react";

const metrics = [
  { label: "Total Revenue", value: "$0.00", change: "+0%", icon: DollarSign, trend: "up", color: "teal" },
  { label: "Active Users", value: "0", change: "+0%", icon: Users, trend: "up", color: "amber" },
  { label: "Platform Growth", value: "0%", change: "+0%", icon: TrendingUp, trend: "up", color: "navy" },
  { label: "Avg. Response", value: "0ms", change: "0ms", icon: Activity, trend: "neutral", color: "teal" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-navy-900">Analytics</h1>
        <p className="text-sm text-navy-500 mt-1">
          Platform-wide analytics and performance metrics.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl border border-navy-200 p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-navy-500">{metric.label}</p>
                <div className={`w-9 h-9 rounded-lg ${
                  metric.color === "teal" ? "bg-teal-50 text-teal-600" :
                  metric.color === "amber" ? "bg-amber-50 text-amber-600" :
                  "bg-navy-100 text-navy-600"
                } flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-navy-900 tracking-tight">{metric.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {metric.trend === "up" && <TrendingUp size={14} className="text-teal-500" />}
                {metric.trend === "down" && <TrendingDown size={14} className="text-red-500" />}
                <span className={`text-xs font-medium ${
                  metric.trend === "up" ? "text-teal-600" :
                  metric.trend === "down" ? "text-red-600" :
                  "text-navy-400"
                }`}>
                  {metric.change} from last month
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-navy-200 p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-navy-900">Platform Growth</h2>
            <span className="text-xs text-navy-400">Last 12 months</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {[40, 55, 48, 62, 58, 72, 68, 85, 78, 92, 88, 75].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: h }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-teal-500 to-teal-400 max-h-32"
                  style={{ height: `${h * 1.5}px` }}
                />
                <span className="text-[10px] text-navy-400 font-medium">
                  {["J","F","M","A","M","J","J","A","S","O","N","D"][i]}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-navy-400 mt-4">
            Schools registered per month
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl border border-navy-200 p-6"
        >
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Top Performing Schools</h2>
          <div className="space-y-3">
            {[
              { name: "Oakridge International", students: 2100, revenue: "$4,200" },
              { name: "Sunrise School of Excellence", students: 1567, revenue: "$3,134" },
              { name: "Green Valley International", students: 1248, revenue: "$2,496" },
              { name: "Riverside Academy", students: 892, revenue: "$1,784" },
            ].map((school, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-navy-50/50 border border-navy-100">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-navy-100 text-navy-600 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900">{school.name}</p>
                    <p className="text-xs text-navy-400">{school.students.toLocaleString()} students</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-teal-600">{school.revenue}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
