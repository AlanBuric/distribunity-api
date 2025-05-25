import { Router } from "express";
import { GET, POST } from "./controller.js";
import { handleValidationResults } from "../middleware/validation.js";
import { body } from "express-validator";

const InvitationRouter = Router()
  .get("", GET)
  .post(
    "",
    body("isAccepting")
      .isBoolean()
      .withMessage("isAccepting field needs to be boolean")
      .bail()
      .toBoolean(),
    body("invitationToken")
      .isString()
      .withMessage("Invitation token is missing"),
    handleValidationResults,
    POST
  );

export default InvitationRouter;
