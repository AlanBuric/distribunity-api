import { Router } from "express";
import { body, param } from "express-validator";
import { handleValidationResults } from "../middleware/validation.js";
import {
  GET,
  GET_BY_ID,
  PATCH,
  POST,
  requirePermission,
  requireUserBelongsToTargetOrganization,
} from "./controller.js";
import ItemRouter from "./item/router.js";
import MemberRouter from "./member/router.js";
import RoleRouter from "./role/router.js";
import type { MinMaxOptions } from "express-validator/lib/options.js";
import getDatabase from "../../database/database.js";

const minMaxOrganizationNameLength: MinMaxOptions = { min: 1, max: 32 };

function createOrganizationValidatorChain() {
  return [
    body("name")
      .isLength(minMaxOrganizationNameLength)
      .withMessage(
        `Organization name must be between ${minMaxOrganizationNameLength.min} and ${minMaxOrganizationNameLength.max} characters long`,
      ),
    body("countryCode")
      .isString()
      .withMessage("Invalid country code")
      .custom((input) => getDatabase().data.countries[input] != null)
      .withMessage("Country not found"),
  ];
}

const OrganizationRouter = Router()
  .get("", GET)
  .post("", ...createOrganizationValidatorChain(), handleValidationResults, POST)
  .use(
    "/:organizationId",
    param("organizationId").isUUID(),
    handleValidationResults,
    Router({ mergeParams: true })
      .use(requireUserBelongsToTargetOrganization)
      .get("", GET_BY_ID)
      .patch(
        "",
        ...createOrganizationValidatorChain().map((validator) => validator.optional()),
        handleValidationResults,
        requirePermission("organization.edit"),
        PATCH,
      )
      .use("/role", RoleRouter)
      .use("/member", MemberRouter)
      .use("/items", ItemRouter),
  );

export default OrganizationRouter;
