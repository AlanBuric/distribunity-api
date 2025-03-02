import type { UUID } from "node:crypto";
import { randomUUID } from "node:crypto";
import { type Request, type Response, Router } from "express";
import { body, matchedData, param } from "express-validator";
import type { MinMaxOptions } from "express-validator/lib/options.js";
import { StatusCodes } from "http-status-codes";
import type {
  ErrorResponse,
  OrganizationLocals,
  WithUUID,
} from "../../../types/data-transfer-objects.js";
import type { CreatedAt, Item } from "../../../types/database-types.js";

export function PATCH(
  request: Request,
  response: Response<ErrorResponse, OrganizationLocals>,
): any {
  const { itemId, name } = matchedData<{
    inventoryId: UUID;
    itemId: UUID;
    name: string;
  }>(request);
  const item = response.locals.organization.items[itemId];

  if (!item) {
    return response
      .status(StatusCodes.NOT_FOUND)
      .send({ error: `Item with ID ${itemId} not found` });
  }

  item.name = name;

  response.sendStatus(StatusCodes.OK);
}

export function POST(
  request: Request,
  response: Response<ErrorResponse | WithUUID, OrganizationLocals>,
): any {
  const { inventoryId, ...item } = matchedData<
    { inventoryId: UUID } & Exclude<Item, keyof CreatedAt>
  >(request);

  if (
    Object.values(response.locals.organization.inventories)
      .map((inventory) => inventory.name)
      .includes(item.name)
  ) {
    return response.status(StatusCodes.BAD_REQUEST).send({
      error: `Inventory with the name ${item.name} already exists`,
    });
  }

  const id = randomUUID();

  response.locals.organization.items[id] = {
    ...item,
    createdAt: Date.now(),
  };

  response.status(StatusCodes.CREATED).send({ id });
}

export function DELETE(
  request: Request,
  response: Response<ErrorResponse, OrganizationLocals>,
): any {
  const { itemId } = matchedData(request);

  if (!delete response.locals.organization.items[itemId]) {
    return response.status(StatusCodes.NOT_FOUND);
  }

  response.sendStatus(StatusCodes.OK);
}
