import { Router } from "express";
import { body, param } from "express-validator";
import { handleValidationResults } from "../../middleware/validation.js";
import { requirePermission } from "../controller.js";
import { DELETE, GET, PATCH } from "./controller.js";

const MemberRouter = Router({ mergeParams: true })
  .get("", requirePermission("organization.members.view"), GET)
  .patch(
    "/:memberId",
    param("memberId").isUUID(),
    body("roles").isArray(),
    body("roles.*").isUUID(),
    handleValidationResults,
    requirePermission("organization.members.updateRoles"),
    PATCH,
  )
  .delete(
    "/:memberId",
    param("memberId").isUUID(),
    handleValidationResults,
    requirePermission("organization.members.remove"),
    DELETE,
  );

export default MemberRouter;
