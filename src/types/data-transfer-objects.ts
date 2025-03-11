import type { UUID } from "node:crypto";
import type { Organization, User } from "./database-types.js";

export type InventoryParams = {
  inventoryId: UUID;
};

export type OrganizationResponse = Omit<
  Organization,
  "roles" | "members" | "inviteCodes" | "inventories" | "items"
> & {
  joinDate: number;
  inventories: number;
  members: number;
};

export type OrganizationCreationRequest = Pick<Organization, "name" | "countryCode">;

export type AuthorizedLocals = {
  userId: UUID;
  user: User;
};

export type OrganizationLocals = AuthorizedLocals & {
  organization: Organization;
};

export type ErrorResponse = {
  error: string;
};

export type WithUUID = {
  id: UUID;
};

export type UserRegistrationRequest = Pick<User, "firstName" | "lastName" | "email"> & {
  password: string;
};

export type UserLoginRequest = {
  email: string;
  password: string;
};

export type AccessTokenResponse = {
  accessToken: string;
  expiration: number;
};

export type SelfUserView = Omit<User, "hashedPassword" | "email"> & WithUUID;
export type PublicUserView = Omit<SelfUserView, "organizations">;

export type UserLoginResponse = AccessTokenResponse & {
  user: SelfUserView;
};
