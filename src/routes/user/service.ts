import type { UUID } from "node:crypto";
import { randomUUID } from "node:crypto";
import { StatusCodes } from "http-status-codes";
import getDatabase from "../../database/database.js";
import type { UserRegistrationRequest } from "../../types/data-transfer-objects.js";
import type { User } from "../../types/database-types.js";
import RequestError from "../../utils/RequestError.js";
import * as SessionService from "../session/service.js";

export async function registerUser(registration: UserRegistrationRequest): Promise<UUID> {
	const exists = await getUserByEmail(registration.email)
		.then(() => true)
		.catch(() => false);

	if (exists) {
		throw new RequestError(
			StatusCodes.BAD_REQUEST,
			`E-mail ${registration.email} is already taken`,
		);
	}

	const hashedPassword = await SessionService.hashPassword(registration.password);
	const id = randomUUID();

	await getDatabase().update(({ users }) => {
		users[id] = {
			creationTimestamp: Date.now(),
			firstName: registration.firstName,
			lastName: registration.lastName,
			email: registration.email,
			organizations: [],
			hashedPassword,
		};
	});

	return id;
}

export function getUserById(id: UUID): User {
	const user = getDatabase().data.users[id];

	if (!user) {
		throw new RequestError(StatusCodes.NOT_FOUND, `User with ID ${id} not found`);
	}

	return user;
}

export async function getUserByEmail(email: string): Promise<[UUID, User]> {
	const entry = Object.entries(getDatabase().data.users).find(([, user]) => user.email === email);

	if (!entry) {
		throw new RequestError(StatusCodes.NOT_FOUND, `User with email ${email} not found`);
	}

	return entry as [UUID, User];
}
