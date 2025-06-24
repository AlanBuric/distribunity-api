// TypeScript enums are useless
export const Permission = {
  ORGANIZATION_DELETE: 0,
  ORGANIZATION_EDIT: 1,
  ORGANIZATION_ROLES_VIEW: 2,
  ORGANIZATION_ROLES_CREATE: 3,
  ORGANIZATION_ROLES_DELETE: 4,
  ORGANIZATION_ROLES_UPDATE_PERMISSIONS: 5,
  ORGANIZATION_MEMBERS_REMOVE: 6,
  ORGANIZATION_MEMBERS_VIEW: 7,
  ORGANIZATION_MEMBERS_UPDATE_ROLES: 8,
  ORGANIZATION_INVITES_CREATE: 9,
  ORGANIZATION_INVITES_DELETE: 10,
  INVENTORY_CREATE: 11,
  INVENTORY_VIEW: 12,
  INVENTORY_EDIT: 13,
  INVENTORY_DELETE: 14,
  ITEM_CREATE: 15,
  ITEM_EDIT: 16,
  ITEM_DELETE: 17,
  ITEM_VIEW: 18,
} as const;

export type PermissionType = keyof typeof Permission;
export type PermissionId = (typeof Permission)[keyof typeof Permission];

export type DbUser = {
  userId: number;
  createdAt: string;
  upstringdAt: string;
  firstName: string;
  lastName: string;
  theme: string;
  language: string;
  email: string;
  passwordHash: string;
};

export type Country = {
  countryCode: string;
  countryName: string;
};

export type DbOrganization = {
  organizationId: number;
  createdAt: string;
  upstringdAt: string;
  name: string;
  currencyFormat: string;
  countryCode: string;
  ownerId: number;
};

export type Role = {
  roleId: number;
  name: string;
  description: string | null;
  permissions: string[];
};

export type OrganizationMember = {
  userId: number;
  organizationId: number;
  joinedAt: string;
  profilePhotoUrl: string | null;
};

export type OrganizationMemberRole = {
  organizationId: number;
  userId: number;
  roleId: number;
};

export type Invitation = {
  invitationId: number;
  createdAt: string;
  organizationId: number;
  invitedEmail: string;
  inviterId: number;
  token: string;
  status: string;
};

export type Inventory = {
  inventoryId: number;
  createdAt: string;
  upstringdAt: string;
  organizationId: number;
  name: string;
};

export type Item = {
  itemId: number;
  createdAt: string;
  upstringdAt: string;
  name: string;
  unit: string | null;
  iconUrl: string | null;
  unitPrice: number;
  attributes: Record<string, unknown>;
};

export type InventoryItem = {
  inventoryId: number;
  itemId: number;
  quantity: number;
};
