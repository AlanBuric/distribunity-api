import { Router } from "express";
import { body, param } from "express-validator";
import type { MinMaxOptions } from "express-validator/lib/options.js";
import { handleValidationResults } from "../../middleware/validation.js";
import { requirePermission } from "../controller.js";
import { DELETE, GET, GET_BY_ID, PATCH, POST } from "./controller.js";

const minMaxInventoryNameLength: MinMaxOptions = { min: 1, max: 32 };
const nameValidator = body("name")
  .isLength(minMaxInventoryNameLength)
  .withMessage(
    `Inventory name needs to be between ${minMaxInventoryNameLength.min} and ${minMaxInventoryNameLength.max} characters long`,
  );
const inventoryIdValidator = param("inventoryId")
  .isUUID()
  .withMessage("Inventory ID isn't a valid UUID");

const InventoryRouter = Router({ mergeParams: true })
  .get("", requirePermission("inventory.view"), GET)
  .post("", nameValidator, handleValidationResults, requirePermission("inventory.create"), POST)
  .get(
    "/:inventoryId",
    inventoryIdValidator,
    handleValidationResults,
    requirePermission("inventory.view"),
    GET_BY_ID,
  )
  .patch(
    "/:inventoryId",
    inventoryIdValidator,
    nameValidator,
    handleValidationResults,
    requirePermission("inventory.edit"),
    PATCH,
  )
  .delete(
    "/:inventoryId",
    inventoryIdValidator,
    handleValidationResults,
    requirePermission("inventory.delete"),
    DELETE,
  );

export default InventoryRouter;
