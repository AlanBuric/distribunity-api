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

export function requireUserBelongsToTargetOrganization(
  request: Request,
  response: Response<ErrorResponse, AuthorizedLocals>,
  next: NextFunction
): any {
  const { organizationId } = matchedData(request);

  if (!response.locals.organizationIds.includes(organizationId)) {
    return response
      .status(StatusCodes.FORBIDDEN)
      .send(
        `You're not a part of the requested organization with ID ${organizationId}`
      );
  }

  next();
}

// TODO: this belongs to the organization member route
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

export function GET_BY_ID(
  request: Request,
  response: Response<OrganizationResponse, AuthorizedLocals>
): any {
  const { organizationId } = matchedData(request);
  response.send();
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

    response.send(organization);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
