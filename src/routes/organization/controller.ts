import {NextFunction, Request, Response, Router} from "express";
import {AuthorizedLocals, ErrorResponse, OrganizationResponse, WithUUID} from "../../types/data-transfer-objects.js";
import UserService from "../user/service.js";
import OrganizationService from "./service.js";
import {body, matchedData, param} from "express-validator";
import {handleValidationResults} from "../middleware/validation.js";
import {UUID} from "crypto";
import {StatusCodes} from "http-status-codes";
import RequestError from "../../utils/RequestError.js";
import {deleteFromArray} from "../../utils/collections.js";
import {ALL_PERMISSIONS, Role} from "../../types/database-types.js";
import {randomUUID} from "node:crypto";

function createOrganizationResponse(organizationId: UUID, userId: UUID): OrganizationResponse {
    const organization = OrganizationService.getOrganizationById(organizationId);

    return {
        creationTimestamp: organization.creationTimestamp,
        name: organization.name,
        joinDate: organization.members[userId].creationTimestamp,
        folders: organization.folders.length,
        roles: Object.keys(organization.roles).length,
        members: Object.keys(organization.members).length,
        countryCode: organization.countryCode
    };
}

function buildRoleValidator() {
    return [
        body("name")
            .isString()
            .withMessage("Role name must be a string")
            .isLength({min: 1})
            .withMessage("Role name must be minimally 1 character long"),
        body("permissions")
            .isArray()
            .withMessage("Permissions must be an array")
            .custom((input) => !ALL_PERMISSIONS.includes(input))
    ];
}

const OrganizationRouter = Router()
    .get("", (request: Request, response: Response<OrganizationResponse[], AuthorizedLocals>) => {
        const userId = response.locals.userId;
        const organizations: OrganizationResponse[] = UserService.getUserById(userId).organizations
            .map((organizationId) => createOrganizationResponse(organizationId, userId));

        response.send(organizations);
    })
    .use("/:organizationId",
        param("organizationId").isUUID(),
        handleValidationResults,
        Router({mergeParams: true})
            .use((request: Request, response: Response, next: NextFunction): any => {
                const {organizationId} = matchedData(request);

                if (!response.locals.user.organizations.includes(organizationId)) {
                    return response.status(StatusCodes.FORBIDDEN).send({error: `You're not a part of the requested organization with ID ${organizationId}`});
                }

                next();
            })
            .get("",
                (request: Request, response: Response<OrganizationResponse | ErrorResponse, AuthorizedLocals>): any => {
                    const {organizationId} = matchedData(request);
                    response.send(createOrganizationResponse(organizationId, response.locals.userId));
                })
            .post("/roles",
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
            .delete("/roles/:roleId", (request: Request, response: Response<ErrorResponse, AuthorizedLocals>): any => {
                const {organizationId, roleId} = matchedData<{ organizationId: UUID, roleId: UUID }>(request);

                const organization = OrganizationService.getOrganizationById(organizationId);

                if (!delete organization.roles[roleId]) {
                    return response.sendStatus(StatusCodes.NOT_FOUND);
                }

                Object.values(organization.members).forEach(member => deleteFromArray(member.roles, roleId));

                response.sendStatus(StatusCodes.OK);
            })
            .patch("/roles/:roleId",
                buildRoleValidator().map(validator => validator.optional()),
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
                })
            .patch("/members/:memberId",
                param("memberId").isUUID(),
                body("roles").isArray(),
                body("roles.*").isUUID(),
                handleValidationResults,
                (request: Request, response: Response<ErrorResponse, AuthorizedLocals>): any => {
                    const {roleIds, memberId, organizationId} = matchedData<{
                        roleIds: UUID[],
                        memberId: UUID,
                        organizationId: UUID
                    }>(request);
                    const organization = OrganizationService.getOrganizationById(organizationId);
                    const member = organization.members[memberId];

                    if (!member) {
                        return response.status(StatusCodes.BAD_REQUEST).send({error: `Member with ID ${memberId} not found`});
                    }

                    roleIds.forEach(roleId => {
                        if (!organization.roles[roleId]) {
                            throw new RequestError(StatusCodes.NOT_FOUND, `Role with ID ${roleId} not found in the organization`);
                        }
                    });

                    member.roles = roleIds;

                    response.sendStatus(StatusCodes.OK);
                })
            .delete("/members/:memberId",
                param("memberId").isUUID(),
                handleValidationResults,
                (request: Request, response: Response<ErrorResponse, AuthorizedLocals>): any => {
                    const {organizationId, memberId} = matchedData(request);

                    if (!deleteFromArray(response.locals.user.organizations, organizationId)
                        || !delete OrganizationService.getOrganizationById(organizationId).members[memberId]) {
                        return response.status(StatusCodes.NOT_FOUND);
                    }

                    response.sendStatus(StatusCodes.OK);
                }));

export default OrganizationRouter;