import {Request, Response, Router} from "express";
import {AuthorizedLocals, OrganizationResponse} from "../../types/data-transfer-objects.js";
import UserService from "../user/service.js";
import OrganizationService from "./service.js";

const organizationController = Router().get("", (request: Request, response: Response<OrganizationResponse[], AuthorizedLocals>) => {
    const userId = response.locals.userId;
    const organizations: OrganizationResponse[] = UserService.getUserById(userId)
        .organizations
        .map((organizationId) => {
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
        });

    response.send(organizations);
});

export default organizationController;