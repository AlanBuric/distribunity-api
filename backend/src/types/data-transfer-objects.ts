import type { DbOrganization, OrganizationMember, Role, DbUser } from './database-types.js';

export interface CurrencyFormat {
  isSymbolBefore: boolean;
  decimalSeparator: string;
  thousandSeparator: string;
  fractionDigits: number;
  symbol: string;
}

export type Organization = Omit<DbOrganization, 'currencyFormat'> & {
  currencyFormat: CurrencyFormat;
};

/**
 * Returns the organization with the information of the organization member that requested this data.
 */
export type OrganizationSelfResponse = DbOrganization &
  OrganizationMember & { countryName: string; roles: Role[]; permissions: number[] };

export type AuthorizedLocals = { userId: number };

export type OrganizationLocals = AuthorizedLocals & {
  organization: Organization;
};

export type ErrorResponse = string;

export type UserRegistrationRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type AccessTokenResponse = {
  accessToken: string;
  expiration: number;
};

export type UserView = Omit<DbUser, 'passwordHash'>;

export type PageResponse<T> = {
  total: number;
  data: T[];
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

export type BlogPostCreate = {
  title: string;
  description: string;
  content: string;
  isDraft: boolean;
  showAuthor: boolean;
};

export type BlogPostUpdate = Partial<BlogPostCreate> & { blogPostId: number };
