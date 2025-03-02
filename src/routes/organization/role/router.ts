import { Router } from "express";
import { body } from "express-validator";
import type { MinMaxOptions } from "express-validator/lib/options.js";
import { ALL_PERMISSIONS } from "../../../types/database-types.js";
import { handleValidationResults } from "../../middleware/validation.js";
import { requirePermission } from "../controller.js";
import { DELETE, PATCH, POST } from "./controller.js";

const minMaxRoleNameLength: MinMaxOptions = { min: 1, max: 32 };

function buildRoleValidator(optional?: boolean) {
	const result = [
		body("name")
			.isLength(minMaxRoleNameLength)
			.withMessage(
				`Role name must be between ${minMaxRoleNameLength.min} and ${minMaxRoleNameLength} characters long`,
			),
		body("description")
			.trim()
			.default("")
			.isLength({ max: 100 })
			.withMessage("Role description must be at most 100 characters long"),
		body("permissions").isArray().withMessage("Missing array of permissions"),
		body("permissions.*")
			.isIn(ALL_PERMISSIONS)
			.withMessage(
				(invalidPermission) =>
					`Invalid permission ${invalidPermission}, valid ones are ${ALL_PERMISSIONS.join(", ")}`,
			),
	];

	if (optional) {
		result[0].optional();
		result[1].optional();
	}

	return result;
}

const RoleRouter = Router({ mergeParams: true })
	.post(
		"",
		buildRoleValidator(),
		handleValidationResults,
		requirePermission("organization.roles.create"),
		POST,
	)
	.delete("/:roleId", requirePermission("organization.roles.delete"), DELETE)
	.patch(
		"/:roleId",
		buildRoleValidator(true),
		handleValidationResults,
		requirePermission("organization.roles.create"),
		PATCH,
	);

export default RoleRouter;
