"use client";

import { create } from "zustand";

const STORAGE_KEY = "genschool_super_admin";

interface SuperAdminUser {
  email: string;
  name: string;
  role: "SUPER_ADMIN";
}

interface SuperAdminState {
  user: SuperAdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hydrate: () => void;
}

export const useSuperAdminStore = create<SuperAdminState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/super-admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      const user: SuperAdminUser = data.user;

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      }
      set({ user, isAuthenticated: true });
      return true;
    } catch {
      return false;
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({ user: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const user = JSON.parse(stored) as SuperAdminUser;
          set({ user, isAuthenticated: true });
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  },
}));
