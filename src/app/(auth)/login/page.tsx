"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { ROLES } from "@/lib/rbac/roles";
import { PERMISSIONS } from "@/lib/rbac/permissions";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleMockLogin = () => {
    // Mock login as Super Admin
    login(
      {
        id: "1",
        name: "Admin User",
        email: "admin@glowhaat.com",
        role: ROLES.SUPER_ADMIN,
        permissions: Object.values(PERMISSIONS),
      },
      "mock-jwt-token"
    );
    router.push("/");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Login to GlowHaat</h1>
          <p className="text-sm text-muted-foreground">
            Click below to login as a mock Super Admin
          </p>
        </div>
        <button
          onClick={handleMockLogin}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          Mock Login
        </button>
      </div>
    </div>
  );
}
