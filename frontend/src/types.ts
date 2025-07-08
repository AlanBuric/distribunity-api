export enum LocalStorage {
  THEME = 'theme',
  LANGUAGE = 'locale',
  ACCESS_TOKEN = 'accessToken',
}

export const supportedThemes = ['dark', 'light'] as const;

export type Theme = (typeof supportedThemes)[number];

/**
 * https://datatracker.ietf.org/doc/html/rfc5646
 */
type LanguageTagFormat = `${Lowercase<string>}-${Uppercase<string>}`;

export const supportedLanguages = [
  'en-US',
  'hr-HR',
  'it-IT',
] as const satisfies LanguageTagFormat[];

export type LanguageTag = (typeof supportedLanguages)[number];

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
  isAppAdmin: boolean;
  firstName: string;
  lastName: string;
  language: LanguageTag;
  theme: Theme;
  email: string;
};

export type Country = {
  countryCode: string;
  countryName: string;
};

export type CurrencyFormat = {
  isSymbolBefore: boolean;
  decimalSeparator: string;
  thousandSeparator: string;
  fractionDigits: number;
  symbol: string;
};

export type Organization = {
  organizationId: number;
  createdAt: string;
  updatedAt: string;
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

type BlogPostCommons = {
  blogPostId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

// Blog posts from the non-admin's view
export type PublishedBlogPostPreview = BlogPostCommons & {
  authorName?: string;
};

export type PublishedBlogPost = PublishedBlogPostPreview & {
  content: string;
};

// Blog posts from the admin's view
export type FullBlogPostPreview = BlogPostCommons & {
  authorName: string;
  isDraft: boolean;
};

export type FullBlogPost = FullBlogPostPreview & {
  content: string;
};

export type OrganizationSelfResponse = Organization &
  OrganizationMember & { countryName: string; roles: Role[]; permissions: number[] };

export type AdaptedSelfOrganization = Omit<OrganizationSelfResponse, 'permission'> & {
  permissions: Set<number>;
};

export type PageResponse<T> = {
  total: number;
  data: T[];
};
