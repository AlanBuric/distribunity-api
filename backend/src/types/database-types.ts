export enum Permission {
  ORGANIZATION_DELETE,
  ORGANIZATION_EDIT,
  ORGANIZATION_ROLES_VIEW,
  ORGANIZATION_ROLES_CREATE,
  ORGANIZATION_ROLES_DELETE,
  ORGANIZATION_ROLES_UPstring_PERMISSIONS,
  ORGANIZATION_MEMBERS_REMOVE,
  ORGANIZATION_MEMBERS_VIEW,
  ORGANIZATION_MEMBERS_UPstring_ROLES,
  ORGANIZATION_INVITES_CREATE,
  ORGANIZATION_INVITES_DELETE,
  INVENTORY_CREATE,
  INVENTORY_VIEW,
  INVENTORY_EDIT,
  INVENTORY_DELETE,
  ITEM_CREATE,
  ITEM_EDIT,
  ITEM_DELETE,
  ITEM_VIEW,
}

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
