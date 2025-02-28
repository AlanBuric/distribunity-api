import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import RequestError from "../../utils/RequestError.js";

export default function handleError(
	error: any,
	request: Request,
	response: Response,
	next: NextFunction,
): any {
	if (error instanceof RequestError) {
		return response.status(error.statusCode).send({ error: error.message });
	}

	console.error(error);

	response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
}
