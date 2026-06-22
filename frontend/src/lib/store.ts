import { create } from "zustand";
import { authApi, billingApi, getToken, removeToken } from "./api";

interface User {
  id: number;
  email: string;
  business_id: number;
  role: string;
  is_active: boolean;
}

interface Subscription {
  id: number;
  business_id: number;
  plan: string;
  status: string;
  monthly_minutes_limit: number;
  minutes_used: number;
}

interface AppState {
  user: User | null;
  subscription: Subscription | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  loadUser: () => Promise<void>;
  loadSubscription: () => Promise<void>;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  subscription: null,
  isLoading: true,
  isAuthenticated: false,

  loadUser: async () => {
    const token = getToken();
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    try {
      const user = await authApi.me();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  loadSubscription: async () => {
    try {
      const sub = await billingApi.getStatus();
      set({ subscription: sub });
    } catch {
      set({ subscription: null });
    }
  },

  logout: () => {
    removeToken();
    set({ user: null, subscription: null, isAuthenticated: false });
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
}));
