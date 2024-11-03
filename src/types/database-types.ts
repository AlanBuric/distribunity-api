import {UUID} from "crypto";

export type Named = {
    name: string;
}

export type Created = {
    creationTimestamp: number;
}

export const ALL_PERMISSIONS = [
    'organization.delete',
    'organization.edit',
    'organization.roles.view',
    'organization.roles.create',
    'organization.roles.delete',
    'organization.roles.updatePermissions',
    'organization.members.remove',
    'organization.members.view',
    'organization.members.updateRoles',
    'organization.invites.create',
    'organization.invites.delete',
    'inventory.create',
    'inventory.view',
    'inventory.edit',
    'inventory.delete',
    'item.create',
    'item.edit',
    'item.delete',
    'item.view',
] as const;

export type Permission = typeof ALL_PERMISSIONS[number];

export type Role = {
    name: string;
    permissions: Permission[];
}

export type Country = {
    name: string;
}

export type Item = Named & Created & {
    unit: string;
    quantity: number;
}

export type Inventory = Named & Created & {
    items: Item[];
}

export type Folder = Named & Created & {
    folders: Folder[];
    inventories: Inventory[];
}

export type Member = Created & {
    roles: UUID[];
}

export type Organization = Named & Created & {
    roles: Record<UUID, Role>;
    countryCode: string;
    inviteCodes: string[];
    members: Record<UUID, Member>;
    folders: Folder[];
}

export type User = Created & {
    firstName: string;
    lastName: string;
    email: string;
    organizations: UUID[];
    hashedPassword: string;
}