import express, {NextFunction} from "express";
import RequestError from "../../utils/RequestError.js";
import {StatusCodes} from "http-status-codes";

export default function handleError(error: any, request: express.Request, response: express.Response, next: NextFunction): any {
    if (error instanceof RequestError) {
        return response.status(error.statusCode).send({error: error.message});
    }

    console.error(error);

    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error: error.message});
}