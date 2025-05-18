import { Router } from "express";
import { body, param } from "express-validator";
import { handleValidationResults } from "../../middleware/validation.js";
import { requirePermission } from "../controller.js";
import { DELETE, GET, PATCH } from "./controller.js";

const MemberRouter = Router({ mergeParams: true })
  .get("", requirePermission("organization.members.view"), GET)
  .patch(
    "/:userId",
    param("userId").isUUID(),
    body("roles").isArray(),
    body("roles.*").isUUID(),
    handleValidationResults,
    requirePermission("organization.members.updateRoles"),
    PATCH
  )
  .delete(
    "/:userId",
    param("userId").isUUID(),
    handleValidationResults,
    requirePermission("organization.members.remove"),
    DELETE
  );

export default MemberRouter;
