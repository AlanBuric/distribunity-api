import { randomUUID, type UUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import type {
  AuthorizedLocals,
  ErrorResponse,
  OrganizationCreationRequest,
  OrganizationLocals,
  OrganizationResponse,
} from "../../types/data-transfer-objects.js";
import type { Organization, Permission } from "../../types/database-types.js";
import * as UserService from "../user/service.js";
import * as OrganizationService from "./service.js";
import getDatabase from "../../database/database.js";

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

function mapToOrganizationResponse(organization: Organization, userId: UUID): OrganizationResponse {
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
      mapToOrganizationResponse(
        OrganizationService.getOrganizationById(organizationId),
        response.locals.userId,
      ),
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

export function PATCH(request: Request, response: Response<Organization, AuthorizedLocals>): any {
  const { name, countryCode, organizationId } = matchedData<
    OrganizationCreationRequest & { organizationId: UUID }
  >(request);
  const organization = getDatabase().data.organizations[organizationId];

  Object.assign(organization, { name, countryCode });
  response.sendStatus(StatusCodes.OK);
}

export function POST(request: Request, response: Response<Organization, AuthorizedLocals>): any {
  const { name, countryCode } = matchedData<OrganizationCreationRequest>(request);
  const organizationId = randomUUID();
  const createdAt = Date.now();

  const organization = (getDatabase().data.organizations[organizationId] = {
    name,
    createdAt,
    roles: {},
    members: {
      [response.locals.userId]: {
        createdAt,
        profilePhotoUrl: "",
        roles: [],
      },
    },
    countryCode,
    invitations: {},
    inventories: {},
    items: {},
  });

  response.locals.user.organizations.push(organizationId);
  response.send(organization);
}

export function POST_JOIN(
  request: Request,
  response: Response<OrganizationResponse, OrganizationLocals>,
): any {
  const { organizationId } = matchedData<{ organizationId: UUID }>(request);

  if (!response.locals.organization) {
    response.locals.organization = OrganizationService.getOrganizationById(organizationId);
  }

  if (delete response.locals.organization.invitations[response.locals.userId]) {
    response.locals.user.organizations.push(organizationId);
    response.locals.organization.members[response.locals.userId] = {
      profilePhotoUrl: "",
      createdAt: Date.now(),
      roles: [],
    };

    return response
      .status(StatusCodes.CREATED)
      .send(mapToOrganizationResponse(response.locals.organization, response.locals.userId));
  }
}
