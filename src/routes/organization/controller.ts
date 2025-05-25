import type { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import type {
  AuthorizedLocals,
  ErrorResponse,
  OrganizationLocals,
  OrganizationResponse,
} from "../../types/data-transfer-objects.js";
import type { Organization, Permission } from "../../types/database-types.js";
import * as OrganizationService from "./service.js";
import database from "../../services/database.js";
import { camelCaseify, getSqlPatchColumns } from "../../utils/database.js";
import redis from "../../services/redis.js";
import { REDIS_ORGANIZATION_MEMBERS } from "../../utils/constants.js";
import RequestError from "../../utils/RequestError.js";

type OrganizationCreationRequest = {
  name: string;
  countryCode: string;
};

export function requirePermission(permission: Permission) {
  return async (
    request: Request,
    response: Response<any, OrganizationLocals>,
    next: NextFunction
  ) => {
    const { organizationId } = matchedData(request);

    if (!response.locals.organization) {
      response.locals.organization =
        await OrganizationService.getOrganizationById(organizationId);
    }

    if (
      await OrganizationService.hasPermission(
        organizationId,
        response.locals.userId,
        permission
      )
    ) {
      return next();
    }

    response.sendStatus(StatusCodes.FORBIDDEN);
  };
}

export async function requireUserBelongsToTargetOrganization(
  request: Request,
  response: Response<ErrorResponse, AuthorizedLocals>,
  next: NextFunction
): Promise<any> {
  const { organizationId } = matchedData(request);
  const isMember = await redis.sIsMember(
    REDIS_ORGANIZATION_MEMBERS(organizationId),
    response.locals.userId.toString()
  );

  if (!isMember) {
    return response
      .status(StatusCodes.FORBIDDEN)
      .send(
        `You're not a part of the requested organization with ID ${organizationId}`
      );
  }

  next();
}

export async function GET(
  _request: Request,
  response: Response<OrganizationResponse[], AuthorizedLocals>
) {
  const { rows } = await database.query(
    `SELECT *
    FROM organization_member
    JOIN organization USING (organization_id)
    WHERE user_id = $1;`,
    [response.locals.userId]
  );

  response.send(rows.map<OrganizationResponse>(camelCaseify));
}

export async function GET_BY_ID(
  request: Request,
  response: Response<OrganizationResponse, AuthorizedLocals>
): Promise<any> {
  const { organizationId } = matchedData(request);

  const {
    rows: [organization],
    rowCount,
  } = await database.query(
    `
    SELECT *
    FROM organization
    JOIN organization_member 
      ON organization.organization_id = organization_member.organization_id
    WHERE organization.organization_id = $1
      AND organization_member.user_id = $2
    `,
    [organizationId, response.locals.userId]
  );

  if (!rowCount) {
    return response.sendStatus(StatusCodes.NOT_FOUND);
  }

  response.send(camelCaseify<OrganizationResponse>(organization));
}

export async function PATCH(
  request: Request,
  response: Response<Organization, AuthorizedLocals>
): Promise<any> {
  const { name, countryCode, organizationId } = matchedData<
    OrganizationCreationRequest & { organizationId: string }
  >(request);

  const [set, args] = getSqlPatchColumns(
    [
      ["name", name],
      ["country_code", countryCode],
    ],
    organizationId
  );

  await database.query(
    `UPDATE organization SET ${set} WHERE organization_id = $3`,
    args
  );

  response.sendStatus(StatusCodes.OK);
}

export async function POST(
  request: Request,
  response: Response<Organization, AuthorizedLocals>
): Promise<any> {
  const { name, countryCode } =
    matchedData<OrganizationCreationRequest>(request);

  const client = await database.connect();

  try {
    await client.query("BEGIN");
    const result = await client.query(
      `
    INSERT INTO organization (name, country_code, owner_id)
    VALUES ($1, $2, $3)
    RETURNING *;`,
      [name, countryCode, response.locals.userId]
    );

    const organization = camelCaseify<Organization>(result.rows[0]);

    await client.query(
      `
      INSERT INTO organization_member (user_id, organization_id)
      VALUES ($1, $2)
      `,
      [response.locals.userId, organization.organizationId]
    );
    await client.query("COMMIT");

    redis.sAdd(
      REDIS_ORGANIZATION_MEMBERS(organization.organizationId),
      response.locals.userId.toString()
    );
    response.send(organization);
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR);
  } finally {
    client.release();
  }
}
