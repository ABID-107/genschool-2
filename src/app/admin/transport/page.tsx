'use client';

import { Bus, Map, Users, Settings } from 'lucide-react';

export default function TransportManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Transport Management</h1>
        <p className="text-sm text-slate-500 mt-1">Manage routes, vehicles, drivers, and student assignments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Active Routes', value: '12', icon: Map, color: 'blue' },
          { title: 'Total Vehicles', value: '15', icon: Bus, color: 'emerald' },
          { title: 'Assigned Students', value: '450', icon: Users, color: 'indigo' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-blue-400 transition-colors">
            <div className={`w-12 h-12 rounded-xl bg-${card.color}-50 text-${card.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <Settings size={48} className="text-slate-300 mb-4 animate-spin-slow" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Transport Tracking & Revenue Module</h3>
        <p className="text-slate-500 max-w-md mx-auto text-sm">This module allows linking GPS tracking data and connects directly with the Finance Module for transport fee collection.</p>
        <button className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-md transition-colors">
          Configure Routes
        </button>
      </div>
    </div>
  );
}
