import type { UUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import type {
	AuthorizedLocals,
	ErrorResponse,
	OrganizationLocals,
	OrganizationResponse,
} from "../../types/data-transfer-objects.js";
import type { Permission } from "../../types/database-types.js";
import * as UserService from "../user/service.js";
import * as OrganizationService from "./service.js";

export function requirePermission(permission: Permission) {
	return (request: Request, response: Response<any, OrganizationLocals>, next: NextFunction) => {
		const { organizationId } = matchedData(request);

		if (!response.locals.organization) {
			response.locals.organization = OrganizationService.getOrganizationById(organizationId);
		}

		if (OrganizationService.hasPermission(organizationId, response.locals.userId, permission)) {
			return next();
		}

		response.sendStatus(StatusCodes.FORBIDDEN);
	};
}

function mapToOrganizationResponse(organizationId: UUID, userId: UUID): OrganizationResponse {
	const organization = OrganizationService.getOrganizationById(organizationId);

	return {
		createdAt: organization.createdAt,
		name: organization.name,
		joinDate: organization.members[userId].createdAt,
		inventories: Object.keys(organization.inventories).length,
		members: Object.keys(organization.members).length,
		countryCode: organization.countryCode,
	};
}

export function requireUserBelongsToTargetOrganization(
	request: Request,
	response: Response<ErrorResponse, AuthorizedLocals>,
	next: NextFunction,
): any {
	const { organizationId } = matchedData(request);

	if (!response.locals.user.organizations.includes(organizationId)) {
		return response.status(StatusCodes.FORBIDDEN).send({
			error: `You're not a part of the requested organization with ID ${organizationId}`,
		});
	}

	next();
}

export function GET(
	_request: Request,
	response: Response<OrganizationResponse[], AuthorizedLocals>,
): any {
	response.send(
		UserService.getUserById(response.locals.userId).organizations.map((organizationId) =>
			mapToOrganizationResponse(organizationId, response.locals.userId),
		),
	);
}

export function GET_BY_ID(
	request: Request,
	response: Response<OrganizationResponse, AuthorizedLocals>,
): any {
	const { organizationId } = matchedData(request);
	response.send(mapToOrganizationResponse(organizationId, response.locals.userId));
}
