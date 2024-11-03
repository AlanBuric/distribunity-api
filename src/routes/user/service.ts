import getDatabase from "../../database/database.js";
import RequestError from "../../utils/RequestError.js";
import {StatusCodes} from "http-status-codes";
import {UUID} from "crypto";
import {User} from "../../types/database-types.js";
import {UserRegistrationRequest} from "../../types/data-transfer-objects.js";
import {randomUUID} from "node:crypto";
import SessionService from "../session/service.js";

export default class UserService {
    public static async registerUser(registration: UserRegistrationRequest) {
        UserService.getUserByEmail(registration.email).then(() => Promise.reject(new RequestError(StatusCodes.BAD_REQUEST, `E-mail ${registration.email} is already taken`))).catch(() => {});

        const hashedPassword = await SessionService.hashPassword(registration.password);

        return getDatabase().update(({users}) => {
            users[randomUUID()] = {
                creationTimestamp: Date.now(),
                firstName: registration.firstName,
                lastName: registration.lastName,
                email: registration.email,
                organizations: [],
                hashedPassword
            };
        });
    }

    public static getUserById(id: UUID): User {
        const user = getDatabase().data.users[id];

        if (!user) {
            throw new RequestError(StatusCodes.NOT_FOUND, `User with ID ${id} not found`);
        }

        return user;
    }

    public static async getUserByEmail(email: string): Promise<[UUID, User]> {
        const entry = Object.entries(getDatabase().data.users).find(([, user]) => user.email === email);

        if (!entry) {
            throw new RequestError(StatusCodes.NOT_FOUND, `User with email ${email} not found`);
        }

        return entry as [UUID, User];
    }
}