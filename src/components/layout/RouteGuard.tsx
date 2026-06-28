"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Permission } from "@/lib/rbac/permissions";
import { Role } from "@/lib/rbac/roles";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requiredRoles?: Role[];
}

export function RouteGuard({ children, requiredPermissions, requiredRoles }: RouteGuardProps) {
  const { isAuthenticated, hasPermission, hasRole } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    // Check roles
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some((role) => hasRole(role));
      if (!hasRequiredRole) {
        router.push("/unauthorized"); // Or some fallback route
        return;
      }
    }

    // Check permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasRequiredPermission = requiredPermissions.some((perm) => hasPermission(perm));
      if (!hasRequiredPermission) {
        router.push("/unauthorized");
        return;
      }
    }

    setIsAuthorized(true);
  }, [isAuthenticated, hasPermission, hasRole, router, pathname, requiredPermissions, requiredRoles]);

  if (!isAuthorized) {
    // Can replace with a skeleton or loading spinner
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
}
