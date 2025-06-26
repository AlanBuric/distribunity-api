import { StatusCodes } from 'http-status-codes';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import ms, { type StringValue } from 'ms';
import PasswordHasher from '../../utils/PasswordHasher.js';
import RequestError from '../../utils/RequestError.js';
import getRedis from '../../services/redis.js';
import EnvConfig from '../../utils/config.js';

// Specification: https://datatracker.ietf.org/doc/html/rfc6749

export enum TokenType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}

export type GeneratedToken = {
  token: string;
  expiration: number;
};

const passwordHasher = new PasswordHasher(16);

export function generateJwtToken(userId: number, type: TokenType): Promise<GeneratedToken> {
  const [tokenSecret, tokenExpiration] =
    type == TokenType.ACCESS
      ? [EnvConfig.ACCESS_TOKEN_SECRET, EnvConfig.ACCESS_TOKEN_EXPIRATION]
      : [EnvConfig.REFRESH_TOKEN_SECRET, EnvConfig.REFRESH_TOKEN_EXPIRATION];

  return new Promise<GeneratedToken>((resolve, reject) => {
    jwt.sign(
      { id: userId },
      tokenSecret,
      { expiresIn: tokenExpiration as StringValue },
      async (err, token) => {
        if (err) return reject(err);

        if (!token)
          return reject(
            new RequestError(
              StatusCodes.INTERNAL_SERVER_ERROR,
              `Failed to generate ${type.toLowerCase()} token`,
            ),
          );

        resolve({
          token,
          expiration: ms(tokenExpiration as StringValue) * 1000,
        });
      },
    );
  });
}

export function isEligibleForRefresh(issuedAtTime: number) {
  const tokenExpirationLength = ms(EnvConfig.REFRESH_TOKEN_EXPIRATION as ms.StringValue);
  const thresholdTime =
    issuedAtTime * 1000 + tokenExpirationLength * EnvConfig.TOKEN_LIFETIME_REFRESH_THRESHOLD;

  return thresholdTime <= Date.now();
}

export function hashPassword(password: string): Promise<string> {
  return passwordHasher.hashPassword(password);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return passwordHasher.verifyPassword(password, hash);
}

export function getJwtTokenPayload(token: string, type: TokenType): Promise<JwtPayload> {
  const tokenSecret =
    type == TokenType.ACCESS ? EnvConfig.ACCESS_TOKEN_SECRET : EnvConfig.REFRESH_TOKEN_SECRET;

  return new Promise<JwtPayload>((resolve, reject) => {
    jwt.verify(token, tokenSecret, (error, decoded) => {
      if (error?.name == 'TokenExpiredError') {
        addTokenToDenylist(token);
        return reject(
          new RequestError(StatusCodes.UNAUTHORIZED, 'Authorization session has expired'),
        );
      }

      if (error || !decoded || typeof decoded === 'string' || !decoded.id) {
        return reject(
          new RequestError(StatusCodes.BAD_REQUEST, 'Missing or malformed session token'),
        );
      }

      resolve(decoded);
    });
  });
}

export async function isTokenOnDenylist(token: string) {
  return (
    (await getRedis()
      .get(`tdl:${token}`)
      .catch(() => null)) != null
  );
}

export async function addTokenToDenylist(token: string) {
  const decoded = jwt.decode(token);

  if (typeof decoded == 'object' && decoded?.exp) {
    await getRedis()
      .set(`tdl:${token}`, 1, {
        expiration: { type: 'EXAT', value: decoded.exp },
      })
      .catch(console.error);
  }
}
