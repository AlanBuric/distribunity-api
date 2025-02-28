import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import getLoggingPrefix from "../../utils/logging.js";

export function handleValidationResults(request: Request, response: Response, next: NextFunction) {
	const result = validationResult(request);

	if (result.isEmpty()) {
		return next();
	}

	const error = result.array({ onlyFirstError: true })[0];
	let errorMsg = error.msg;

	if (error.msg === "Invalid value") {
		console.warn(`${getLoggingPrefix} Express-validator response not handled: `, error);

		if (error.type === "field") {
			errorMsg += ` for field ${error.path} in the ${error.location}`;
		}
	}

	response.status(StatusCodes.BAD_REQUEST).send({ error: errorMsg });
}
