'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bus, Map, Users, Plus, Search, Download, X, Save, Loader2,
  Pencil, Trash2, Eye, CheckCircle2, Clock, Ban, MapPin,
  Route, Gauge, DollarSign, TrendingUp, Calendar, UserCheck,
  Phone, CreditCard, Car, Wrench,
} from 'lucide-react';
import {
  getVehicles, getRoutes, createVehicle, updateVehicle, deleteVehicle,
  createRoute, updateRoute, deleteRoute,
  assignStudentToRoute, removeStudentFromRoute,
  searchRoutes, searchVehicles, getRouteStats,
  validateVehicle, validateRoute,
  exportRoutesToCSV,
  VEHICLE_TYPES, VEHICLE_STATUSES, ROUTE_STATUSES, ROUTE_TYPES,
  getStudents, getVehicle,
  type Vehicle, type TransportRoute, type TransportStop, type TransportStatus,
  type TransportStudent, type TransportFilters, type RouteType,
} from '@/lib/transportStore';

const TABS = [
  { id: 'routes', label: 'Routes', icon: Map },
  { id: 'vehicles', label: 'Vehicles', icon: Bus },
  { id: 'assignments', label: 'Assignments', icon: Users },
];

const statusBadge = (status: string) => {
  const map: Record<string, { bg: string; text: string; border: string; icon: any }> = {
    active: { bg: 'bg-[var(--green-50)]', text: 'text-[var(--green-800)]', border: 'border-[var(--green-200)]', icon: CheckCircle2 },
    maintenance: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Wrench },
    'out-of-service': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: Ban },
  };
  const s = map[status] || map.active;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}>
      <s.icon size={12} />
      {status === 'out-of-service' ? 'Out of Service' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function TransportManagementPage() {
  const [activeTab, setActiveTab] = useState('routes');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => { setVehicles(getVehicles()); }, []);
  useEffect(() => { setRoutes(getRoutes()); }, []);
  useEffect(() => { setStudents(getStudents()); }, []);

  const refreshVehicles = useCallback(() => setVehicles(getVehicles()), []);
  const refreshRoutes = useCallback(() => setRoutes(getRoutes()), []);

  const stats = useMemo(() => getRouteStats(), [routes, vehicles]);

  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransportStatus | 'all'>('all');
  const [showInactive, setShowInactive] = useState(false);

  const filteredRoutes = useMemo(() => {
    return searchRoutes({ search: searchInput, status: statusFilter });
  }, [searchInput, statusFilter, routes]);

  const filteredVehicles = useMemo(() => {
    return searchVehicles({ search: searchInput, status: statusFilter });
  }, [searchInput, statusFilter, vehicles]);

  // ── Route Modal ──
  const [routeModal, setRouteModal] = useState<{
    open: boolean; mode: 'create' | 'edit' | 'view'; data: Partial<TransportRoute>;
  }>({ open: false, mode: 'create', data: {} });
  const [routeSaving, setRouteSaving] = useState(false);

  const openRouteModal = (mode: 'create' | 'edit' | 'view', data?: TransportRoute) => {
    if (mode === 'create') {
      setRouteModal({
        open: true, mode, data: {
          name: '', routeType: 'morning' as RouteType,
          startPoint: '', endPoint: '', distance: 0, duration: 0, fare: 0,
          assignedVehicleId: '', assignedDriver: '', assignedDriverPhone: '',
          morningDeparture: '', morningArrival: '',
          eveningDeparture: '', eveningArrival: '',
          stops: [], assignedStudents: [],
          status: 'active', notes: '',
        },
      });
    } else if (data) {
      setRouteModal({ open: true, mode, data: { ...data } });
    }
  };
  const closeRouteModal = () => setRouteModal(p => ({ ...p, open: false }));

  const handleSaveRoute = () => {
    const d = routeModal.data;
    const errors = validateRoute(d);
    if (errors.length) return alert(errors.join('\n'));
    setRouteSaving(true);
    setTimeout(() => {
      if (routeModal.mode === 'create') {
        const vehicle = d.assignedVehicleId ? getVehicle(d.assignedVehicleId) : undefined;
        createRoute({
          name: d.name!, routeType: d.routeType as RouteType,
          startPoint: d.startPoint!, endPoint: d.endPoint!,
          distance: d.distance || 0, duration: d.duration || 0, fare: d.fare || 0,
          assignedVehicleId: d.assignedVehicleId || '',
          assignedDriver: d.assignedDriver || vehicle?.driverName || '',
          assignedDriverPhone: d.assignedDriverPhone || vehicle?.driverPhone || '',
          morningDeparture: d.morningDeparture || '', morningArrival: d.morningArrival || '',
          eveningDeparture: d.eveningDeparture || '', eveningArrival: d.eveningArrival || '',
          stops: d.stops || [], assignedStudents: d.assignedStudents || [],
          status: d.status as TransportStatus || 'active',
          notes: d.notes || '',
        });
      } else if (routeModal.mode === 'edit' && d.id) {
        updateRoute(d.id, {
          name: d.name, routeType: d.routeType as RouteType,
          startPoint: d.startPoint, endPoint: d.endPoint,
          distance: d.distance, duration: d.duration, fare: d.fare,
          assignedVehicleId: d.assignedVehicleId,
          assignedDriver: d.assignedDriver, assignedDriverPhone: d.assignedDriverPhone,
          morningDeparture: d.morningDeparture, morningArrival: d.morningArrival,
          eveningDeparture: d.eveningDeparture, eveningArrival: d.eveningArrival,
          stops: d.stops, status: d.status as TransportStatus,
          notes: d.notes,
        });
      }
      setRouteSaving(false);
      closeRouteModal();
      refreshRoutes();
    }, 300);
  };

  const handleDeleteRoute = (id: string) => {
    if (!confirm('Delete this route?')) return;
    deleteRoute(id);
    refreshRoutes();
  };

  // ── Vehicle Modal ──
  const [vehicleModal, setVehicleModal] = useState<{
    open: boolean; mode: 'create' | 'edit' | 'view'; data: Partial<Vehicle>;
  }>({ open: false, mode: 'create', data: {} });
  const [vehicleSaving, setVehicleSaving] = useState(false);

  const openVehicleModal = (mode: 'create' | 'edit' | 'view', data?: Vehicle) => {
    if (mode === 'create') {
      setVehicleModal({
        open: true, mode, data: {
          registrationNo: '', type: 'bus', capacity: 0, model: '', year: new Date().getFullYear(),
          driverName: '', driverPhone: '', driverLicense: '',
          assistantName: '', assistantPhone: '',
          status: 'active', insuranceExpiry: '', fitnessExpiry: '', lastServiceDate: '', notes: '',
        },
      });
    } else if (data) {
      setVehicleModal({ open: true, mode, data: { ...data } });
    }
  };
  const closeVehicleModal = () => setVehicleModal(p => ({ ...p, open: false }));

  const handleSaveVehicle = () => {
    const d = vehicleModal.data;
    const errors = validateVehicle(d);
    if (errors.length) return alert(errors.join('\n'));
    setVehicleSaving(true);
    setTimeout(() => {
      if (vehicleModal.mode === 'create') {
        createVehicle({
          registrationNo: d.registrationNo!, type: d.type as any, capacity: d.capacity!,
          model: d.model || '', year: d.year || new Date().getFullYear(),
          driverName: d.driverName!, driverPhone: d.driverPhone!,
          driverLicense: d.driverLicense || '',
          assistantName: d.assistantName || '', assistantPhone: d.assistantPhone || '',
          status: d.status as TransportStatus, insuranceExpiry: d.insuranceExpiry || '',
          fitnessExpiry: d.fitnessExpiry || '', lastServiceDate: d.lastServiceDate || '',
          notes: d.notes || '',
        });
      } else if (vehicleModal.mode === 'edit' && d.id) {
        updateVehicle(d.id, {
          registrationNo: d.registrationNo, type: d.type as any, capacity: d.capacity,
          model: d.model, year: d.year,
          driverName: d.driverName, driverPhone: d.driverPhone,
          driverLicense: d.driverLicense,
          assistantName: d.assistantName, assistantPhone: d.assistantPhone,
          status: d.status as TransportStatus, insuranceExpiry: d.insuranceExpiry,
          fitnessExpiry: d.fitnessExpiry, lastServiceDate: d.lastServiceDate,
          notes: d.notes,
        });
      }
      setVehicleSaving(false);
      closeVehicleModal();
      refreshVehicles();
    }, 300);
  };

  const handleDeleteVehicle = (id: string) => {
    if (!confirm('Delete this vehicle?')) return;
    if (!deleteVehicle(id)) {
      alert('Cannot delete: vehicle is assigned to an active route.');
      return;
    }
    refreshVehicles();
  };

  // ── Student Assignment ──
  const [assignModal, setAssignModal] = useState<{ open: boolean; routeId: string }>({ open: false, routeId: '' });
  const [assignData, setAssignData] = useState({ studentId: '', pickupStop: '', dropStop: '', routeType: 'morning' as RouteType });

  const openAssignModal = (routeId: string) => {
    setAssignModal({ open: true, routeId });
    setAssignData({ studentId: '', pickupStop: '', dropStop: '', routeType: 'morning' as RouteType });
  };

  const handleAssignStudent = () => {
    if (!assignData.studentId) return alert('Select a student.');
    const student = students.find((s: any) => s.id === assignData.studentId || s.studentId === assignData.studentId);
    if (!student) return alert('Student not found.');
    const route = routes.find(r => r.id === assignModal.routeId);
    if (!route) return;
    assignStudentToRoute(assignModal.routeId, {
      studentId: student.id || student.studentId,
      studentName: student.name || student.studentName,
      class: student.class || '',
      section: student.section || '',
      pickupStop: assignData.pickupStop,
      dropStop: assignData.dropStop,
      routeType: assignData.routeType,
    });
    setAssignModal({ open: false, routeId: '' });
    refreshRoutes();
  };

  const handleRemoveStudent = (routeId: string, studentId: string) => {
    if (!confirm('Remove this student from the route?')) return;
    removeStudentFromRoute(routeId, studentId);
    refreshRoutes();
  };

  // ── Stops management ──
  const [stopModal, setStopModal] = useState<{ open: boolean; routeIdx: number; editIdx: number }>({ open: false, routeIdx: -1, editIdx: -1 });
  const [stopForm, setStopForm] = useState({ name: '', estimatedTime: '', fee: 0 });

  const openStopModal = (routeIdx: number, editIdx: number = -1) => {
    if (editIdx >= 0 && routeModal.data.stops) {
      const s = routeModal.data.stops[editIdx];
      setStopForm({ name: s.name, estimatedTime: s.estimatedTime, fee: s.fee });
    } else {
      setStopForm({ name: '', estimatedTime: '', fee: 0 });
    }
    setStopModal({ open: true, routeIdx, editIdx });
  };

  const handleSaveStop = () => {
    if (!stopForm.name.trim() || !stopForm.estimatedTime.trim()) return;
    const stops = [...(routeModal.data.stops || [])];
    if (stopModal.editIdx >= 0) {
      stops[stopModal.editIdx] = { ...stops[stopModal.editIdx], ...stopForm };
    } else {
      stops.push({ id: `ST-${Date.now()}`, ...stopForm });
    }
    setRouteModal(p => ({ ...p, data: { ...p.data, stops } }));
    setStopModal({ open: false, routeIdx: -1, editIdx: -1 });
  };

  const handleRemoveStop = (idx: number) => {
    const stops = [...(routeModal.data.stops || [])];
    stops.splice(idx, 1);
    setRouteModal(p => ({ ...p, data: { ...p.data, stops } }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Transport Management</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Manage routes, vehicles, drivers, and student assignments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportRoutesToCSV(routes)}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors flex items-center gap-2"
          >
            <Download size={16} /> Export CSV
          </button>
          {activeTab === 'routes' && (
            <button onClick={() => openRouteModal('create')} className="px-4 py-2 bg-brand-primary hover:bg-brand-mid text-white text-sm font-medium rounded-xl shadow-md transition-colors flex items-center gap-2">
              <Plus size={16} /> Add Route
            </button>
          )}
          {activeTab === 'vehicles' && (
            <button onClick={() => openVehicleModal('create')} className="px-4 py-2 bg-brand-primary hover:bg-brand-mid text-white text-sm font-medium rounded-xl shadow-md transition-colors flex items-center gap-2">
              <Plus size={16} /> Add Vehicle
            </button>
          )}
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border-[var(--border-light)] shadow-sm glass-card glow-on-hover">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] text-brand-primary flex items-center justify-center mb-4">
            <Route size={24} />
          </div>
          <p className="text-[var(--text-muted)] text-sm font-medium">Active Routes</p>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats.activeRoutes} / {stats.totalRoutes}</h3>
        </div>
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border-[var(--border-light)] shadow-sm glass-card glow-on-hover">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] text-brand-primary flex items-center justify-center mb-4">
            <Car size={24} />
          </div>
          <p className="text-[var(--text-muted)] text-sm font-medium">Active Vehicles</p>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats.activeVehicles} / {stats.totalVehicles}</h3>
        </div>
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border-[var(--border-light)] shadow-sm glass-card glow-on-hover">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] text-brand-primary flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <p className="text-[var(--text-muted)] text-sm font-medium">Assigned Students</p>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats.assignedStudents}</h3>
        </div>
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border-[var(--border-light)] shadow-sm glass-card glow-on-hover">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] text-brand-primary flex items-center justify-center mb-4">
            <DollarSign size={24} />
          </div>
          <p className="text-[var(--text-muted)] text-sm font-medium">Monthly Revenue</p>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">৳{stats.monthlyRevenue.toLocaleString()}</h3>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 bg-[var(--bg-secondary)] p-1.5 rounded-2xl border-[var(--border-light)] w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-brand-primary text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Search & Filters ── */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as TransportStatus | 'all')}
          className="px-3 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-primary"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="out-of-service">Out of Service</option>
        </select>
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'routes' && (
          <motion.div key="routes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
            {filteredRoutes.length === 0 ? (
              <div className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] p-12 text-center">
                <Map size={48} className="mx-auto text-[var(--border-light)] mb-4" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Routes Found</h3>
                <p className="text-[var(--text-muted)] text-sm">Add a new route to get started.</p>
              </div>
            ) : (
              filteredRoutes.map(route => (
                <div key={route.id} className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] p-5 glass-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-[var(--text-primary)]">{route.name}</h3>
                        {statusBadge(route.status)}
                        <span className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full capitalize">{route.routeType}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1.5"><Map size={14} /> {route.startPoint} → {route.endPoint}</span>
                        <span className="flex items-center gap-1.5"><Gauge size={14} /> {route.distance} km</span>
                        <span className="flex items-center gap-1.5"><DollarSign size={14} /> ৳{route.fare}</span>
                        <span className="flex items-center gap-1.5"><Users size={14} /> {route.assignedStudents.length} students</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1"><UserCheck size={12} /> Driver: {route.assignedDriver}</span>
                        <span className="flex items-center gap-1"><Phone size={12} /> {route.assignedDriverPhone}</span>
                        {route.assignedVehicleId && <span className="flex items-center gap-1"><Bus size={12} /> Vehicle: {route.assignedVehicleId}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openAssignModal(route.id)} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-brand-primary transition-colors" title="Assign Students">
                        <Users size={16} />
                      </button>
                      <button onClick={() => openRouteModal('view', route)} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-brand-primary transition-colors" title="View">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => openRouteModal('edit', route)} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-brand-primary transition-colors" title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteRoute(route.id)} className="p-2 rounded-lg hover:bg-rose-50 text-[var(--text-muted)] hover:text-rose-600 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Stops */}
                  {route.stops.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--border-light)]">
                      <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Stops ({route.stops.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {route.stops.map((stop, i) => (
                          <span key={stop.id} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg border border-[var(--border-light)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                            <MapPin size={12} />
                            {stop.name} <span className="text-[var(--text-muted)]">({stop.estimatedTime})</span>
                            {stop.fee > 0 && <span className="text-brand-primary">৳{stop.fee}</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assigned Students */}
                  {route.assignedStudents.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--border-light)]">
                      <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Students ({route.assignedStudents.length})</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {route.assignedStudents.map(s => (
                          <div key={s.studentId} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-xs">
                            <span className="text-[var(--text-secondary)]">{s.studentName} <span className="text-[var(--text-muted)]">({s.class}/{s.section})</span></span>
                            <button onClick={() => handleRemoveStudent(route.id, s.studentId)} className="text-rose-400 hover:text-rose-600 transition-colors">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'vehicles' && (
          <motion.div key="vehicles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
            {filteredVehicles.length === 0 ? (
              <div className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] p-12 text-center">
                <Car size={48} className="mx-auto text-[var(--border-light)] mb-4" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Vehicles Found</h3>
                <p className="text-[var(--text-muted)] text-sm">Add a new vehicle to get started.</p>
              </div>
            ) : (
              filteredVehicles.map(vehicle => (
                <div key={vehicle.id} className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] p-5 glass-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-[var(--text-primary)]">{vehicle.registrationNo}</h3>
                        {statusBadge(vehicle.status)}
                        <span className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-0.5 rounded capitalize">{vehicle.type}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1.5"><Car size={14} /> {vehicle.model} ({vehicle.year})</span>
                        <span className="flex items-center gap-1.5"><Users size={14} /> Capacity: {vehicle.capacity}</span>
                        <span className="flex items-center gap-1.5"><UserCheck size={14} /> Driver: {vehicle.driverName}</span>
                        <span className="flex items-center gap-1.5"><Phone size={14} /> {vehicle.driverPhone}</span>
                        {vehicle.assistantName && <span className="flex items-center gap-1.5"><Users size={14} /> Asst: {vehicle.assistantName}</span>}
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-[var(--text-muted)]">
                        <span>Insurance: {vehicle.insuranceExpiry || 'N/A'}</span>
                        <span>Fitness: {vehicle.fitnessExpiry || 'N/A'}</span>
                        <span>Last Service: {vehicle.lastServiceDate || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openVehicleModal('view', vehicle)} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-brand-primary transition-colors" title="View">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => openVehicleModal('edit', vehicle)} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-brand-primary transition-colors" title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteVehicle(vehicle.id)} className="p-2 rounded-lg hover:bg-rose-50 text-[var(--text-muted)] hover:text-rose-600 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'assignments' && (
          <motion.div key="assignments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
            {routes.filter(r => r.status === 'active').length === 0 ? (
              <div className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] p-12 text-center">
                <Users size={48} className="mx-auto text-[var(--border-light)] mb-4" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Active Routes</h3>
                <p className="text-[var(--text-muted)] text-sm">Activate routes before assigning students.</p>
              </div>
            ) : (
              routes.filter(r => r.status === 'active').map(route => (
                <div key={route.id} className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] p-5 glass-card">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-[var(--text-primary)]">{route.name} <span className="text-xs font-normal text-[var(--text-muted)]">({route.assignedStudents.length} students)</span></h3>
                      <p className="text-xs text-[var(--text-muted)]">{route.startPoint} → {route.endPoint}</p>
                    </div>
                    <button onClick={() => openAssignModal(route.id)} className="px-3 py-1.5 bg-brand-primary hover:bg-brand-mid text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5">
                      <Plus size={14} /> Assign Student
                    </button>
                  </div>

                  {route.assignedStudents.length > 0 && (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-[var(--text-muted)] border-b border-[var(--border-light)]">
                          <th className="pb-2 font-medium">Student</th>
                          <th className="pb-2 font-medium">Class/Section</th>
                          <th className="pb-2 font-medium">Pickup Stop</th>
                          <th className="pb-2 font-medium">Drop Stop</th>
                          <th className="pb-2 font-medium">Route Type</th>
                          <th className="pb-2 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {route.assignedStudents.map(s => (
                          <tr key={s.studentId} className="border-b border-[var(--border-light)]/50 text-[var(--text-secondary)]">
                            <td className="py-2">{s.studentName}</td>
                            <td className="py-2">{s.class}/{s.section}</td>
                            <td className="py-2">{s.pickupStop}</td>
                            <td className="py-2">{s.dropStop}</td>
                            <td className="py-2 capitalize">{s.routeType}</td>
                            <td className="py-2 text-right">
                              <button onClick={() => handleRemoveStudent(route.id, s.studentId)} className="p-1 rounded hover:bg-rose-50 text-[var(--text-muted)] hover:text-rose-600 transition-colors">
                                <X size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Stops list for assignment reference */}
                  <div className="mt-3 pt-3 border-t border-[var(--border-light)]">
                    <p className="text-xs font-medium text-[var(--text-muted)] mb-1">Available Stops: {route.stops.map(s => s.name).join(', ')}</p>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Route Modal ── */}
      <AnimatePresence>
        {routeModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={closeRouteModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-[var(--border-light)] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  {routeModal.mode === 'create' ? 'Add Route' : routeModal.mode === 'edit' ? 'Edit Route' : 'Route Details'}
                </h2>
                <button onClick={closeRouteModal} className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Route Name" value={routeModal.data.name || ''} onChange={v => setRouteModal(p => ({ ...p, data: { ...p.data, name: v } }))} disabled={routeModal.mode === 'view'} />
                  <FormSelect label="Route Type" value={routeModal.data.routeType || 'morning'} options={ROUTE_TYPES.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} onChange={v => setRouteModal(p => ({ ...p, data: { ...p.data, routeType: v as RouteType } }))} disabled={routeModal.mode === 'view'} />
                  <FormField label="Start Point" value={routeModal.data.startPoint || ''} onChange={v => setRouteModal(p => ({ ...p, data: { ...p.data, startPoint: v } }))} disabled={routeModal.mode === 'view'} />
                  <FormField label="End Point" value={routeModal.data.endPoint || ''} onChange={v => setRouteModal(p => ({ ...p, data: { ...p.data, endPoint: v } }))} disabled={routeModal.mode === 'view'} />
                  <FormField label="Distance (km)" type="number" value={String(routeModal.data.distance || 0)} onChange={v => setRouteModal(p => ({ ...p, data: { ...p.data, distance: parseFloat(v) || 0 } }))} disabled={routeModal.mode === 'view'} />
                  <FormField label="Duration (min)" type="number" value={String(routeModal.data.duration || 0)} onChange={v => setRouteModal(p => ({ ...p, data: { ...p.data, duration: parseInt(v) || 0 } }))} disabled={routeModal.mode === 'view'} />
                  <FormField label="Fare (৳)" type="number" value={String(routeModal.data.fare || 0)} onChange={v => setRouteModal(p => ({ ...p, data: { ...p.data, fare: parseFloat(v) || 0 } }))} disabled={routeModal.mode === 'view'} />
                  <FormSelect label="Vehicle" value={routeModal.data.assignedVehicleId || ''} options={[{ value: '', label: '-- Select Vehicle --' }, ...vehicles.map(v => ({ value: v.id, label: `${v.registrationNo} (${v.driverName})` }))]} onChange={v => {
                    const vehicle = vehicles.find(ve => ve.id === v);
                    setRouteModal(p => ({ ...p, data: { ...p.data, assignedVehicleId: v, assignedDriver: vehicle?.driverName || '', assignedDriverPhone: vehicle?.driverPhone || '' } }));
                  }} disabled={routeModal.mode === 'view'} />
                  <FormField label="Morning Departure" type="time" value={routeModal.data.morningDeparture || ''} onChange={v => setRouteModal(p => ({ ...p, data: { ...p.data, morningDeparture: v } }))} disabled={routeModal.mode === 'view'} />
                  <FormField label="Morning Arrival" type="time" value={routeModal.data.morningArrival || ''} onChange={v => setRouteModal(p => ({ ...p, data: { ...p.data, morningArrival: v } }))} disabled={routeModal.mode === 'view'} />
                  <FormField label="Evening Departure" type="time" value={routeModal.data.eveningDeparture || ''} onChange={v => setRouteModal(p => ({ ...p, data: { ...p.data, eveningDeparture: v } }))} disabled={routeModal.mode === 'view'} />
                  <FormField label="Evening Arrival" type="time" value={routeModal.data.eveningArrival || ''} onChange={v => setRouteModal(p => ({ ...p, data: { ...p.data, eveningArrival: v } }))} disabled={routeModal.mode === 'view'} />
                  <FormSelect label="Status" value={routeModal.data.status || 'active'} options={ROUTE_STATUSES.map(s => ({ value: s, label: s === 'out-of-service' ? 'Out of Service' : s.charAt(0).toUpperCase() + s.slice(1) }))} onChange={v => setRouteModal(p => ({ ...p, data: { ...p.data, status: v as TransportStatus } }))} disabled={routeModal.mode === 'view'} />
                </div>

                <FormField label="Notes" value={routeModal.data.notes || ''} onChange={v => setRouteModal(p => ({ ...p, data: { ...p.data, notes: v } }))} disabled={routeModal.mode === 'view'} />

                {/* Stops Management */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[var(--text-primary)]">Stops</label>
                    {routeModal.mode !== 'view' && (
                      <button onClick={() => openStopModal(0)} className="text-xs text-brand-primary hover:underline flex items-center gap-1">
                        <Plus size={14} /> Add Stop
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {(routeModal.data.stops || []).map((stop, idx) => (
                      <div key={stop.id || idx} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] text-sm">
                        <MapPin size={14} className="text-brand-primary shrink-0" />
                        <span className="flex-1 text-[var(--text-secondary)]">{stop.name}</span>
                        <span className="text-[var(--text-muted)] text-xs">{stop.estimatedTime}</span>
                        <span className="text-brand-primary text-xs font-medium">৳{stop.fee}</span>
                        {routeModal.mode !== 'view' && (
                          <>
                            <button onClick={() => openStopModal(0, idx)} className="p-1 rounded hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-brand-primary">
                              <Pencil size={12} />
                            </button>
                            <button onClick={() => handleRemoveStop(idx)} className="p-1 rounded hover:bg-rose-50 text-[var(--text-muted)] hover:text-rose-600">
                              <X size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[var(--border-light)] flex justify-end gap-3">
                <button onClick={closeRouteModal} className="px-4 py-2 text-sm font-medium rounded-xl border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors">
                  {routeModal.mode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {routeModal.mode !== 'view' && (
                  <button onClick={handleSaveRoute} disabled={routeSaving} className="px-4 py-2 bg-brand-primary hover:bg-brand-mid text-white text-sm font-medium rounded-xl shadow-md transition-colors flex items-center gap-2">
                    {routeSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Vehicle Modal ── */}
      <AnimatePresence>
        {vehicleModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={closeVehicleModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-[var(--border-light)] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  {vehicleModal.mode === 'create' ? 'Add Vehicle' : vehicleModal.mode === 'edit' ? 'Edit Vehicle' : 'Vehicle Details'}
                </h2>
                <button onClick={closeVehicleModal} className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Registration No" value={vehicleModal.data.registrationNo || ''} onChange={v => setVehicleModal(p => ({ ...p, data: { ...p.data, registrationNo: v } }))} disabled={vehicleModal.mode === 'view'} />
                  <FormSelect label="Type" value={vehicleModal.data.type || 'bus'} options={VEHICLE_TYPES.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} onChange={v => setVehicleModal(p => ({ ...p, data: { ...p.data, type: v as any } }))} disabled={vehicleModal.mode === 'view'} />
                  <FormField label="Model" value={vehicleModal.data.model || ''} onChange={v => setVehicleModal(p => ({ ...p, data: { ...p.data, model: v } }))} disabled={vehicleModal.mode === 'view'} />
                  <FormField label="Year" type="number" value={String(vehicleModal.data.year || new Date().getFullYear())} onChange={v => setVehicleModal(p => ({ ...p, data: { ...p.data, year: parseInt(v) || new Date().getFullYear() } }))} disabled={vehicleModal.mode === 'view'} />
                  <FormField label="Capacity" type="number" value={String(vehicleModal.data.capacity || 0)} onChange={v => setVehicleModal(p => ({ ...p, data: { ...p.data, capacity: parseInt(v) || 0 } }))} disabled={vehicleModal.mode === 'view'} />
                  <FormSelect label="Status" value={vehicleModal.data.status || 'active'} options={VEHICLE_STATUSES.map(s => ({ value: s, label: s === 'out-of-service' ? 'Out of Service' : s.charAt(0).toUpperCase() + s.slice(1) }))} onChange={v => setVehicleModal(p => ({ ...p, data: { ...p.data, status: v as TransportStatus } }))} disabled={vehicleModal.mode === 'view'} />
                  <FormField label="Driver Name" value={vehicleModal.data.driverName || ''} onChange={v => setVehicleModal(p => ({ ...p, data: { ...p.data, driverName: v } }))} disabled={vehicleModal.mode === 'view'} />
                  <FormField label="Driver Phone" value={vehicleModal.data.driverPhone || ''} onChange={v => setVehicleModal(p => ({ ...p, data: { ...p.data, driverPhone: v } }))} disabled={vehicleModal.mode === 'view'} />
                  <FormField label="Driver License" value={vehicleModal.data.driverLicense || ''} onChange={v => setVehicleModal(p => ({ ...p, data: { ...p.data, driverLicense: v } }))} disabled={vehicleModal.mode === 'view'} />
                  <FormField label="Assistant Name" value={vehicleModal.data.assistantName || ''} onChange={v => setVehicleModal(p => ({ ...p, data: { ...p.data, assistantName: v } }))} disabled={vehicleModal.mode === 'view'} />
                  <FormField label="Assistant Phone" value={vehicleModal.data.assistantPhone || ''} onChange={v => setVehicleModal(p => ({ ...p, data: { ...p.data, assistantPhone: v } }))} disabled={vehicleModal.mode === 'view'} />
                  <FormField label="Insurance Expiry" type="date" value={vehicleModal.data.insuranceExpiry || ''} onChange={v => setVehicleModal(p => ({ ...p, data: { ...p.data, insuranceExpiry: v } }))} disabled={vehicleModal.mode === 'view'} />
                  <FormField label="Fitness Expiry" type="date" value={vehicleModal.data.fitnessExpiry || ''} onChange={v => setVehicleModal(p => ({ ...p, data: { ...p.data, fitnessExpiry: v } }))} disabled={vehicleModal.mode === 'view'} />
                  <FormField label="Last Service Date" type="date" value={vehicleModal.data.lastServiceDate || ''} onChange={v => setVehicleModal(p => ({ ...p, data: { ...p.data, lastServiceDate: v } }))} disabled={vehicleModal.mode === 'view'} />
                </div>
                <FormField label="Notes" value={vehicleModal.data.notes || ''} onChange={v => setVehicleModal(p => ({ ...p, data: { ...p.data, notes: v } }))} disabled={vehicleModal.mode === 'view'} />
              </div>

              <div className="p-6 border-t border-[var(--border-light)] flex justify-end gap-3">
                <button onClick={closeVehicleModal} className="px-4 py-2 text-sm font-medium rounded-xl border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors">
                  {vehicleModal.mode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {vehicleModal.mode !== 'view' && (
                  <button onClick={handleSaveVehicle} disabled={vehicleSaving} className="px-4 py-2 bg-brand-primary hover:bg-brand-mid text-white text-sm font-medium rounded-xl shadow-md transition-colors flex items-center gap-2">
                    {vehicleSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {vehicleModal.mode === 'create' ? 'Create Vehicle' : 'Update Vehicle'}
                    {vehicleSaving ? '...' : ''}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Student Assignment Modal ── */}
      <AnimatePresence>
        {assignModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setAssignModal({ open: false, routeId: '' })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] shadow-xl w-full max-w-md"
            >
              <div className="p-6 border-b border-[var(--border-light)] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Assign Student</h2>
                <button onClick={() => setAssignModal({ open: false, routeId: '' })} className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Student</label>
                  <select
                    value={assignData.studentId}
                    onChange={e => setAssignData(p => ({ ...p, studentId: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-primary"
                  >
                    <option value="">Select Student</option>
                    {students.map((s: any) => (
                      <option key={s.id || s.studentId} value={s.id || s.studentId}>
                        {s.name || s.studentName} ({s.class}/{s.section})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Pickup Stop</label>
                  <input
                    type="text"
                    value={assignData.pickupStop}
                    onChange={e => setAssignData(p => ({ ...p, pickupStop: e.target.value }))}
                    placeholder="e.g. Mirpur 1"
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Drop Stop</label>
                  <input
                    type="text"
                    value={assignData.dropStop}
                    onChange={e => setAssignData(p => ({ ...p, dropStop: e.target.value }))}
                    placeholder="e.g. School Gate"
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Route Type</label>
                  <select
                    value={assignData.routeType}
                    onChange={e => setAssignData(p => ({ ...p, routeType: e.target.value as RouteType }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-primary"
                  >
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-[var(--border-light)] flex justify-end gap-3">
                <button onClick={() => setAssignModal({ open: false, routeId: '' })} className="px-4 py-2 text-sm font-medium rounded-xl border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors">
                  Cancel
                </button>
                <button onClick={handleAssignStudent} className="px-4 py-2 bg-brand-primary hover:bg-brand-mid text-white text-sm font-medium rounded-xl shadow-md transition-colors flex items-center gap-2">
                  <UserCheck size={16} /> Assign
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stop Modal ── */}
      <AnimatePresence>
        {stopModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setStopModal({ open: false, routeIdx: -1, editIdx: -1 })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] shadow-xl w-full max-w-sm"
            >
              <div className="p-6 border-b border-[var(--border-light)] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{stopModal.editIdx >= 0 ? 'Edit Stop' : 'Add Stop'}</h2>
                <button onClick={() => setStopModal({ open: false, routeIdx: -1, editIdx: -1 })} className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <FormField label="Stop Name" value={stopForm.name} onChange={v => setStopForm(p => ({ ...p, name: v }))} />
                <FormField label="Estimated Time" type="time" value={stopForm.estimatedTime} onChange={v => setStopForm(p => ({ ...p, estimatedTime: v }))} />
                <FormField label="Fee (৳)" type="number" value={String(stopForm.fee)} onChange={v => setStopForm(p => ({ ...p, fee: parseFloat(v) || 0 }))} />
              </div>
              <div className="p-6 border-t border-[var(--border-light)] flex justify-end gap-3">
                <button onClick={() => setStopModal({ open: false, routeIdx: -1, editIdx: -1 })} className="px-4 py-2 text-sm font-medium rounded-xl border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveStop} className="px-4 py-2 bg-brand-primary hover:bg-brand-mid text-white text-sm font-medium rounded-xl shadow-md transition-colors">
                  {stopModal.editIdx >= 0 ? 'Update' : 'Add'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Helper Components ──
function FormField({ label, value, onChange, type = 'text', disabled }: { label: string; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-primary disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </div>
  );
}

function FormSelect({ label, value, options, onChange, disabled }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}