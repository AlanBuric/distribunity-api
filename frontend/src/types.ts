export enum LocalStorage {
  THEME = 'theme',
  LOCALE = 'locale',
  ACCESS_TOKEN = 'accessToken',
}

export const supportedThemes = ['dark', 'light'] as const;

export type Theme = (typeof supportedThemes)[number];

/**
 * https://datatracker.ietf.org/doc/html/rfc5646
 */
type LanguageTagFormat = `${Lowercase<string>}-${Uppercase<string>}`;

export const supportedLanguages: LanguageTagFormat[] = ['en-US', 'hr-HR', 'it-IT'] as const;

export type LanguageTag = (typeof supportedLanguages)[number];

export enum Permission {
  ORGANIZATION_DELETE,
  ORGANIZATION_EDIT,
  ORGANIZATION_ROLES_VIEW,
  ORGANIZATION_ROLES_CREATE,
  ORGANIZATION_ROLES_DELETE,
  ORGANIZATION_ROLES_UPDATE_PERMISSIONS,
  ORGANIZATION_MEMBERS_REMOVE,
  ORGANIZATION_MEMBERS_VIEW,
  ORGANIZATION_MEMBERS_UPDATE_ROLES,
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

export enum AuthState {
  Loading,
  LoggedIn,
  LoggedOut,
}

export type AuthUser =
  | (User & { authState: AuthState.LoggedIn })
  | { authState: AuthState.LoggedOut }
  | { authState: AuthState.Loading };

export type User = {
  userId: number;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  language: string;
  theme: string;
  email: string;
};

export type Country = {
  countryCode: string;
  countryName: string;
};

export type CurrencyFormat = {
  symbolPosition: 'before' | 'after';
  decimalSeparator: string;
  thousandSeparator: string;
  fractionDigits: number;
  symbol: string;
};

export type Organization = {
  organizationId: number;
  createdAt: string;
  upstringdAt: string;
  name: string;
  currencyFormat: CurrencyFormat;
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
  updatedAt: string;
  organizationId: number;
  name: string;
};

export type Item = {
  itemId: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  unit: string | null;
  iconUrl: string | null;
  unitPrice: number;
  attributes: Record<string, unknown>;
};

export type InventoryItem = Item & {
  inventoryId: number;
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

export type SettingsSection = {
  name: string;
  sidebarName: string;
  displayName: string;
};

export type BlogPost = {
  id: string;
  description: string;
  date: string;
  title: string;
};

export type OrganizationSelfResponse = Organization &
  OrganizationMember & { countryName: string; roles: Role[]; permissions: number[] };

export type AdaptedSelfOrganization = Omit<OrganizationSelfResponse, 'permission'> & {
  permissions: Set<number>;
};
