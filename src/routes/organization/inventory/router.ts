import {Request, Response, Router} from "express";
import {body, matchedData, param} from "express-validator";
import {handleValidationResults} from "../../middleware/validation.js";
import {AuthorizedLocals, ErrorResponse, WithUUID} from "../../../types/data-transfer-objects.js";
import {UUID} from "crypto";
import OrganizationService from "../../organization/service.js";
import {StatusCodes} from "http-status-codes";
import {MinMaxOptions} from "express-validator/lib/options.js";
import {randomUUID} from "node:crypto";

const minMaxInventoryNameLength: MinMaxOptions = {min: 1, max: 32};

const InventoryRouter = Router({mergeParams: true})
    .patch("/:inventoryId",
        param("inventoryId")
            .isUUID()
            .withMessage("Inventory ID isn't a valid UUID"),
        body("name")
            .isLength(minMaxInventoryNameLength)
            .withMessage(`Inventory name needs to be between ${minMaxInventoryNameLength.min} and ${minMaxInventoryNameLength.max} characters long`),
        handleValidationResults,
        (request: Request, response: Response<ErrorResponse, AuthorizedLocals>): any => {
            const {organizationId, inventoryId, name} = matchedData<{
                organizationId: UUID;
                inventoryId: UUID;
                name: string;
            }>(request);
            const organization = OrganizationService.getOrganizationById(organizationId);
            const inventory = organization.inventories[inventoryId];

            if (!inventory) {
                return response.status(StatusCodes.NOT_FOUND).send({error: `Inventory with ID ${inventoryId} not found`});
            }

            inventory.name = name;

            response.sendStatus(StatusCodes.OK);
        })
    .post("",
        body("name")
            .isLength(minMaxInventoryNameLength)
            .withMessage(`Inventory name needs to be between ${minMaxInventoryNameLength.min} and ${minMaxInventoryNameLength.max} characters long`),
        handleValidationResults,
        (request: Request, response: Response<ErrorResponse | WithUUID, AuthorizedLocals>): any => {
            const {organizationId, name} = matchedData<{
                organizationId: UUID;
                name: string;
            }>(request);
            const organization = OrganizationService.getOrganizationById(organizationId);

            if (Object.values(organization.inventories)
                .map(inventory => inventory.name)
                .includes(name)) {
                return response.status(StatusCodes.BAD_REQUEST).send({error: `Inventory with the name ${name} already exists`});
            }

            const id = randomUUID();

            organization.inventories[id] = {
                name,
                items: {},
                creationTimestamp: Date.now()
            }

            response.status(StatusCodes.CREATED).send({id});
        })
    .delete("/:inventoryId",
        param("inventoryId")
            .isUUID()
            .withMessage("Inventory ID isn't a valid UUID"),
        handleValidationResults,
        (request: Request, response: Response<ErrorResponse, AuthorizedLocals>): any => {
            const {organizationId, inventoryId} = matchedData(request);

            if (!delete OrganizationService.getOrganizationById(organizationId).inventories[inventoryId]) {
                return response.status(StatusCodes.NOT_FOUND);
            }

            response.sendStatus(StatusCodes.OK);
        });

export default InventoryRouter;