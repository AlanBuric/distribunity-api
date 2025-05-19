import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import type {
  ErrorResponse,
  OrganizationLocals,
} from "../../../types/data-transfer-objects.js";
import type { Role } from "../../../types/database-types.js";
import database from "../../../services/database.js";

export async function POST(
  request: Request,
  response: Response<{ id: number } | ErrorResponse, OrganizationLocals>
): Promise<any> {
  const { name, description, permissions } = matchedData<Role>(request);

  const { rowCount } = await database.query(
    "SELECT 1 FROM role WHERE name = $1",
    [name]
  );

  if (rowCount) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Role with that name already exists" });
  }

  const {
    rows: [{ role_id }],
  } = await database.query(
    `INSERT INTO role (name, description, permissions)
     VALUES ($1, $2, $3)
     RETURNING role_id`,
    [name, description, permissions]
  );

  response.status(StatusCodes.CREATED).send(role_id);
}

export async function PATCH(
  request: Request,
  response: Response<number | ErrorResponse, OrganizationLocals>
): Promise<any> {
  const { roleId, name, description, permissions } = matchedData<
    Partial<Role> & { roleId: number }
  >(request);

  if (name) {
    const { rowCount } = await database.query(
      "SELECT 1 FROM role WHERE name = $1 AND role_id <> $2",
      [name, roleId]
    );

    if (rowCount) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: "Role with that name already exists" });
    }
  }

  const { rowCount } = await database.query(
    `UPDATE role
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         permissions = COALESCE($3, permissions)
     WHERE role_id = $4
     RETURNING role_id`,
    [name, description, permissions, roleId]
  );

  if (!rowCount) {
    return response
      .status(StatusCodes.NOT_FOUND)
      .send({ error: "Role not found" });
  }

  response.sendStatus(StatusCodes.OK);
}

export async function DELETE(
  request: Request,
  response: Response<ErrorResponse, OrganizationLocals>
): Promise<any> {
  const { roleId } = matchedData<{ roleId: number }>(request);

  const { rowCount } = await database.query(
    "DELETE FROM role WHERE role_id = $1",
    [roleId]
  );

  if (!rowCount) {
    return response.sendStatus(StatusCodes.NOT_FOUND);
  }

  response.sendStatus(StatusCodes.OK);
}
