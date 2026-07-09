'use client';

export type TransportStatus = 'active' | 'maintenance' | 'out-of-service';
export type RouteType = 'morning' | 'evening' | 'both';
export type VehicleType = 'bus' | 'mini-bus' | 'micro' | 'car';

export interface Vehicle {
  id: string;
  registrationNo: string;
  type: VehicleType;
  capacity: number;
  model: string;
  year: number;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  assistantName: string;
  assistantPhone: string;
  status: TransportStatus;
  insuranceExpiry: string;
  fitnessExpiry: string;
  lastServiceDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransportStop {
  id: string;
  name: string;
  estimatedTime: string;
  fee: number;
}

export interface TransportStudent {
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  pickupStop: string;
  dropStop: string;
  routeType: RouteType;
}

export interface TransportRoute {
  id: string;
  name: string;
  routeType: RouteType;
  startPoint: string;
  endPoint: string;
  stops: TransportStop[];
  distance: number;
  duration: number;
  fare: number;
  assignedVehicleId: string;
  assignedDriver: string;
  assignedDriverPhone: string;
  morningDeparture: string;
  morningArrival: string;
  eveningDeparture: string;
  eveningArrival: string;
  assignedStudents: TransportStudent[];
  status: TransportStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransportFilters {
  search?: string;
  status?: TransportStatus | 'all';
}

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored) { const p = JSON.parse(stored); if (Array.isArray(p) && p.length) return p; }
  } catch {}
  return fallback;
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

let vehicleCounter = 3;
function nextVehicleId(): string {
  vehicleCounter++;
  return `VH-${String(vehicleCounter).padStart(3, '0')}`;
}

let routeCounter = 2;
function nextRouteId(): string {
  routeCounter++;
  return `RT-${String(routeCounter).padStart(3, '0')}`;
}

let stopCounter = 9;
function nextStopId(): string {
  stopCounter++;
  return `ST-${String(stopCounter).padStart(3, '0')}`;
}

const defaultVehicles: Vehicle[] = [
  {
    id: 'VH-001', registrationNo: 'DHAKA-11-1234', type: 'bus', capacity: 50, model: 'Hino AK', year: 2022,
    driverName: 'Md. Karim Hossain', driverPhone: '01711-111111', driverLicense: 'BD-DL-45678',
    assistantName: 'Rafiq Islam', assistantPhone: '01711-111112',
    status: 'active', insuranceExpiry: '2026-12-31', fitnessExpiry: '2026-06-30',
    lastServiceDate: '2026-04-01', notes: '',
    createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'VH-002', registrationNo: 'DHAKA-11-5678', type: 'mini-bus', capacity: 35, model: 'Toyota Coaster', year: 2023,
    driverName: 'Md. Shahidul Islam', driverPhone: '01711-222333', driverLicense: 'BD-DL-78901',
    assistantName: 'Jahangir Alam', assistantPhone: '01711-222444',
    status: 'active', insuranceExpiry: '2026-11-30', fitnessExpiry: '2026-08-15',
    lastServiceDate: '2026-03-20', notes: '',
    createdAt: '2024-02-10T00:00:00Z', updatedAt: '2024-02-10T00:00:00Z',
  },
  {
    id: 'VH-003', registrationNo: 'DHAKA-11-9101', type: 'micro', capacity: 15, model: 'Nissan Caravan', year: 2023,
    driverName: 'Abdur Rahim', driverPhone: '01711-333444', driverLicense: 'BD-DL-78901',
    assistantName: '', assistantPhone: '',
    status: 'maintenance', insuranceExpiry: '2026-09-30', fitnessExpiry: '2026-05-01',
    lastServiceDate: '2026-05-10', notes: 'Engine overhaul needed',
    createdAt: '2024-03-05T00:00:00Z', updatedAt: '2024-03-05T00:00:00Z',
  },
];

