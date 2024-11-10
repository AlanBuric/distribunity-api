import express, {json, urlencoded} from "express";
import SessionRouter from "./routes/session/controller.js";
import handleError from "./routes/middleware/error-handler.js";
import 'dotenv/config'
import OrganizationRouter from "./routes/organization/controller.js";

const application = express()
    .use("/api/v1", json(), urlencoded(), SessionRouter)
    .use("/api/v1/organization", OrganizationRouter)
    .use(handleError);

export default application;