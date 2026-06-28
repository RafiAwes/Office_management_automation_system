import { useAuthStore } from "@/store/useAuthStore";
import { Permission } from "@/lib/rbac/permissions";
import { Role } from "@/lib/rbac/roles";

export interface RbacProps {
  requiredPermissions?: Permission[];
  requiredRoles?: Role[];
  fallbackAction?: "hidden" | "disabled" | "read-only";
  matchType?: "any" | "all";
}

export function useRbac({
  requiredPermissions = [],
  requiredRoles = [],
  fallbackAction = "hidden",
  matchType = "any",
}: RbacProps = {}) {
  const { isAuthenticated, user, hasPermission, hasRole } = useAuthStore();

  // If no RBAC controls are provided, allow access
  if (requiredPermissions.length === 0 && requiredRoles.length === 0) {
    return { isAllowed: true, action: "allow" as const };
  }

  // If not authenticated, default fallback action applies
  if (!isAuthenticated || !user) {
    return { isAllowed: false, action: fallbackAction };
  }

  let roleAllowed = true;
  if (requiredRoles.length > 0) {
    if (matchType === "any") {
      roleAllowed = requiredRoles.some((role) => hasRole(role));
    } else {
      roleAllowed = requiredRoles.every((role) => hasRole(role));
    }
  }

  let permAllowed = true;
  if (requiredPermissions.length > 0) {
    if (matchType === "any") {
      permAllowed = requiredPermissions.some((perm) => hasPermission(perm));
    } else {
      permAllowed = requiredPermissions.every((perm) => hasPermission(perm));
    }
  }

  const isAllowed = roleAllowed && permAllowed;

  return {
    isAllowed,
    action: isAllowed ? ("allow" as const) : fallbackAction,
  };
}
