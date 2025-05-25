import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import database from "../../services/database.js";
import type {
  OrganizationResponse,
  ErrorResponse,
  OrganizationLocals,
  AuthorizedLocals,
} from "../../types/data-transfer-objects.js";
import type { Invitation } from "../../types/database-types.js";
import { camelCaseify } from "../../utils/database.js";
import getLoggingPrefix from "../../utils/logging.js";
import RequestError from "../../utils/RequestError.js";
import redis from "../../services/redis.js";
import { REDIS_ORGANIZATION_MEMBERS } from "../../utils/constants.js";

export async function GET(
  _request: Request,
  response: Response<Invitation[], AuthorizedLocals>
) {
  const { rows } = await database.query(
    `
    SELECT *
    FROM invitation
    WHERE invited_email = (
      SELECT email FROM "user" WHERE user_id = $1
    )`,
    [response.locals.userId]
  );

  response.send(rows.map<Invitation>(camelCaseify));
}

export async function POST(
  request: Request,
  response: Response<OrganizationResponse | ErrorResponse, OrganizationLocals>
): Promise<any> {
  const { invitationToken, isAccepting } = matchedData<{
    invitationToken: string;
    isAccepting: boolean;
  }>(request);

  const client = await database.connect();

  try {
    await client.query("BEGIN");

    const {
      rows: [invitation],
      rowCount,
    } = await client.query(
      `UPDATE invitation
       SET status = $1
       WHERE token = $2 AND status = 'pending'
       RETURNING *;`,
      [isAccepting ? "accepted" : "rejected", invitationToken]
    );

    if (!rowCount) {
      client.query("ROLLBACK");

      return response
        .status(StatusCodes.NOT_FOUND)
        .send("Invitation not found or already used.");
    }

    const invite = camelCaseify<Invitation>(invitation);

    if (isAccepting) {
      await client.query(
        `INSERT INTO organization_member (user_id, organization_id)
         VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
        [response.locals.userId, invite.organizationId]
      );

      const {
        rows: [organization],
        rowCount,
      } = await client.query(
        `SELECT organization_id, name, country_code
         FROM organization
         WHERE organization_id = $1`,
        [invite.organizationId]
      );

      client.query("COMMIT");

      if (!rowCount) {
        return response
          .status(StatusCodes.NOT_FOUND)
          .send("Organization not found.");
      }

      redis.sAdd(
        REDIS_ORGANIZATION_MEMBERS(invite.organizationId),
        response.locals.userId.toString()
      );

      return response
        .status(StatusCodes.CREATED)
        .send(camelCaseify<OrganizationResponse>(organization));
    }

    client.query("COMMIT");

    response.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    client.query("ROLLBACK");

    console.error(
      `${getLoggingPrefix()} Error occurred while accepting user invite`,
      error
    );

    throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR);
  } finally {
    client.release();
  }
}
