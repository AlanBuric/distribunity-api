import { StatusCodes } from "http-status-codes";
import type { Organization, Permission } from "../../types/database-types.js";
import RequestError from "../../utils/RequestError.js";
import database from "../../database/database.js";
import { camelCaseify } from "../../utils/database.js";

export async function getOrganizationById(id: string): Promise<Organization> {
  const organizations = await database.query(
    "SELECT * FROM organization WHERE organization_id = $1",
    [id]
  );

  if (organizations.rowCount == 0) {
    throw new RequestError(
      StatusCodes.NOT_FOUND,
      `Organization with ID ${id} not found`
    );
  }

  return camelCaseify(organizations.rows[0]);
}

export async function hasPermission(
  organizationId: string,
  userId: number,
  permission: Permission
): Promise<boolean> {
  const result = await database.query(
    `SELECT 1
     FROM organization_member_role omr
     JOIN role_permission rp ON omr.role_id = rp.role_id
     JOIN permission p ON rp.permission_id = p.id
     WHERE omr.user_id = $1
       AND omr.organization_id = $2
       AND p.name = $3
     LIMIT 1;`,
    [userId, organizationId, permission]
  );

  return !!result.rowCount;
}
