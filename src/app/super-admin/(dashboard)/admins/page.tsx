"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import AddAdminModal from "@/components/super-admin/AddAdminModal";

const adminsData = [
  { id: 1, name: "Dr. Sarah Mitchell", email: "sarah@gvi.edu", phone: "+1 234 567 901", school: "Green Valley International", role: "Principal", status: "active", lastActive: "2 min ago" },
  { id: 2, name: "John Davis", email: "john@riverside.edu", phone: "+1 234 567 902", school: "Riverside Academy", role: "Vice Principal", status: "active", lastActive: "15 min ago" },
  { id: 3, name: "Emily Roberts", email: "emily@sunrise.edu", phone: "+1 234 567 903", school: "Sunrise School of Excellence", role: "Admin", status: "active", lastActive: "1 hour ago" },
  { id: 4, name: "Michael Chen", email: "michael@stmarys.edu", phone: "+1 234 567 904", school: "St. Mary's Convent", role: "Admin", status: "inactive", lastActive: "3 days ago" },
  { id: 5, name: "Lisa Anderson", email: "lisa@oakridge.edu", phone: "+1 234 567 905", school: "Oakridge International", role: "Director", status: "active", lastActive: "Just now" },
];

export default function AdminsPage() {
  const [search, setSearch] = useState("");
  const [admins, setAdmins] = useState(adminsData);
  const [showModal, setShowModal] = useState(false);

  const handleAddSuccess = (newAdmin: typeof adminsData[0]) => {
    setAdmins((prev) => [newAdmin, ...prev]);
    setShowModal(false);
  };

  const filtered = admins.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.school.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-navy-900">School Admins</h1>
          <p className="text-sm text-navy-500 mt-1">
            Manage administrators across all schools.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-navy-950 text-sm font-semibold hover:bg-amber-400 transition-all shadow-sm"
        >
          <Plus size={16} />
          Add Admin
        </button>
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
            placeholder="Search admins..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-navy-200 text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-navy-200 text-navy-600 text-sm font-medium hover:bg-navy-50 transition-all">
          <Filter size={16} />
          Filters
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-navy-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-200 bg-navy-50/50">
                <th className="text-left text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">Admin</th>
                <th className="text-left text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">Contact</th>
                <th className="text-left text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">School</th>
                <th className="text-left text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">Role</th>
                <th className="text-center text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">Last Active</th>
                <th className="text-center text-xs font-bold text-navy-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((admin) => (
                <tr key={admin.id} className="border-b border-navy-100 hover:bg-navy-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy-900">{admin.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-navy-500">
                        <Mail size={12} />
                        {admin.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-navy-500">
                        <Phone size={12} />
                        {admin.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-navy-500">
                      <Building2 size={12} />
                      {admin.school}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-navy-700">{admin.role}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      admin.status === "active"
                        ? "bg-teal-50 text-teal-600 border border-teal-200"
                        : "bg-navy-100 text-navy-500 border border-navy-200"
                    }`}>
                      {admin.status === "active" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-navy-500">{admin.lastActive}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button className="p-2 rounded-lg hover:bg-navy-100 text-navy-400 hover:text-navy-600 transition-all">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <ShieldCheck size={40} className="empty-state-icon" />
            <p className="empty-state-title">No admins found</p>
            <p className="empty-state-text">Try adjusting your search criteria.</p>
          </div>
        )}
      </motion.div>

      <AddAdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
