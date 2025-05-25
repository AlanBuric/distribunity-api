import "dotenv/config";
import cors from "cors";
import express, { json, Router } from "express";
import handleError from "./routes/middleware/error-handler.js";
import SessionRouter from "./routes/session/router.js";
import OrganizationRouter from "./routes/organization/router.js";
import UserRouter from "./routes/user/router.js";

const application = express()
  .get("/health", (_req, res): any => res.status(200).send("OK"))
  .use(
    "/api/v1",
    cors({ allowedHeaders: ["Content-Type", "Authorization"] }),
    json(),
    SessionRouter,
    Router().use("/users", UserRouter),
    Router().use("/organizations", OrganizationRouter)
  )
  .use(handleError);

export default application;
