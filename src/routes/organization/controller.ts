import {Request, Response, Router} from "express";
import {AuthorizedLocals, ErrorResponse, OrganizationResponse} from "../../types/data-transfer-objects.js";
import UserService from "../user/service.js";
import OrganizationService from "./service.js";
import {body, matchedData, param} from "express-validator";
import {handleValidationResults} from "../middleware/validation.js";
import {UUID} from "crypto";
import {StatusCodes} from "http-status-codes";
import RequestError from "../../utils/RequestError.js";
import {deleteFromArray} from "../../utils/collections.js";

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

const organizationController = Router()
    .get("", (request: Request, response: Response<OrganizationResponse[], AuthorizedLocals>) => {
        const userId = response.locals.userId;
        const organizations: OrganizationResponse[] = UserService.getUserById(userId).organizations
            .map((organizationId) => createOrganizationResponse(organizationId, userId));

        response.send(organizations);
    })
    .use("/:organizationId",
        param("organizationId").isUUID(),
        handleValidationResults,
        Router({mergeParams: true}).get("",
            (request: Request, response: Response<OrganizationResponse | ErrorResponse, AuthorizedLocals>): any => {
                const {organizationId} = matchedData(request);

                if (!response.locals.user.organizations.includes(organizationId)) {
                    return response.status(StatusCodes.FORBIDDEN).send({error: `You're not a part of the requested organization with ID ${organizationId}`});
                }

                response.send(createOrganizationResponse(organizationId, response.locals.userId));
            })
            .post("/roles", (request: Request, response: Response<OrganizationResponse | ErrorResponse, AuthorizedLocals>) => {

            })
            .delete("/roles", (request: Request, response: Response<OrganizationResponse | ErrorResponse, AuthorizedLocals>) => {

            })
            .patch("/roles", (request: Request, response: Response<OrganizationResponse | ErrorResponse, AuthorizedLocals>) => {

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

                    if (!deleteFromArray(UserService.getUserById(memberId).organizations, organizationId)
                        || !delete OrganizationService.getOrganizationById(organizationId).members[memberId]) {
                        return response.status(StatusCodes.NOT_FOUND).send({error: `Member with ID ${memberId} is not part of the organization with ID ${organizationId}`});
                    }

                    response.sendStatus(StatusCodes.OK);
                })
    );

export default organizationController;