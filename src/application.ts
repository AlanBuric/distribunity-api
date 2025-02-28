import express, { json, Router, urlencoded } from "express";
import handleError from "./routes/middleware/error-handler.js";
import SessionRouter from "./routes/session/router.js";
import "dotenv/config";
import OrganizationRouter from "./routes/organization/router.js";

const application = express()
	.use(
		"/api/v1",
		json(),
		urlencoded(),
		SessionRouter,
		Router().use("/organizations", OrganizationRouter),
	)
	.use(handleError);

export default application;
