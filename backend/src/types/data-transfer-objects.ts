import type { Organization, OrganizationMember, Role, User } from './database-types.js';

/**
 * Returns the organization with the information of the organization member that requested this data.
 */
export type OrganizationSelfResponse = Organization &
  OrganizationMember & { countryName: string; roles: Role[]; permissions: number[] };

export type AuthorizedLocals = {
  userId: number;
  organizationIds: number[];
};

export type OrganizationLocals = AuthorizedLocals & {
  organization: Organization;
};

export type ErrorResponse = string;

export type UserRegistrationRequest = Pick<User, 'firstName' | 'lastName' | 'email'> & {
  password: string;
};

export type AccessTokenResponse = {
  accessToken: string;
  expiration: number;
};

export type SelfUserView = Omit<User, 'passwordHash'>;

export type UserLoginResponse = AccessTokenResponse & {
  user: SelfUserView;
};