const defaultRoutes: TransportRoute[] = [
  {
    id: 'RT-001', name: 'Mirpur 1 - Motijheel', routeType: 'morning',
    startPoint: 'Mirpur 1 Bus Stand', endPoint: 'Motijheel School Gate',
    distance: 12.5, duration: 45, fare: 800,
    assignedVehicleId: 'VH-001', assignedDriver: 'Md. Karim Hossain', assignedDriverPhone: '01711-111111',
    morningDeparture: '07:00', morningArrival: '07:45',
    eveningDeparture: '14:00', eveningArrival: '14:45',
    assignedStudents: [],
    stops: [
      { id: 'ST-001', name: 'Mirpur 1', estimatedTime: '07:00', fee: 800 },
      { id: 'ST-002', name: 'Kazipara', estimatedTime: '07:10', fee: 700 },
      { id: 'ST-003', name: 'Shewrapara', estimatedTime: '07:20', fee: 600 },
      { id: 'ST-004', name: 'Bijoy Sarani', estimatedTime: '07:30', fee: 500 },
      { id: 'ST-005', name: 'Motijheel', estimatedTime: '07:45', fee: 0 },
    ],
    status: 'active', notes: '',
    createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'RT-002', name: 'Uttara - Gulshan', routeType: 'both',
    startPoint: 'Uttara Sector 4', endPoint: 'Gulshan 2 School',
    distance: 10, duration: 40, fare: 900,
    assignedVehicleId: 'VH-002', assignedDriver: 'Md. Shahidul Islam', assignedDriverPhone: '01711-222333',
    morningDeparture: '06:45', morningArrival: '07:30',
    eveningDeparture: '14:15', eveningArrival: '15:00',
    assignedStudents: [],
    stops: [
      { id: 'ST-006', name: 'Uttara Sector 4', estimatedTime: '06:45', fee: 900 },
      { id: 'ST-007', name: 'Airport Road', estimatedTime: '07:00', fee: 800 },
      { id: 'ST-008', name: 'Bashundhara', estimatedTime: '07:15', fee: 700 },
      { id: 'ST-009', name: 'Gulshan 2', estimatedTime: '07:30', fee: 0 },
    ],
    status: 'active', notes: '',
    createdAt: '2024-02-10T00:00:00Z', updatedAt: '2024-02-10T00:00:00Z',
  },
];

export function getVehicles(): Vehicle[] {
  return loadFromStorage<Vehicle>('transport_vehicles', defaultVehicles);
}

export function getRoutes(): TransportRoute[] {
  return loadFromStorage<TransportRoute>('transport_routes', defaultRoutes);
}

function saveVehicles(data: Vehicle[]) {
  saveToStorage('transport_vehicles', data);
}

function saveRoutes(data: TransportRoute[]) {
  saveToStorage('transport_routes', data);
}

export function getVehicle(id: string): Vehicle | undefined {
  return getVehicles().find(v => v.id === id);
}

export function getRoute(id: string): TransportRoute | undefined {
  return getRoutes().find(r => r.id === id);
}

