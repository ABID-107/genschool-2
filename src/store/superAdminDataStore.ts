"use client";

const SCHOOLS_KEY = "genschool_sa_schools";
const ADMINS_KEY = "genschool_sa_admins";

export interface MockSchool {
  id: string;
  name: string;
  slug: string;
  schoolType: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  eiin: string;
  domain: string;
  logo: string | null;
  isActive: boolean;
  status: "active" | "inactive";
  plan: string;
  planId: string;
  admin: { name: string; email: string } | null;
  students: number;
  teachers: number;
  createdAt: string;
  users: { id: string; name: string; email: string; phone: string | null; isActive: boolean }[];
  subscriptions: {
    id: string;
    status: string;
    startDate: string;
    endDate: string | null;
    plan: { id: string; name: string; price: number; period: string };
  }[];
  classes: { id: string; name: string; numericId: number }[];
}

export interface MockPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  period: string;
  maxStudents: number;
  maxTeachers: number;
  features: string[];
  isPopular: boolean;
}

export interface MockAdmin {
  id: number;
  name: string;
  email: string;
  phone: string;
  school: string;
  role: string;
  status: "active" | "inactive";
  lastActive: string;
}

const DEFAULT_PLANS: MockPlan[] = [
  {
    id: "plan_starter",
    name: "Starter",
    slug: "starter",
    description: "For small schools getting started",
    price: 29,
    period: "month",
    maxStudents: 200,
    maxTeachers: 5,
    features: ["Up to 200 students", "5 teachers", "Basic analytics", "Email support", "1 school"],
    isPopular: false,
  },
  {
    id: "plan_professional",
    name: "Professional",
    slug: "professional",
    description: "For growing institutions",
    price: 79,
    period: "month",
    maxStudents: 1000,
    maxTeachers: 50,
    features: ["Up to 1,000 students", "50 teachers", "Advanced analytics", "Priority support", "1 school", "Custom branding"],
    isPopular: true,
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    slug: "enterprise",
    description: "For large institutions & chains",
    price: 199,
    period: "month",
    maxStudents: 999999,
    maxTeachers: 999999,
    features: ["Unlimited students", "Unlimited teachers", "Full analytics suite", "24/7 dedicated support", "Multi-school support", "API access", "Custom integrations"],
    isPopular: false,
  },
];

const DEFAULT_SCHOOLS: MockSchool[] = [
  {
    id: "sch_1",
    name: "Green Valley International",
    slug: "green-valley-international",
    schoolType: "SCHOOL",
    email: "info@greenvalley.edu",
    phone: "+1 234 567 890",
    address: "123 Education Lane",
    city: "New York",
    state: "NY",
    country: "USA",
    eiin: "GVI-2024-001",
    domain: "greenvalley.edu",
    logo: null,
    isActive: true,
    status: "active",
    plan: "Professional",
    planId: "plan_professional",
    admin: { name: "Dr. Sarah Mitchell", email: "sarah@gvi.edu" },
    students: 1248,
    teachers: 86,
    createdAt: "2024-01-15T00:00:00Z",
    users: [{ id: "u1", name: "Dr. Sarah Mitchell", email: "sarah@gvi.edu", phone: "+1 234 567 901", isActive: true }],
    subscriptions: [{ id: "sub_1", status: "active", startDate: "2024-01-15T00:00:00Z", endDate: "2025-01-15T00:00:00Z", plan: { id: "plan_professional", name: "Professional", price: 79, period: "month" } }],
    classes: [{ id: "c1", name: "Grade 10", numericId: 10 }],
  },
  {
    id: "sch_2",
    name: "Riverside Academy",
    slug: "riverside-academy",
    schoolType: "SCHOOL",
    email: "admin@riverside.edu",
    phone: "+1 234 567 891",
    address: "456 River Road",
    city: "Boston",
    state: "MA",
    country: "USA",
    eiin: "RA-2024-002",
    domain: "riverside.edu",
    logo: null,
    isActive: true,
    status: "active",
    plan: "Professional",
    planId: "plan_professional",
    admin: { name: "John Davis", email: "john@riverside.edu" },
    students: 892,
    teachers: 54,
    createdAt: "2024-03-01T00:00:00Z",
    users: [{ id: "u2", name: "John Davis", email: "john@riverside.edu", phone: "+1 234 567 902", isActive: true }],
    subscriptions: [{ id: "sub_2", status: "active", startDate: "2024-03-01T00:00:00Z", endDate: "2025-03-01T00:00:00Z", plan: { id: "plan_professional", name: "Professional", price: 79, period: "month" } }],
    classes: [{ id: "c2", name: "Grade 8", numericId: 8 }],
  },
  {
    id: "sch_3",
    name: "Sunrise School of Excellence",
    slug: "sunrise-school",
    schoolType: "SCHOOL",
    email: "info@sunrise.edu",
    phone: "+1 234 567 892",
    address: "789 Sunrise Blvd",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    eiin: "SSE-2024-003",
    domain: "sunrise.edu",
    logo: null,
    isActive: true,
    status: "active",
    plan: "Enterprise",
    planId: "plan_enterprise",
    admin: { name: "Emily Roberts", email: "emily@sunrise.edu" },
    students: 1567,
    teachers: 120,
    createdAt: "2024-06-01T00:00:00Z",
    users: [{ id: "u3", name: "Emily Roberts", email: "emily@sunrise.edu", phone: "+1 234 567 903", isActive: true }],
    subscriptions: [{ id: "sub_3", status: "active", startDate: "2024-06-01T00:00:00Z", endDate: null, plan: { id: "plan_enterprise", name: "Enterprise", price: 199, period: "month" } }],
    classes: [{ id: "c3", name: "Grade 12", numericId: 12 }],
  },
  {
    id: "sch_4",
    name: "St. Mary's Convent",
    slug: "st-marys-convent",
    schoolType: "SCHOOL",
    email: "office@stmarys.edu",
    phone: "+1 234 567 893",
    address: "321 Church Street",
    city: "Chicago",
    state: "IL",
    country: "USA",
    eiin: "SMC-2024-004",
    domain: "stmarys.edu",
    logo: null,
    isActive: false,
    status: "inactive",
    plan: "Starter",
    planId: "plan_starter",
    admin: { name: "Michael Chen", email: "michael@stmarys.edu" },
    students: 345,
    teachers: 22,
    createdAt: "2024-09-01T00:00:00Z",
    users: [{ id: "u4", name: "Michael Chen", email: "michael@stmarys.edu", phone: "+1 234 567 904", isActive: false }],
    subscriptions: [{ id: "sub_4", status: "expired", startDate: "2024-09-01T00:00:00Z", endDate: "2024-12-01T00:00:00Z", plan: { id: "plan_starter", name: "Starter", price: 29, period: "month" } }],
    classes: [{ id: "c4", name: "Grade 5", numericId: 5 }],
  },
  {
    id: "sch_5",
    name: "Oakridge International",
    slug: "oakridge-international",
    schoolType: "SCHOOL",
    email: "info@oakridge.edu",
    phone: "+1 234 567 894",
    address: "567 Oak Avenue",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    eiin: "OI-2025-005",
    domain: "oakridge.edu",
    logo: null,
    isActive: true,
    status: "active",
    plan: "Enterprise",
    planId: "plan_enterprise",
    admin: { name: "Lisa Anderson", email: "lisa@oakridge.edu" },
    students: 2100,
    teachers: 145,
    createdAt: "2025-01-10T00:00:00Z",
    users: [{ id: "u5", name: "Lisa Anderson", email: "lisa@oakridge.edu", phone: "+1 234 567 905", isActive: true }],
    subscriptions: [{ id: "sub_5", status: "active", startDate: "2025-01-10T00:00:00Z", endDate: "2026-01-10T00:00:00Z", plan: { id: "plan_enterprise", name: "Enterprise", price: 199, period: "month" } }],
    classes: [{ id: "c5", name: "Grade 11", numericId: 11 }],
  },
];

