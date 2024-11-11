import {NextFunction, Request, Response, Router} from "express";
import {
    AuthorizedLocals,
    ErrorResponse,
    OrganizationResponse
} from "../../types/data-transfer-objects.js";
import UserService from "../user/service.js";
import OrganizationService from "./service.js";
import {matchedData, param} from "express-validator";
import {handleValidationResults} from "../middleware/validation.js";
import {UUID} from "crypto";
import {StatusCodes} from "http-status-codes";
import RoleRouter from "../role/router.js";
import MemberRouter from "../member/router.js";

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
            .use((request: Request, response: Response<ErrorResponse, AuthorizedLocals>, next: NextFunction): any => {
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
            .use("/role", RoleRouter)
            .use("/member", MemberRouter));

export default OrganizationRouter;