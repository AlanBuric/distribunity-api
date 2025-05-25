import type {
  Organization,
  OrganizationMember,
  User,
} from "./database-types.js";

export type OrganizationResponse = Organization & OrganizationMember;

export type AuthorizedLocals = {
  user: User;
  userId: number;
  organizationIds: number[];
};

export type OrganizationLocals = AuthorizedLocals & {
  organization: Organization;
};

export type ErrorResponse = string;

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
