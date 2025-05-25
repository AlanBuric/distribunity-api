export const ALL_PERMISSIONS = [
  "organization.delete",
  "organization.edit",
  "organization.roles.view",
  "organization.roles.create",
  "organization.roles.delete",
  "organization.roles.updatePermissions",
  "organization.members.remove",
  "organization.members.view",
  "organization.members.updateRoles",
  "organization.invites.create",
  "organization.invites.delete",
  "inventory.create",
  "inventory.view",
  "inventory.edit",
  "inventory.delete",
  "item.create",
  "item.edit",
  "item.delete",
  "item.view",
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];

export type User = {
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash?: string | null;
};

export type Country = {
  countryCode: string;
  name: string;
};

export type Organization = {
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
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
  joinedAt: Date;
  profilePhotoUrl: string | null;
};

export type OrganizationMemberRole = {
  organizationId: number;
  userId: number;
  roleId: number;
};

export type Invitation = {
  invitationId: number;
  createdAt: Date;
  organizationId: number;
  invitedEmail: string;
  inviterId: number;
  token: string;
  status: string;
};

export type Inventory = {
  inventoryId: number;
  createdAt: Date;
  updatedAt: Date;
  organizationId: number;
  name: string;
};

export type Item = {
  itemId: number;
  createdAt: Date;
  updatedAt: Date;
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
