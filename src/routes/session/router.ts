import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { body, matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import type {
  AuthorizedLocals,
  ErrorResponse,
  UserLoginResponse,
  UserRegistrationRequest,
} from "../../types/data-transfer-objects.js";
import { handleValidationResults } from "../middleware/validation.js";
import * as UserService from "../user/service.js";
import * as SessionService from "./service.js";
import database from "../../services/database.js";
import { camelCaseify } from "../../utils/database.js";
import type { User } from "../../types/database-types.js";

type UserLoginRequest = {
  email: string;
  password: string;
};

const INVALID_EMAIL = "Invalid e-mail format";
const MISSING_PASSWORD = "Missing password field";

const SessionRouter = Router()
  .post(
    "/register",
    body("firstName")
      .trim()
      .isLength({ min: 1 })
      .withMessage("First name needs to be at least 1 character long")
      .isAlpha(undefined, { ignore: "'" })
      .withMessage("First name needs to consist only of letters"),
    body("lastName")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Last name needs to be at least 1 character long")
      .isAlpha(undefined, { ignore: "'" })
      .withMessage("Last name needs to consist only of letters"),
    body("email").isEmail().toLowerCase().withMessage(INVALID_EMAIL),
    body("password")
      .exists()
      .withMessage(MISSING_PASSWORD)
      .isStrongPassword()
      .withMessage(
        "A strong password needs to be at least 8 characters long, at least 1 lowercase and uppercase character, at least 1 number, and at least 1 symbol"
      ),
    handleValidationResults,
    (
      request: Request<
        Record<string, never>,
        Record<string, never>,
        UserRegistrationRequest
      >,
      response: Response
    ): Promise<any> =>
      UserService.registerUser(request.body).then((user) =>
        response.status(StatusCodes.CREATED).send(user)
      )
  )
  .post(
    "/login",
    body("email")
      .exists()
      .withMessage("Missing e-mail")
      .isEmail()
      .withMessage(INVALID_EMAIL)
      .bail()
      .toLowerCase(),
    body("password").notEmpty().withMessage(MISSING_PASSWORD),
    handleValidationResults,
    async (
      request: Request<
        Record<string, never>,
        Record<string, never>,
        UserLoginRequest,
        Record<string, never>
      >,
      response: Response<UserLoginResponse | ErrorResponse>
    ): Promise<any> => {
      const { email, password } = matchedData(request);

      const result = await database.query(
        'SELECT * FROM "user" WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return response
          .status(StatusCodes.NOT_FOUND)
          .send({ error: "User not found" });
      }

      const fullUser = camelCaseify<User>(result.rows[0]);

      if (
        await SessionService.verifyPassword(password, fullUser.passwordHash!)
      ) {
        const { passwordHash, ...user } = fullUser;
        const generatedAccessToken = await SessionService.generateJwtToken(
          user.userId,
          SessionService.TokenType.ACCESS
        );
        const generatedRefreshToken = await SessionService.generateJwtToken(
          user.userId,
          SessionService.TokenType.REFRESH
        );

        return response
          .cookie("refresh", generatedRefreshToken.token, {
            maxAge: generatedRefreshToken.expiration,
          })
          .send({
            accessToken: generatedAccessToken.token,
            expiration: generatedAccessToken.expiration,
            user,
          });
      }

      response
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: "Incorrect password" });
    }
  )
  .post(
    "/refresh",
    async (
      request: Request,
      response: Response<UserLoginResponse | ErrorResponse>
    ): Promise<any> => {
      const refreshToken = request.cookies.refresh;

      if (!refreshToken) {
        return response.status(StatusCodes.BAD_REQUEST).send({
          error: "Missing refresh token in the request cookies.",
        });
      }

      const userId = await SessionService.getUserIdFromToken(
        refreshToken,
        SessionService.TokenType.REFRESH
      );
      const { passwordHash, ...user } = await UserService.getUserById(userId);
      const generatedToken = await SessionService.generateJwtToken(
        userId,
        SessionService.TokenType.ACCESS
      );

      return response.send({
        accessToken: generatedToken.token,
        expiration: generatedToken.expiration,
        user,
      });
    }
  )
  .delete(
    "/logout",
    async (request: Request, response: Response): Promise<any> => {
      const accessToken = request.header("Authorization")?.split(" ")[1];
      const refreshToken = response.req.headers.cookie;

      response.clearCookie("refresh");

      if (refreshToken) await SessionService.addTokenToDenylist(refreshToken);
      if (accessToken) await SessionService.addTokenToDenylist(accessToken);

      response.sendStatus(StatusCodes.NO_CONTENT);
    }
  )
  .use(
    async (
      request: Request,
      response: Response<ErrorResponse, AuthorizedLocals>,
      next: NextFunction
    ): Promise<any> => {
      const accessToken = request.header("Authorization")?.split(" ")[1];

      if (!accessToken) {
        return response.status(StatusCodes.UNAUTHORIZED).send({
          error: "Missing access token in the format 'Bearer {token}'.",
        });
      }

      if (await SessionService.isTokenBanned(accessToken)) {
        return response
          .status(StatusCodes.UNAUTHORIZED)
          .send({ error: "Access token expired" });
      }

      const userId = await SessionService.getUserIdFromToken(
        accessToken,
        SessionService.TokenType.ACCESS
      );

      response.locals.user = await UserService.getUserById(userId);
      response.locals.userId = userId;

      next();
    }
  );

export default SessionRouter;
