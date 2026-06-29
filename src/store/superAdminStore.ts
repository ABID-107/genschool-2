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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hydrate: () => void;
}

export const useSuperAdminStore = create<SuperAdminState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return { success: false, error: "Email is required." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return { success: false, error: "Please enter a valid email address." };
    }
    if (!password) {
      return { success: false, error: "Password is required." };
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const user: SuperAdminUser = {
          email: trimmedEmail,
          name: "Super Admin",
          role: "SUPER_ADMIN",
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        }
        set({ user, isAuthenticated: true });
        resolve({ success: true });
      }, 1200);
    });
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
