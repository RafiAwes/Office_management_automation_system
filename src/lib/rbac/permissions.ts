export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",

  CRM_VIEW: "crm.view",
  CRM_CREATE: "crm.create",
  CRM_UPDATE: "crm.update",
  CRM_DELETE: "crm.delete",

  SALES_VIEW: "sales.view",
  SALES_CREATE: "sales.create",

  INVENTORY_VIEW: "inventory.view",
  INVENTORY_MANAGE: "inventory.manage",

  HR_VIEW: "hr.view",
  HR_MANAGE: "hr.manage",

  FINANCE_VIEW: "finance.view",
  FINANCE_MANAGE: "finance.manage",

  PROJECT_VIEW: "project.view",
  PROJECT_MANAGE: "project.manage",

  OKR_VIEW: "okr.view",
  OKR_MANAGE: "okr.manage",

  SETTINGS_MANAGE: "settings.manage",
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
