export const PROPERTY_STATUS = {
  active: "Active",
  inactive: "Inactive",
  under_maintenance: "Under Maintenance",
} as const;

export const FLAT_STATUS = {
  available: "Available",
  occupied: "Occupied",
  reserved: "Reserved",
  under_maintenance: "Under Maintenance",
} as const;

export const CUSTOMER_STATUS = {
  active: "Active",
  inactive: "Inactive",
  blacklisted: "Blacklisted",
} as const;

export const CONTRACT_STATUS = {
  draft: "Draft",
  active: "Active",
  expired: "Expired",
  terminated: "Terminated",
  renewed: "Renewed",
} as const;

export const RENT_STATUS = {
  pending: "Pending",
  partial: "Partial",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
} as const;

export const PAYMENT_METHOD = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  upi: "UPI",
  other: "Other",
} as const;

export const USER_ROLE = {
  admin: "Admin",
  manager: "Manager",
  staff: "Staff",
} as const;

export const IMPORT_ENTITY = {
  properties: "Properties",
  flats: "Flats",
  customers: "Customers",
  contracts: "Contracts",
  payments: "Payments",
} as const;

export type PropertyStatus = keyof typeof PROPERTY_STATUS;
export type FlatStatus = keyof typeof FLAT_STATUS;
export type CustomerStatus = keyof typeof CUSTOMER_STATUS;
export type ContractStatus = keyof typeof CONTRACT_STATUS;
export type RentStatus = keyof typeof RENT_STATUS;
export type PaymentMethod = keyof typeof PAYMENT_METHOD;
export type UserRole = keyof typeof USER_ROLE;
export type ImportEntity = keyof typeof IMPORT_ENTITY;

export const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  under_maintenance: "bg-yellow-100 text-yellow-800",
  available: "bg-green-100 text-green-800",
  occupied: "bg-blue-100 text-blue-800",
  reserved: "bg-purple-100 text-purple-800",
  blacklisted: "bg-red-100 text-red-800",
  draft: "bg-gray-100 text-gray-800",
  expired: "bg-orange-100 text-orange-800",
  terminated: "bg-red-100 text-red-800",
  renewed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  partial: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ["*"],
  manager: [
    "properties:read",
    "properties:write",
    "flats:read",
    "flats:write",
    "customers:read",
    "customers:write",
    "contracts:read",
    "contracts:write",
    "rent:read",
    "rent:write",
    "payments:read",
    "payments:write",
    "reports:read",
    "imports:read",
    "imports:write",
  ],
  staff: [
    "properties:read",
    "flats:read",
    "customers:read",
    "customers:write",
    "contracts:read",
    "contracts:write",
    "rent:read",
    "payments:read",
    "payments:write",
  ],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes("*") || permissions.includes(permission);
}