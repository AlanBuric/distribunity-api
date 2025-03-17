import type { UUID } from "node:crypto";

export type Named = {
  name: string;
};

export type CreatedAt = {
  createdAt: number;
};

export type CreatedBy = {
  createdBy: UUID;
};

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

export type Role = {
  name: string;
  description: string;
  permissions: Permission[];
};

export type Country = {
  name: string;
};

export type Item = Named &
  CreatedAt & {
    unit: string;
    iconURL: string;
    unitPrice: number;
    attributes: (Record<string, string> | Record<string, number> | string)[];
  };

export type InventoryItem = {
  quantity: number;
};

export type Inventory = Named & CreatedAt & { items: Record<UUID, InventoryItem> };

export type Member = CreatedAt & {
  roles: UUID[];
  profilePhotoUrl: string;
};

export type Invitation = CreatedAt & CreatedBy;

export type Organization = Named &
  CreatedAt & {
    roles: Record<UUID, Role>;
    members: Record<UUID, Member>;
    countryCode: string;
    invitations: Record<UUID, Invitation>;
    inventories: Record<UUID, Inventory>;
    items: Record<UUID, Item>;
  };

export type User = CreatedAt & {
  firstName: string;
  lastName: string;
  email: string;
  organizations: UUID[];
  hashedPassword: string;
};
