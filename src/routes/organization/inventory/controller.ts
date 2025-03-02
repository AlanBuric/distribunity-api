import { type UUID, randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import type {
	ErrorResponse,
	InventoryParams,
	OrganizationLocals,
} from "../../../types/data-transfer-objects.js";
import type { Inventory } from "../../../types/database-types.js";

function mapInventoryToView(inventory: Inventory) {
	const copy: Partial<Inventory> = { ...inventory };

	// biome-ignore lint/performance/noDelete: object property deletion
	delete copy.items;

	return copy;
}

export function GET(_request: Request, response: Response<any, OrganizationLocals>): any {
	response.send(
		Object.fromEntries(
			Object.entries(response.locals.organization.inventories).map(([id, inventory]) => [
				id,
				mapInventoryToView(inventory),
			]),
		),
	);
}

export function POST(
	request: Request<InventoryParams>,
	response: Response<ErrorResponse | UUID, OrganizationLocals>,
): any {
	const { name } = matchedData<{ name: string }>(request);

	if (
		Object.values(response.locals.organization.inventories)
			.map((inventory) => inventory.name)
			.includes(name)
	) {
		return response.status(StatusCodes.BAD_REQUEST).send({
			error: `Inventory with the name ${name} already exists`,
		});
	}

	const id = randomUUID();

	response.locals.organization.inventories[id] = {
		name,
		items: {},
		createdAt: Date.now(),
	};

	response.status(StatusCodes.CREATED).send(id);
}

export function GET_BY_ID(
	request: Request<InventoryParams>,
	response: Response<ErrorResponse | Inventory, OrganizationLocals>,
): any {
	const { inventoryId, name } = matchedData<{ inventoryId: UUID; name: string }>(request);
	const inventory = response.locals.organization.inventories[inventoryId];

	if (!inventory) {
		return response.status(StatusCodes.NOT_FOUND).send({
			error: `Inventory with ID ${inventoryId} not found`,
		});
	}

	response.send(inventory);
}

export function PATCH(
	request: Request<InventoryParams>,
	response: Response<ErrorResponse, OrganizationLocals>,
): any {
	const { inventoryId, name } = matchedData<{ inventoryId: UUID; name: string }>(request);
	const inventory = response.locals.organization.inventories[inventoryId];

	if (!inventory) {
		return response.status(StatusCodes.NOT_FOUND).send({
			error: `Inventory with ID ${inventoryId} not found`,
		});
	}

	inventory.name = name;

	response.sendStatus(StatusCodes.OK);
}

export function DELETE(
	request: Request<InventoryParams>,
	response: Response<ErrorResponse, OrganizationLocals>,
): any {
	const { inventoryId } = matchedData(request);

	if (!delete response.locals.organization.inventories[inventoryId]) {
		return response.status(StatusCodes.NOT_FOUND);
	}

	response.sendStatus(StatusCodes.OK);
}
