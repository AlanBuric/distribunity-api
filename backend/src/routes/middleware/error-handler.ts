import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import RequestError from "../../utils/RequestError.js";

export default function handleError(
  error: any,
  _request: Request,
  response: Response,
  _next: NextFunction
): any {
  if (error instanceof RequestError) {
    return response.status(error.statusCode).send(error.message);
  }

  console.error(error);

  response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
}
