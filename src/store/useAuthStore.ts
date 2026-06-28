import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role } from "@/lib/rbac/roles";
import { Permission } from "@/lib/rbac/permissions";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      hasPermission: (permission) => {
        const { user } = get();
        return user ? user.permissions.includes(permission) : false;
      },
      hasRole: (role) => {
        const { user } = get();
        return user ? user.role === role : false;
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
