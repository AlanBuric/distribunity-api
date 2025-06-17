import type { OrganizationSelfResponse } from '@backend-types/data-transfer-objects';
import type { User } from '@backend-types/database-types';

export type Named = {
  name: string;
};

export enum Permission {
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
}

export type Role = Named & {
  permissions: Permission[];
};

export enum AuthState {
  Loading,
  LoggedIn,
  LoggedOut,
}

export type AuthUser =
  | (User & { authState: AuthState.LoggedIn })
  | { authState: AuthState.Loading | AuthState.LoggedOut };

export type MemberVuefire = {
  id: string;
  roles: string[];
  joined: number;
};

export type Item = Named & {
  unitPrice: number;
  unit: string;
  attributes: string;
  iconURL: string;
  quantity: number;
};

export enum ColumnType {
  ICON_URL = 'ICON',
  ATTRIBUTES = 'ATTRIBUTES',
  NAME = 'NAME',
  QUANTITY = 'QUANTITY',
  UNIT = 'UNIT',
  UNIT_PRICE = 'UNIT_PRICE',
  TOTAL_PRICE = 'TOTAL_PRICE',
}

export type Inventory = Named & {
  id: number;
  items: Item[];
};

export type CountryData = {
  countryCode: string;
  country: string;
};

export type Organization = CountryData & {
  invites: string[];
  name: string;
  organizationId: number;
  ownerId: number;
};

export type SettingsSection = Named & {
  sidebarName: string;
  displayName: string;
};

export type BlogPost = {
  id: string;
  description: string;
  date: Date;
  title: string;
};

export type RestCountriesCountryName = {
  common: string;
  official: string;
  nativeName: Record<
    string,
    {
      official: string;
      common: string;
    }
  >;
};

export type RestCountriesCountry = {
  name: RestCountriesCountryName;
  cca3: string;
  independent: boolean;
};

export type OrganizationInfo = Omit<OrganizationSelfResponse, 'permissions'> & {
  permissions: Set<number>;
};