export function createVehicle(data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Vehicle {
  const list = getVehicles();
  const now = new Date().toISOString();
  const vehicle: Vehicle = { ...data, id: nextVehicleId(), createdAt: now, updatedAt: now };
  list.push(vehicle);
  saveVehicles(list);
  return vehicle;
}

export function updateVehicle(id: string, data: Partial<Vehicle>): Vehicle | null {
  const list = getVehicles();
  const idx = list.findIndex(v => v.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  saveVehicles(list);
  return list[idx];
}

export function deleteVehicle(id: string): boolean {
  const routes = getRoutes();
  if (routes.some(r => r.assignedVehicleId === id && r.status === 'active')) return false;
  const list = getVehicles().filter(v => v.id !== id);
  if (list.length === getVehicles().length) return false;
  saveVehicles(list);
  return true;
}

export function createRoute(data: Omit<TransportRoute, 'id' | 'createdAt' | 'updatedAt'>): TransportRoute {
  const list = getRoutes();
  const now = new Date().toISOString();
  const route: TransportRoute = { ...data, id: nextRouteId(), createdAt: now, updatedAt: now };
  list.push(route);
  saveRoutes(list);
  return route;
}

export function updateRoute(id: string, data: Partial<TransportRoute>): TransportRoute | null {
  const list = getRoutes();
  const idx = list.findIndex(r => r.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  saveRoutes(list);
  return list[idx];
}

export function deleteRoute(id: string): boolean {
  const list = getRoutes().filter(r => r.id !== id);
  if (list.length === getRoutes().length) return false;
  saveRoutes(list);
  return true;
}

export function assignStudentToRoute(routeId: string, student: TransportStudent): TransportRoute | null {
  const list = getRoutes();
  const idx = list.findIndex(r => r.id === routeId);
  if (idx < 0) return null;
  list[idx] = {
    ...list[idx],
    assignedStudents: [...list[idx].assignedStudents, student],
    updatedAt: new Date().toISOString(),
  };
  saveRoutes(list);
  return list[idx];
}

export function removeStudentFromRoute(routeId: string, studentId: string): TransportRoute | null {
  const list = getRoutes();
  const idx = list.findIndex(r => r.id === routeId);
  if (idx < 0) return null;
  list[idx] = {
    ...list[idx],
    assignedStudents: list[idx].assignedStudents.filter(s => s.studentId !== studentId),
    updatedAt: new Date().toISOString(),
  };
  saveRoutes(list);
  return list[idx];
}

export function getRouteStats() {
  const routes = getRoutes();
  const activeRoutes = routes.filter(r => r.status === 'active');
  const vehicles = getVehicles();
  const activeVehicles = vehicles.filter(v => v.status === 'active');
  const assignedStudents = routes.reduce((s, r) => s + r.assignedStudents.length, 0);
  const totalRevenue = routes.reduce((sum, r) => sum + r.fare * Math.max(r.assignedStudents.length, 0), 0);
  const monthlyRevenue = routes.reduce((sum, r) => sum + r.fare * Math.max(r.assignedStudents.length, 0) * 22, 0);

  return {
    totalRoutes: routes.length,
    activeRoutes: activeRoutes.length,
    totalVehicles: vehicles.length,
    activeVehicles: activeVehicles.length,
    assignedStudents,
    totalRevenue,
    monthlyRevenue,
  };
}

export function searchRoutes(filters: TransportFilters): TransportRoute[] {
  let list = getRoutes();
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.startPoint.toLowerCase().includes(q) ||
      r.endPoint.toLowerCase().includes(q) ||
      r.assignedDriver.toLowerCase().includes(q)
    );
  }
  if (filters.status && filters.status !== 'all') {
    list = list.filter(r => r.status === filters.status);
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function searchVehicles(filters: TransportFilters): Vehicle[] {
  let list = getVehicles();
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(v =>
      v.registrationNo.toLowerCase().includes(q) ||
      v.driverName.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q)
    );
  }
  if (filters.status && filters.status !== 'all') {
    list = list.filter(v => v.status === filters.status);
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getStudents() {
  try {
    const s = localStorage.getItem('students');
    if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; }
  } catch {}
  return [];
}

export const VEHICLE_TYPES: VehicleType[] = ['bus', 'mini-bus', 'micro', 'car'];
export const VEHICLE_STATUSES: TransportStatus[] = ['active', 'maintenance', 'out-of-service'];
export const ROUTE_STATUSES: TransportStatus[] = ['active', 'maintenance', 'out-of-service'];
export const ROUTE_TYPES: RouteType[] = ['morning', 'evening', 'both'];

export function validateVehicle(data: Partial<Vehicle>): string[] {
  const errors: string[] = [];
  if (!data.registrationNo?.trim()) errors.push('Registration number is required.');
  if (!data.driverName?.trim()) errors.push('Driver name is required.');
  if (!data.driverPhone?.trim()) errors.push('Driver phone is required.');
  if (!data.capacity || data.capacity <= 0) errors.push('Capacity must be greater than zero.');
  return errors;
}

export function validateRoute(data: Partial<TransportRoute>): string[] {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push('Route name is required.');
  if (!data.startPoint?.trim()) errors.push('Start point is required.');
  if (!data.endPoint?.trim()) errors.push('End point is required.');
  if (!data.fare || data.fare <= 0) errors.push('Fare must be greater than zero.');
  return errors;
}

export function exportRoutesToCSV(routes: TransportRoute[]): void {
  const headers = ['ID', 'Name', 'Route Type', 'Start', 'End', 'Distance (km)', 'Fare', 'Vehicle', 'Driver', 'Students', 'Status'];
  const rows = routes.map(r => [
    r.id, r.name, r.routeType, r.startPoint, r.endPoint,
    String(r.distance), String(r.fare),
    r.assignedVehicleId || 'N/A', r.assignedDriver,
    String(r.assignedStudents.length), r.status,
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transport-routes-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}