function getStoredSchools(): MockSchool[] {
  if (typeof window === "undefined") return DEFAULT_SCHOOLS;
  try {
    const stored = localStorage.getItem(SCHOOLS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return DEFAULT_SCHOOLS;
}

function saveSchools(schools: MockSchool[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SCHOOLS_KEY, JSON.stringify(schools));
  }
}

let storedSchools = getStoredSchools();
let currentSchools = [...storedSchools];

export function getSchools(): MockSchool[] {
  currentSchools = [...getStoredSchools()];
  return currentSchools;
}

export function getSchoolById(id: string): MockSchool | undefined {
  return getStoredSchools().find((s) => s.id === id);
}

export function registerSchool(data: {
  name: string;
  slug: string;
  schoolType: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  eiin?: string;
  planId: string;
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
}): MockSchool {
  const schools = getStoredSchools();
  const plan = DEFAULT_PLANS.find((p) => p.id === data.planId) || DEFAULT_PLANS[0];
  const newSchool: MockSchool = {
    id: `sch_${Date.now()}`,
    name: data.name,
    slug: data.slug,
    schoolType: data.schoolType || "SCHOOL",
    email: data.email || "",
    phone: data.phone || "",
    address: data.address || "",
    city: data.city || "",
    state: data.state || "",
    country: data.country || "",
    eiin: data.eiin || "",
    domain: "",
    logo: null,
    isActive: true,
    status: "active",
    plan: plan.name,
    planId: data.planId,
    admin: { name: data.adminName, email: data.adminEmail },
    students: 0,
    teachers: 0,
    createdAt: new Date().toISOString(),
    users: [
      {
        id: `u_${Date.now()}`,
        name: data.adminName,
        email: data.adminEmail,
        phone: data.adminPhone || null,
        isActive: true,
      },
    ],
    subscriptions: [
      {
        id: `sub_${Date.now()}`,
        status: "active",
        startDate: new Date().toISOString(),
        endDate: null,
        plan: { id: plan.id, name: plan.name, price: plan.price, period: plan.period },
      },
    ],
    classes: [],
  };
  schools.push(newSchool);
  saveSchools(schools);
  return newSchool;
}

export function updateSchool(id: string, updates: Partial<MockSchool>): MockSchool | undefined {
  const schools = getStoredSchools();
  const index = schools.findIndex((s) => s.id === id);
  if (index === -1) return undefined;
  schools[index] = { ...schools[index], ...updates };
  saveSchools(schools);
  return schools[index];
}

export function getPlans(): MockPlan[] {
  return DEFAULT_PLANS;
}

export function getStoredAdmins(): MockAdmin[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(ADMINS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

export function saveAdmin(admin: MockAdmin) {
  const admins = getStoredAdmins();
  admins.push(admin);
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
  }
}
