import { Router } from "express";
import { param } from "express-validator";
import { handleValidationResults } from "../middleware/validation.js";
import { GET, GET_BY_ID, requireUserBelongsToTargetOrganization } from "./controller.js";
import ItemRouter from "./item/router.js";
import MemberRouter from "./member/router.js";
import RoleRouter from "./role/router.js";

const OrganizationRouter = Router()
  .get("", GET)
  .use(
    "/:organizationId",
    param("organizationId").isUUID(),
    handleValidationResults,
    Router({ mergeParams: true })
      .use(requireUserBelongsToTargetOrganization)
      .get("", GET_BY_ID)
      .use("/role", RoleRouter)
      .use("/member", MemberRouter)
      .use("/items", ItemRouter),
  );

export default OrganizationRouter;
