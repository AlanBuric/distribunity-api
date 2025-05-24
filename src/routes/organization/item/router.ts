import { Router } from "express";
import { body, param } from "express-validator";
import type { MinMaxOptions } from "express-validator/lib/options.js";
import { handleValidationResults } from "../../middleware/validation.js";
import { DELETE, PATCH, POST } from "./controller.js";

const minMaxItemNameLength: MinMaxOptions = { min: 1, max: 32 };
const maxUnitNameLength: MinMaxOptions = { max: 32 };

const itemValidatorChain = [
  body("name")
    .isLength(minMaxItemNameLength)
    .withMessage(
      `Item name needs to be between ${minMaxItemNameLength.min} and ${minMaxItemNameLength.max} characters long`
    ),
  body("unit")
    .default("")
    .isLength({ max: 32 })
    .withMessage(
      `Item unit needs to be at most ${maxUnitNameLength.max} characters long`
    ),
  body("iconURL").default("").isURL().withMessage("Invalid icon URL"),
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
    param("itemId").isInt().withMessage("Invalid item ID"),
    itemValidatorChain,
    handleValidationResults,
    PATCH
  )
  .post("", itemValidatorChain, handleValidationResults, POST)
  .delete(
    "/:itemId",
    param("itemId").isInt().withMessage("Invalid item ID"),
    handleValidationResults,
    DELETE
  );

export default ItemRouter;
