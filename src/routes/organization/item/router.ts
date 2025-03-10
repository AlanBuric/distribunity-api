import type { UUID } from "node:crypto";
import { randomUUID } from "node:crypto";
import { type Request, type Response, Router } from "express";
import { body, matchedData, param } from "express-validator";
import type { MinMaxOptions } from "express-validator/lib/options.js";
import { StatusCodes } from "http-status-codes";
import type {
  ErrorResponse,
  OrganizationLocals,
  WithUUID,
} from "../../../types/data-transfer-objects.js";
import type { CreatedAt, Item } from "../../../types/database-types.js";
import { handleValidationResults } from "../../middleware/validation.js";
import { DELETE, PATCH, POST } from "./controller.js";

const minMaxItemNameLength: MinMaxOptions = { min: 1, max: 32 };
const maxUnitNameLength: MinMaxOptions = { max: 32 };

const itemValidatorChain = [
  body("name")
    .isLength(minMaxItemNameLength)
    .withMessage(
      `Item name needs to be between ${minMaxItemNameLength.min} and ${minMaxItemNameLength.max} characters long`,
    ),
  body("unit")
    .default("")
    .isLength({ max: 32 })
    .withMessage(`Item unit needs to be at most ${maxUnitNameLength.max} characters long`),
  body("iconURL").default("").isURL().withMessage("Icon URL isn't a valid URL"),
  body("unitPrice")
    .default(0)
    .isFloat({ min: 0 })
    .withMessage("Unit price must be at least 0")
    .toFloat(),
  body("attributes")
    .default([])
    .isArray()
    .withMessage("Attributes must be a valid array")
    .toArray(),
];

const ItemRouter = Router({ mergeParams: true })
  .patch(
    "/:itemId",
    param("itemId").isUUID().withMessage("Item ID isn't a valid UUID"),
    itemValidatorChain,
    handleValidationResults,
    PATCH,
  )
  .post("", itemValidatorChain, handleValidationResults, POST)
  .delete(
    "/:itemId",
    param("itemId").isUUID().withMessage("Item ID isn't a valid UUID"),
    handleValidationResults,
    DELETE,
  );

export default ItemRouter;
