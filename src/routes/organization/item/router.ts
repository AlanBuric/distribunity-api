import type { UUID } from "node:crypto";
import { randomUUID } from "node:crypto";
import { type Request, type Response, Router } from "express";
import { body, matchedData, param } from "express-validator";
import type { MinMaxOptions } from "express-validator/lib/options.js";
import { StatusCodes } from "http-status-codes";
import type {
	AuthorizedLocals,
	ErrorResponse,
	WithUUID,
} from "../../../types/data-transfer-objects.js";
import type { Created, Item } from "../../../types/database-types.js";
import { handleValidationResults } from "../../middleware/validation.js";
import * as OrganizationService from "../../organization/service.js";

const minMaxItemNameLength: MinMaxOptions = { min: 1, max: 32 };
const maxUnitNameLength: MinMaxOptions = { max: 32 };

const itemValidatorChain = [
	body("name")
		.isLength(minMaxItemNameLength)
		.withMessage(
			`Item name needs to be between ${minMaxItemNameLength.min} and ${minMaxItemNameLength.max} characters long`,
		),
	body("unit")
		.default("")
		.isLength({ max: 32 })
		.withMessage(`Item unit needs to be at most ${maxUnitNameLength.max} characters long`),
	body("iconURL").default("").isURL().withMessage("Icon URL isn't a valid URL"),
	body("unitPrice")
		.default(0)
		.isFloat({ min: 0 })
		.withMessage("Unit price must be at least 0")
		.toFloat(),
	body("attributes")
		.default([])
		.isArray()
		.withMessage("Attributes must be a valid array")
		.toArray(),
];

const ItemRouter = Router({ mergeParams: true })
	.patch(
		"/:itemId",
		param("itemId").isUUID().withMessage("Item ID isn't a valid UUID"),
		itemValidatorChain,
		handleValidationResults,
		(request: Request, response: Response<ErrorResponse, AuthorizedLocals>): any => {
			const { organizationId, itemId, name } = matchedData<{
				inventoryId: UUID;
				organizationId: UUID;
				itemId: UUID;
				name: string;
			}>(request);
			const organization = OrganizationService.getOrganizationById(organizationId);
			const item = organization.items[itemId];

			if (!item) {
				return response
					.status(StatusCodes.NOT_FOUND)
					.send({ error: `Item with ID ${itemId} not found` });
			}

			item.name = name;

			response.sendStatus(StatusCodes.OK);
		},
	)
	.post(
		"",
		itemValidatorChain,
		handleValidationResults,
		(request: Request, response: Response<ErrorResponse | WithUUID, AuthorizedLocals>): any => {
			const { organizationId, inventoryId, ...item } = matchedData<
				{
					organizationId: UUID;
					inventoryId: UUID;
				} & Exclude<Item, keyof Created>
			>(request);
			const organization = OrganizationService.getOrganizationById(organizationId);

			if (
				Object.values(organization.inventories)
					.map((inventory) => inventory.name)
					.includes(item.name)
			) {
				return response.status(StatusCodes.BAD_REQUEST).send({
					error: `Inventory with the name ${item.name} already exists`,
				});
			}

			const id = randomUUID();

			organization.items[id] = {
				...item,
				creationTimestamp: Date.now(),
			};

			response.status(StatusCodes.CREATED).send({ id });
		},
	)
	.delete(
		"/:itemId",
		param("itemId").isUUID().withMessage("Item ID isn't a valid UUID"),
		handleValidationResults,
		(request: Request, response: Response<ErrorResponse, AuthorizedLocals>): any => {
			const { organizationId, itemId } = matchedData(request);

			if (!delete OrganizationService.getOrganizationById(organizationId).items[itemId]) {
				return response.status(StatusCodes.NOT_FOUND);
			}

			response.sendStatus(StatusCodes.OK);
		},
	);

export default ItemRouter;
