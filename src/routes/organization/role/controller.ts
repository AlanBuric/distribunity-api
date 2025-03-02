import { type UUID, randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import type {
	ErrorResponse,
	OrganizationLocals,
	WithUUID,
} from "../../../types/data-transfer-objects.js";
import type { Role } from "../../../types/database-types.js";
import { deleteFromArray } from "../../../utils/collections.js";

export function POST(
	request: Request,
	response: Response<WithUUID | ErrorResponse, OrganizationLocals>,
): any {
	const { organizationId, ...role } = matchedData<Role & { organizationId: UUID }>(request);

	if (
		Object.values(response.locals.organization.roles)
			.map((role) => role.name)
			.includes(role.name)
	) {
		return response
			.status(StatusCodes.BAD_REQUEST)
			.send({ error: "Role with that name already exists" });
	}

	const roleId = randomUUID();

	response.locals.organization.roles[roleId] = role;

	response.status(StatusCodes.CREATED).send({ id: roleId });
}

export function PATCH(
	request: Request,
	response: Response<WithUUID | ErrorResponse, OrganizationLocals>,
): any {
	const { organizationId, roleId, ...role } = matchedData<
		Partial<Role> & {
			organizationId: UUID;
			roleId: UUID;
		}
	>(request);

	if (
		role.name &&
		Object.values(response.locals.organization.roles)
			.map((role) => role.name)
			.includes(role.name)
	) {
		return response
			.status(StatusCodes.BAD_REQUEST)
			.send({ error: "Role with that name already exists" });
	}

	Object.assign(response.locals.organization.roles[roleId], role);

	response.sendStatus(StatusCodes.OK);
}

export function DELETE(
	request: Request,
	response: Response<ErrorResponse, OrganizationLocals>,
): any {
	const { roleId } = matchedData<{
		roleId: UUID;
	}>(request);

	if (!delete response.locals.organization.roles[roleId]) {
		return response.sendStatus(StatusCodes.NOT_FOUND);
	}

	Object.values(response.locals.organization.members).forEach((member) =>
		deleteFromArray(member.roles, roleId),
	);

	response.sendStatus(StatusCodes.OK);
}
