"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Bell,
  Shield,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    platformName: "GenSchool",
    supportEmail: "support@genschool.com",
    defaultLanguage: "en",
    timezone: "UTC",
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    twoFactorAuth: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Platform Settings</h1>
          <p className="text-sm text-navy-500 mt-1">
            Configure global platform preferences and policies.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-all shadow-sm"
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-navy-200 divide-y divide-navy-100"
      >
        {/* General */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-navy-100 text-navy-600 flex items-center justify-center">
              <Globe size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-navy-900">General</h2>
              <p className="text-xs text-navy-400">Basic platform information</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Platform Name</label>
              <input
                type="text"
                value={form.platformName}
                onChange={(e) => setForm({ ...form, platformName: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Support Email</label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Default Language</label>
              <select
                value={form.defaultLanguage}
                onChange={(e) => setForm({ ...form, defaultLanguage: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="en">English</option>
                <option value="bn">Bengali</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Timezone</label>
              <select
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="UTC">UTC</option>
                <option value="EST">EST (UTC-5)</option>
                <option value="BST">BST (UTC+6)</option>
                <option value="GST">GST (UTC+4)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-navy-900">Security</h2>
              <p className="text-xs text-navy-400">Authentication and access control</p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-xl border border-navy-100 hover:bg-navy-50/50 transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-medium text-navy-900">Two-Factor Authentication</p>
                <p className="text-xs text-navy-400">Require 2FA for all admin accounts</p>
              </div>
              <div
                onClick={() => setForm({ ...form, twoFactorAuth: !form.twoFactorAuth })}
                className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${
                  form.twoFactorAuth ? "bg-teal-500" : "bg-navy-200"
                } relative`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                  form.twoFactorAuth ? "left-5" : "left-1"
                }`} />
              </div>
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl border border-navy-100 hover:bg-navy-50/50 transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-medium text-navy-900">Allow Registration</p>
                <p className="text-xs text-navy-400">Let schools register on the platform</p>
              </div>
              <div
                onClick={() => setForm({ ...form, allowRegistration: !form.allowRegistration })}
                className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${
                  form.allowRegistration ? "bg-teal-500" : "bg-navy-200"
                } relative`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                  form.allowRegistration ? "left-5" : "left-1"
                }`} />
              </div>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-navy-900">Notifications</h2>
              <p className="text-xs text-navy-400">Email and system notification preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-xl border border-navy-100 hover:bg-navy-50/50 transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-medium text-navy-900">Email Notifications</p>
                <p className="text-xs text-navy-400">Receive email alerts for important events</p>
              </div>
              <div
                onClick={() => setForm({ ...form, emailNotifications: !form.emailNotifications })}
                className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${
                  form.emailNotifications ? "bg-teal-500" : "bg-navy-200"
                } relative`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                  form.emailNotifications ? "left-5" : "left-1"
                }`} />
              </div>
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl border border-navy-100 hover:bg-navy-50/50 transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-medium text-navy-900">Maintenance Mode</p>
                <p className="text-xs text-navy-400">Disable platform access for maintenance</p>
              </div>
              <div
                onClick={() => setForm({ ...form, maintenanceMode: !form.maintenanceMode })}
                className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${
                  form.maintenanceMode ? "bg-red-500" : "bg-navy-200"
                } relative`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                  form.maintenanceMode ? "left-5" : "left-1"
                }`} />
              </div>
            </label>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
