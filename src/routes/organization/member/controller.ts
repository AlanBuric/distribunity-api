import type { UUID } from "node:crypto";
import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import type { ErrorResponse, OrganizationLocals } from "../../../types/data-transfer-objects.js";
import RequestError from "../../../utils/RequestError.js";
import { deleteFromArray } from "../../../utils/collections.js";

export function GET(_request: Request, response: Response): any {
  response.send(response.locals.organization.members);
}

export function PATCH(
  request: Request,
  response: Response<ErrorResponse, OrganizationLocals>,
): any {
  const { roleIds, memberId } = matchedData<{
    roleIds: UUID[];
    memberId: UUID;
  }>(request);
  const member = response.locals.organization.members[memberId];

  if (!member) {
    return response
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `Member with ID ${memberId} not found` });
  }

  roleIds.forEach((roleId) => {
    if (!response.locals.organization.roles[roleId]) {
      throw new RequestError(
        StatusCodes.NOT_FOUND,
        `Role with ID ${roleId} not found in the organization`,
      );
    }
  });

  member.roles = roleIds;

  response.sendStatus(StatusCodes.OK);
}

export function DELETE(
  request: Request,
  response: Response<ErrorResponse, OrganizationLocals>,
): any {
  const { organizationId, memberId } = matchedData(request);

  if (
    !deleteFromArray(response.locals.user.organizations, organizationId) ||
    !delete response.locals.organization.members[memberId]
  ) {
    return response.status(StatusCodes.NOT_FOUND);
  }

  response.sendStatus(StatusCodes.OK);
}
