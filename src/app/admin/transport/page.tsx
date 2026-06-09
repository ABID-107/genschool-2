'use client';

import { Bus, Map, Users, Settings } from 'lucide-react';

export default function TransportManagementPage() {
  const cardColors: Record<string, string> = {
    blue: 'bg-[var(--bg-tertiary)] text-brand-primary',
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-[var(--bg-tertiary)] text-brand-primary',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Transport Management</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Manage routes, vehicles, drivers, and student assignments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Active Routes', value: '12', icon: Map, color: 'blue' },
          { title: 'Total Vehicles', value: '15', icon: Bus, color: 'emerald' },
          { title: 'Assigned Students', value: '450', icon: Users, color: 'indigo' },
        ].map((card, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] p-6 rounded-2xl border-[var(--border-light)] shadow-sm flex flex-col justify-between group cursor-pointer hover:border-brand-primary transition-colors glass-card glow-on-hover">
            <div className={`w-12 h-12 rounded-xl ${cardColors[card.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-[var(--text-muted)] text-sm font-medium">{card.title}</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] shadow-sm p-12 flex flex-col items-center justify-center text-center glass-panel">
        <Settings size={48} className="text-[var(--border-light)] mb-4 animate-spin-slow" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Transport Tracking & Revenue Module</h3>
        <p className="text-[var(--text-muted)] max-w-md mx-auto text-sm">This module allows linking GPS tracking data and connects directly with the Finance Module for transport fee collection.</p>
        <button className="mt-6 px-6 py-2.5 bg-brand-primary hover:bg-brand-mid text-white text-sm font-medium rounded-xl shadow-md transition-colors">
          Configure Routes
        </button>
      </div>
    </div>
  );
}
