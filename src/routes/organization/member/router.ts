import {Request, Response, Router} from "express";
import {body, matchedData, param} from "express-validator";
import {handleValidationResults} from "../../middleware/validation.js";
import {AuthorizedLocals, ErrorResponse} from "../../../types/data-transfer-objects.js";
import {UUID} from "crypto";
import OrganizationService from "../../organization/service.js";
import {StatusCodes} from "http-status-codes";
import RequestError from "../../../utils/RequestError.js";
import {deleteFromArray} from "../../../utils/collections.js";

const MemberRouter = Router({mergeParams: true})
    .patch("/:memberId",
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
                return response.status(StatusCodes.NOT_FOUND).send({error: `Member with ID ${memberId} not found`});
            }

            roleIds.forEach(roleId => {
                if (!organization.roles[roleId]) {
                    throw new RequestError(StatusCodes.NOT_FOUND, `Role with ID ${roleId} not found in the organization`);
                }
            });

            member.roles = roleIds;

            response.sendStatus(StatusCodes.OK);
        })
    .delete("/:memberId",
        param("memberId").isUUID(),
        handleValidationResults,
        (request: Request, response: Response<ErrorResponse, AuthorizedLocals>): any => {
            const {organizationId, memberId} = matchedData(request);

            if (!deleteFromArray(response.locals.user.organizations, organizationId)
                || !delete OrganizationService.getOrganizationById(organizationId).members[memberId]) {
                return response.status(StatusCodes.NOT_FOUND);
            }

            response.sendStatus(StatusCodes.OK);
        });

export default MemberRouter;