import type { Organization, User } from "./database-types.js";

export type OrganizationResponse = {
  name: string;
  countryCode: string;
};

export type AuthorizedLocals = {
  user: User;
  userId: number;
  organizationIds: number[];
};

export type OrganizationLocals = AuthorizedLocals & {
  organization: Organization;
};

export type ErrorResponse = {
  error: string;
};

export type UserRegistrationRequest = Pick<
  User,
  "firstName" | "lastName" | "email"
> & {
  password: string;
};

export type AccessTokenResponse = {
  accessToken: string;
  expiration: number;
};

export type SelfUserView = Omit<User, "hashedPassword">;
export type PublicUserView = Omit<SelfUserView, "organizations">;

export type UserLoginResponse = AccessTokenResponse & {
  user: SelfUserView;
};
