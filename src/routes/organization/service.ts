import type { UUID } from "node:crypto";
import { StatusCodes } from "http-status-codes";
import getDatabase from "../../database/database.js";
import type { Member, Organization, Permission } from "../../types/database-types.js";
import RequestError from "../../utils/RequestError.js";

export function getOrganizationById(id: UUID): Organization {
  const organization = getDatabase().data.organizations[id];

  if (!organization) {
    throw new RequestError(StatusCodes.NOT_FOUND, `Organization with ID ${id} not found`);
  }

  return organization;
}

export function hasPermission(
  organization: Organization,
  userId: UUID,
  permission: Permission,
): boolean {
  return (
    organization.members[userId].roles.find((roleId) =>
      organization.roles[roleId].permissions.includes(permission),
    ) != null
  );
}
