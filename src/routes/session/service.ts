import type { UUID } from "node:crypto";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import ms, { type StringValue } from "ms";
import PasswordHasher from "../../utils/PasswordHasher.js";
import RequestError from "../../utils/RequestError.js";
import { validateConfigValue } from "../../utils/config.js";

// Specification: https://datatracker.ietf.org/doc/html/rfc6749

export enum TokenType {
	ACCESS = "ACCESS",
	REFRESH = "REFRESH",
}

export type GeneratedToken = {
	token: string;
	expiration: number;
};

const passwordHasher = new PasswordHasher(16);

export function generateJwtToken(userId: UUID, type: TokenType): Promise<GeneratedToken> {
	const tokenSecret = validateConfigValue(`${type}_TOKEN_SECRET`);
	const tokenExpiration = validateConfigValue(`${type}_TOKEN_EXPIRATION`);

	return new Promise<GeneratedToken>((resolve, reject) => {
		jwt.sign(
			{ id: userId },
			tokenSecret,
			{ expiresIn: tokenExpiration as StringValue },
			async (err, token) => {
				if (err) {
					return reject(err);
				}
				if (!token) {
					return reject(
						new RequestError(
							StatusCodes.INTERNAL_SERVER_ERROR,
							`Failed to generate ${type.toLowerCase()} token`,
						),
					);
				}

				resolve({
					token,
					expiration: ms(tokenExpiration as StringValue) * 1000,
				});
			},
		);
	});
}

export function hashPassword(password: string): Promise<string> {
	return passwordHasher.hashPassword(password);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
	return passwordHasher.verifyPassword(password, hash);
}

export async function getUserIdFromToken(token: string, type: TokenType): Promise<string> {
	const tokenSecret = validateConfigValue(`${type}_TOKEN_SECRET`);

	return new Promise<string>((resolve, reject) => {
		jwt.verify(token, tokenSecret, (err, decoded) => {
			if (err && err.name === "TokenExpiredError") {
				return reject(new RequestError(StatusCodes.BAD_REQUEST, "Your token has expired"));
			}
			if (err || !decoded || typeof decoded === "string" || !decoded.id) {
				return reject(
					new RequestError(
						StatusCodes.BAD_REQUEST,
						`Missing or malformed access token, given ${token}, error: ${err}`,
					),
				);
			}

			resolve(decoded.id);
		});
	});
}
