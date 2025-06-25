import type { DbOrganization, OrganizationMember, Role, DbUser } from './database-types.js';

export interface CurrencyFormat {
  symbolPosition: 'before' | 'after';
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

export type UserLoginResponse = AccessTokenResponse & {
  user: UserView;
};
