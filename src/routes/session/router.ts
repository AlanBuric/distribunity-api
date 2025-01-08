import express, {Router} from "express";
import SessionService, {TokenType} from "./service.js";
import {StatusCodes} from "http-status-codes";
import UserService from "../user/service.js";
import {UUID} from "crypto";
import {body} from "express-validator";
import {handleValidationResults} from "../middleware/validation.js";
import {
    AuthorizedLocals,
    ErrorResponse,
    UserLoginRequest,
    UserLoginResponse,
    UserRegistrationRequest
} from "../../types/data-transfer-objects.js";

const INVALID_EMAIL = "Invalid e-mail format";
const MISSING_PASSWORD = "Missing password field";

const SessionRouter = Router()
    .post("/register",
        body("firstName")
            .isString()
            .trim()
            .isLength({min: 1})
            .withMessage("First name needs to be at least 1 character long"),
        body("lastName").isString().trim(),
        body("email")
            .isEmail()
            .toLowerCase()
            .withMessage(INVALID_EMAIL),
        body("password")
            .exists()
            .withMessage(MISSING_PASSWORD)
            .isString()
            .withMessage(MISSING_PASSWORD)
            .isStrongPassword()
            .withMessage("A strong password needs to be at least 8 characters long, at least 1 lowercase and uppercase character, at least 1 number, and at least 1 symbol"),
        handleValidationResults,
        (request: express.Request<{}, {}, UserRegistrationRequest>, response: express.Response): Promise<any> =>
            UserService.registerUser(request.body).then((id) => response.status(StatusCodes.CREATED).send({id})))
    .post("/login",
        body("email")
            .exists()
            .withMessage(INVALID_EMAIL)
            .isEmail()
            .withMessage(INVALID_EMAIL)
            .bail()
            .toLowerCase(),
        body("password")
            .exists()
            .withMessage(MISSING_PASSWORD)
            .isString()
            .withMessage(MISSING_PASSWORD),
        handleValidationResults,
        async (request: express.Request<{}, {}, UserLoginRequest, {}>, response: express.Response<UserLoginResponse | ErrorResponse>): Promise<any> => {
            const [id, fullUser] = await UserService.getUserByEmail(request.body.email);

            if (await SessionService.verifyPassword(request.body.password, fullUser.hashedPassword)) {
                const {hashedPassword, email, ...user} = fullUser;
                const generatedAccessToken = await SessionService.generateJwtToken(id, TokenType.ACCESS);
                const generatedRefreshToken = await SessionService.generateJwtToken(id, TokenType.REFRESH);

                const loginResponse: UserLoginResponse = {
                    accessToken: generatedAccessToken.token,
                    expiration: generatedAccessToken.expiration,
                    user: {
                        ...user,
                        id
                    }
                };

                return response.cookie("refresh", generatedRefreshToken.token, {
                    maxAge: generatedRefreshToken.expiration
                }).send(loginResponse);
            }

            response.status(StatusCodes.BAD_REQUEST).send({error: "Incorrect password"})
        })
    .post("/refresh", async (request: express.Request, response: express.Response): Promise<any> => {
        const refreshToken = request.cookies["refresh"];

        if (!refreshToken) {
            return response.status(StatusCodes.BAD_REQUEST).send({error: "Missing refresh token in the request cookies."});
        }

        const userId = await SessionService.getUserIdFromToken(refreshToken, TokenType.REFRESH) as UUID;
        const {hashedPassword, email, ...user} = UserService.getUserById(userId);
        const generatedToken = await SessionService.generateJwtToken(userId, TokenType.ACCESS);

        const loginResponse: UserLoginResponse = {
            accessToken: generatedToken.token,
            expiration: generatedToken.expiration,
            user: {
                ...user,
                id: userId
            }
        };

        return response.send(loginResponse);
    })
    // TODO: token denylist
    .post("/logout", (request: express.Request, response: express.Response): any => response.clearCookie("refresh"))
    .use(async (request: express.Request, response: express.Response<{}, AuthorizedLocals>, next: express.NextFunction): Promise<any> => {
        const accessToken = request.header("Authorization")?.split(" ")[1];

        if (!accessToken) {
            return response.status(StatusCodes.BAD_REQUEST).send({error: "Missing access token in the format 'Bearer {token}'."});
        }

        const userId = await SessionService.getUserIdFromToken(accessToken, TokenType.ACCESS) as UUID;
        const user = UserService.getUserById(userId);

        response.locals = {
            user,
            userId
        };

        next();
    });

export default SessionRouter;