import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import database from "../../../services/database.js";
import type {
  ErrorResponse,
  OrganizationLocals,
} from "../../../types/data-transfer-objects.js";
import type { Inventory } from "../../../types/database-types.js";
import { camelCaseify } from "../../../utils/database.js";

async function checkIsInventoryNameTaken(
  organizationId: number,
  name: string,
  response: Response
) {
  const { rowCount } = await database.query(
    "SELECT 1 FROM inventory WHERE organization_id = $1 AND name = $2",
    [organizationId, name]
  );

  if (rowCount) {
    response.status(StatusCodes.BAD_REQUEST).send({
      error: `Inventory with the name ${name} already exists`,
    });

    return true;
  }

  return false;
}

export async function GET(
  _request: Request,
  response: Response<Inventory[], OrganizationLocals>
) {
  const { rows } = await database.query(
    "SELECT * FROM inventory WHERE organization_id = $1",
    [response.locals.organization.organizationId]
  );

  response.send(rows.map<Inventory>(camelCaseify));
}

export async function POST(
  request: Request,
  response: Response<ErrorResponse | number, OrganizationLocals>
) {
  const { name } = matchedData<{ name: string }>(request);
  const organizationId = response.locals.organization.organizationId;

  if (await checkIsInventoryNameTaken(organizationId, name, response)) return;

  const result = await database.query(
    `INSERT INTO inventory (organization_id, name)
     VALUES ($1, $2)
     RETURNING inventory_id`,
    [organizationId, name]
  );

  response.status(StatusCodes.CREATED).send(result.rows[0].inventory_id);
}

type InventoryParams = {
  inventoryId: number;
};

type InventoryPatch = InventoryParams & {
  name: string;
};

export async function GET_BY_ID(
  request: Request,
  response: Response<ErrorResponse | Inventory, OrganizationLocals>
): Promise<any> {
  const { inventoryId } = matchedData<InventoryParams>(request);
  const organizationId = response.locals.organization.organizationId;

  const { rows } = await database.query(
    "SELECT * FROM inventory WHERE inventory_id = $1 AND organization_id = $2",
    [inventoryId, organizationId]
  );

  const inventory = rows[0];

  if (!inventory) {
    return response.status(StatusCodes.NOT_FOUND);
  }

  response.send(camelCaseify<Inventory>(inventory));
}

export async function PATCH(
  request: Request,
  response: Response<ErrorResponse, OrganizationLocals>
): Promise<any> {
  const { inventoryId, name } = matchedData<InventoryPatch>(request);
  const organizationId = response.locals.organization.organizationId;

  if (await checkIsInventoryNameTaken(organizationId, name, response)) return;

  // TODO: merge upper check into WHERE clause "inventory_id <> $4" and just return name taken instead of not found
  const result = await database.query(
    "UPDATE inventory SET name = $1 WHERE inventory_id = $2 AND organization_id = $3 RETURNING *",
    [name, inventoryId, organizationId]
  );

  if (!result.rowCount) {
    return response.status(StatusCodes.NOT_FOUND);
  }

  response.sendStatus(StatusCodes.OK);
}

export async function DELETE(
  request: Request,
  response: Response<ErrorResponse, OrganizationLocals>
): Promise<any> {
  const { inventoryId } = matchedData<InventoryParams>(request);
  const organizationId = response.locals.organization.organizationId;

  const result = await database.query(
    "DELETE FROM inventory WHERE inventory_id = $1 AND organization_id = $2",
    [inventoryId, organizationId]
  );

  if (!result.rowCount) {
    return response.status(StatusCodes.NOT_FOUND);
  }

  response.sendStatus(StatusCodes.OK);
}
