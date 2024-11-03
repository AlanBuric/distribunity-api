import express, {json, urlencoded} from "express";
import sessionController from "./routes/session/controller.js";
import handleError from "./routes/middleware/error-handler.js";
import 'dotenv/config'
import organizationController from "./routes/organization/controller.js";

const application = express()
    .use("/api/v1", json(), urlencoded(), sessionController)
    .use("/api/v1/organizations", organizationController)
    .use(handleError);

export default application;