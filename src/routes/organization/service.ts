import {Organization} from "../../types/database-types.js";
import {UUID} from "crypto";
import getDatabase from "../../database/database.js";
import RequestError from "../../utils/RequestError.js";
import {StatusCodes} from "http-status-codes";

export default class OrganizationService {
    public static getOrganizationById(id: UUID): Organization {
        const organization = getDatabase().data.organizations[id];

        if (!organization) {
            throw new RequestError(StatusCodes.NOT_FOUND, `Organization with ID ${id} not found`);
        }

        return organization;
    }
}