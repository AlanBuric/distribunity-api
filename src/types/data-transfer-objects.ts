import {Organization, User} from "./database-types.js";
import {UUID} from "crypto";

export type OrganizationResponse = Omit<Organization, "folders" | "roles" | "members" | "inviteCodes"> & {
    joinDate: number;
    folders: number;
    roles: number;
    members: number;
}

export type AuthorizedLocals = {
    userId: UUID;
    user: User;
}

export type ErrorResponse = {
    error: string;
}

export type WithUUID = {
    id: UUID;
}

export type UserRegistrationRequest = Pick<User, "firstName" | "lastName" | "email"> & {
    password: string;
}

export type UserLoginRequest = {
    email: string;
    password: string;
}

export type AccessTokenResponse = {
    accessToken: string;
    expiration: number;
}

export type SelfUserView = Omit<User, "hashedPassword" | "email"> & WithUUID;
export type PublicUserView = Omit<SelfUserView, "organizations">;

export type UserLoginResponse = AccessTokenResponse & {
    user: SelfUserView
}