import {Request, Response, Router} from "express";
import {handleValidationResults} from "../../middleware/validation.js";
import {AuthorizedLocals, ErrorResponse, WithUUID} from "../../../types/data-transfer-objects.js";
import {body, matchedData} from "express-validator";
import {ALL_PERMISSIONS, Role} from "../../../types/database-types.js";
import {UUID} from "crypto";
import OrganizationService from "../../organization/service.js";
import {StatusCodes} from "http-status-codes";
import {randomUUID} from "node:crypto";
import {deleteFromArray} from "../../../utils/collections.js";

function buildRoleValidator(optional?: boolean) {
    const result = [
        body("name")
            .isString()
            .withMessage("Role name must be a string")
            .isLength({min: 1})
            .withMessage("Role name must be minimally 1 character long"),
        body("description")
            .isString()
            .trim()
            .default("")
            .withMessage("Description needs to be a valid string or none"),
        body("permissions")
            .isArray()
            .withMessage("Permissions must be an array")
            .custom((input) => !ALL_PERMISSIONS.includes(input))
    ];

    if (optional) {
        result[0].optional();
        result[1].optional();
    }

    return result;
}

const RoleRouter = Router({mergeParams: true}).post("",
    buildRoleValidator(),
    handleValidationResults,
    (request: Request, response: Response<WithUUID | ErrorResponse, AuthorizedLocals>): any => {
        const {organizationId, ...role} = matchedData<Role & { organizationId: UUID }>(request);

        const organization = OrganizationService.getOrganizationById(organizationId);

        if (Object.values(organization.roles).map(role => role.name).includes(role.name)) {
            return response.status(StatusCodes.BAD_REQUEST).send({error: "Role with that name already exists"});
        }

        const roleId = randomUUID();

        organization.roles[roleId] = role;

        response.status(StatusCodes.CREATED).send({id: roleId});
    })
    .delete("/:roleId", (request: Request, response: Response<ErrorResponse, AuthorizedLocals>): any => {
        const {organizationId, roleId} = matchedData<{ organizationId: UUID, roleId: UUID }>(request);

        const organization = OrganizationService.getOrganizationById(organizationId);

        if (!delete organization.roles[roleId]) {
            return response.sendStatus(StatusCodes.NOT_FOUND);
        }

        Object.values(organization.members).forEach(member => deleteFromArray(member.roles, roleId));

        response.sendStatus(StatusCodes.OK);
    })
    .patch("/:roleId",
        buildRoleValidator(true),
        handleValidationResults,
        (request: Request, response: Response<WithUUID | ErrorResponse, AuthorizedLocals>): any => {
            const {organizationId, roleId, ...role} = matchedData<Partial<Role> & {
                organizationId: UUID,
                roleId: UUID
            }>(request);

            const organization = OrganizationService.getOrganizationById(organizationId);

            if (role.name && Object.values(organization.roles).map(role => role.name).includes(role.name)) {
                return response.status(StatusCodes.BAD_REQUEST).send({error: "Role with that name already exists"});
            }

            Object.assign(organization.roles[roleId], role);

            response.sendStatus(StatusCodes.OK);
        });

export default RoleRouter;