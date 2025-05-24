import { Router } from "express";
import { GET, POST } from "./controller.js";

const InvitationRouter = Router().get("", GET).post("", POST);

export default InvitationRouter;
