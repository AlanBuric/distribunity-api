import type { NextFunction, Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import type {
  AuthorizedLocals,
  ErrorResponse,
  OrganizationLocals,
  OrganizationSelfResponse,
} from '../../types/data-transfer-objects.js';
import type {
  Organization,
  OrganizationMember,
  Permission,
  Role,
} from '../../types/database-types.js';
import * as OrganizationService from './service.js';
import database from '../../services/database.js';
import { camelCaseify, getSqlPatchColumns } from '../../utils/database.js';
import redis from '../../services/redis.js';
import { REDIS_ORGANIZATION_MEMBERS } from '../../utils/constants.js';
import RequestError from '../../utils/RequestError.js';

type OrganizationCreationRequest = {
  name: string;
  countryCode: string;
};

export function requirePermission(permission: Permission) {
  return async (
    request: Request,
    response: Response<any, OrganizationLocals>,
    next: NextFunction,
  ) => {
    const { organizationId } = matchedData(request);

    if (!response.locals.organization) {
      response.locals.organization = await OrganizationService.getOrganizationById(organizationId);
    }

    if (
      await OrganizationService.hasPermission(organizationId, response.locals.userId, permission)
    ) {
      return next();
    }

    response.sendStatus(StatusCodes.FORBIDDEN);
  };
}

export async function requireUserBelongsToTargetOrganization(
  request: Request,
  response: Response<ErrorResponse, AuthorizedLocals>,
  next: NextFunction,
): Promise<any> {
  const { organizationId } = matchedData(request);
  const isMember = await redis.sIsMember(
    REDIS_ORGANIZATION_MEMBERS(organizationId),
    response.locals.userId.toString(),
  );

  if (!isMember) {
    return response
      .status(StatusCodes.FORBIDDEN)
      .send(`You're not a part of the requested organization with ID ${organizationId}`);
  }

  next();
}

export async function GET(_request: Request, response: Response<Organization[], AuthorizedLocals>) {
  const { rows } = await database.query(
    `SELECT *
    FROM organization
    WHERE organization_id IN (
      SELECT organization_id
      FROM organization_member
      WHERE user_id = $1
    )`,
    [response.locals.userId],
  );

  response.send(rows.map<Organization>(camelCaseify));
}

export async function GET_BY_ID(
  request: Request,
  response: Response<OrganizationSelfResponse, AuthorizedLocals>,
): Promise<any> {
  const { organizationId } = matchedData(request);

  const {
    rows: [organizationMember],
    rowCount,
  } = await database.query(
    `
    SELECT *
    FROM organization
    JOIN organization_member 
      ON organization.organization_id = organization_member.organization_id
    JOIN country
      ON organization.country_code = country.country_code
    WHERE organization.organization_id = $1
      AND organization_member.user_id = $2`,
    [organizationId, response.locals.userId],
  );

  if (!rowCount) {
    return response.sendStatus(StatusCodes.NOT_FOUND);
  }

  const { rows: roleRows } = await database.query(
    `
    SELECT role.*
    FROM organization_member_role
    JOIN role ON organization_member_role.role_id = role.role_id
    WHERE organization_member_role.organization_id = $1
      AND organization_member_role.user_id = $2`,
    [organizationId, response.locals.userId],
  );

  const roleIds = roleRows.map((role) => role.role_id);

  let permissions: number[] = [];
  let roles: Role[] = [];

  if (roleIds.length) {
    const { rows: permissionRows } = await database.query(
      `
      SELECT DISTINCT permission_id
      FROM role_permission
      WHERE role_id = ANY($1)`,
      [roleIds],
    );

    permissions = permissionRows.map((row) => row.permission_id);
    roles = roleRows.map(camelCaseify<Role>);
  }

  response.send(
    Object.assign(
      camelCaseify<Organization & OrganizationMember & { countryName: string }>(organizationMember),
      {
        roles,
        permissions,
      },
    ),
  );
}

// TODO: OrganizationAdminResponse
export async function GET_BY_ID_AS_ADMIN(
  request: Request,
  response: Response<undefined, AuthorizedLocals>,
): Promise<any> {
  response.send();
}

export async function PATCH(
  request: Request,
  response: Response<Organization, AuthorizedLocals>,
): Promise<any> {
  const { name, countryCode, organizationId } = matchedData<
    OrganizationCreationRequest & { organizationId: string }
  >(request);

  const [set, args] = getSqlPatchColumns(
    [
      ['name', name],
      ['country_code', countryCode],
    ],
    organizationId,
  );

  await database.query(`UPDATE organization SET ${set} WHERE organization_id = $3`, args);

  response.sendStatus(StatusCodes.OK);
}

export async function POST(
  request: Request,
  response: Response<Organization, AuthorizedLocals>,
): Promise<any> {
  const { name, countryCode } = matchedData<OrganizationCreationRequest>(request);

  const client = await database.connect();

  try {
    await client.query('BEGIN');
    const result = await client.query(
      `
    INSERT INTO organization (name, country_code, owner_id)
    VALUES ($1, $2, $3)
    RETURNING *`,
      [name, countryCode, response.locals.userId],
    );

    const organization = camelCaseify<Organization>(result.rows[0]);

    await client.query(
      `
      INSERT INTO organization_member (user_id, organization_id)
      VALUES ($1, $2)
      `,
      [response.locals.userId, organization.organizationId],
    );
    await client.query('COMMIT');

    redis.sAdd(
      REDIS_ORGANIZATION_MEMBERS(organization.organizationId),
      response.locals.userId.toString(),
    );
    response.send(organization);
  } catch (error) {
    await client.query('ROLLBACK');

    console.error(error);

    throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR);
  } finally {
    client.release();
  }
}
