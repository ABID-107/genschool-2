'use client';

import { useState } from 'react';
import { Save, Building2, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  const [schoolName, setSchoolName] = useState("GenSchool International");
  const [email, setEmail] = useState("admin@genschool.com");
  const [phone, setPhone] = useState("+1 234 567 890");
  const [address, setAddress] = useState("123 Education St, Learning City");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Settings</h1>
          <p className="text-sm text-navy-500 mt-1">Manage your school preferences</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary flex items-center gap-2">
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="flex gap-1 mb-6 bg-navy-100/50 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-navy-900 shadow-sm"
                : "text-navy-500 hover:text-navy-700"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">School Name</label>
            <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="input w-full" rows={3} />
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-navy-900">Notification Preferences</h3>
          {["Email Alerts", "SMS Notifications", "Push Notifications", "Weekly Reports"].map((item) => (
            <label key={item} className="flex items-center justify-between py-2">
              <span className="text-sm text-navy-700">{item}</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
          ))}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Current Password</label>
            <input type="password" className="input w-full" placeholder="Enter current password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">New Password</label>
            <input type="password" className="input w-full" placeholder="Enter new password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Confirm New Password</label>
            <input type="password" className="input w-full" placeholder="Confirm new password" />
          </div>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-3">Theme</label>
            <div className="flex gap-3">
              {["Light", "Dark", "System"].map((t) => (
                <button key={t} className="px-4 py-2 rounded-lg border border-navy-200 text-sm font-medium text-navy-700 hover:bg-navy-50">
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-3">Accent Color</label>
            <div className="flex gap-3">
              {["bg-brand-primary", "bg-amber-500", "bg-blue-500", "bg-purple-500", "bg-green-500"].map((c) => (
                <button key={c} className={`w-8 h-8 rounded-full ${c} ring-2 ring-offset-2 ring-transparent hover:ring-navy-300 transition-all`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
