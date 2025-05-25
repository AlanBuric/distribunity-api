import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import type {
  ErrorResponse,
  OrganizationLocals,
} from "../../../types/data-transfer-objects.js";
import database from "../../../services/database.js";
import type { OrganizationMember } from "../../../types/database-types.js";
import { camelCaseify } from "../../../utils/database.js";
import redis from "../../../services/redis.js";
import { REDIS_ORGANIZATION_MEMBERS } from "../../../utils/constants.js";

export async function GET(
  _request: Request,
  response: Response<OrganizationMember[], OrganizationLocals>
): Promise<any> {
  const { rows } = await database.query(
    "SELECT * FROM organization_member WHERE organization_id = $1",
    [response.locals.organization.organizationId]
  );

  response.send(rows.map<OrganizationMember>(camelCaseify));
}

export async function PATCH(
  request: Request,
  response: Response<ErrorResponse, OrganizationLocals>
): Promise<any> {
  const { roleIds, userId } = matchedData<{
    roleIds: number[];
    userId: number;
  }>(request);
  const organizationId = response.locals.organization.organizationId;

  await database.query(
    `INSERT INTO organization_member_role (user_id, organization_id, role_id)
    SELECT $1, $2, UNNEST($3::bigint[])
    ON CONFLICT DO NOTHING;`,
    [userId, organizationId, roleIds]
  );

  response.sendStatus(StatusCodes.OK);
}

// TODO: the member with permission or the member themselves can only invoke this
export async function DELETE(
  request: Request,
  response: Response<ErrorResponse, OrganizationLocals>
): Promise<any> {
  const { userId, organizationId } = matchedData<{
    userId: number;
    organizationId: number;
  }>(request);
  const { rowCount } = await database.query(
    "DELETE FROM member WHERE user_id = $1",
    [userId]
  );

  if (rowCount) {
    redis.sRem(REDIS_ORGANIZATION_MEMBERS(organizationId), userId.toString());
    return response.sendStatus(StatusCodes.OK);
  }

  response.sendStatus(StatusCodes.NOT_FOUND);
}
