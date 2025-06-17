import dotenv from 'dotenv';

export default class EnvConfig {
  static PORT: number;
  static REDIS_URL: string;
  static ACCESS_TOKEN_SECRET: string;
  static ACCESS_TOKEN_EXPIRATION: string;
  static REFRESH_TOKEN_SECRET: string;
  static REFRESH_TOKEN_EXPIRATION: string;
  /**
   * The percentage determining the point in time in a refresh token's lifetime (e.g. 14 days)
   * it's is eligible for replacement with a fresh one (e.g. 10.5 days given 75%).
   */
  static TOKEN_LIFETIME_REFRESH_THRESHOLD: number;

  static initialize() {
    dotenv.config();

    EnvConfig.PORT = EnvConfig.parseValidInt('PORT');
    EnvConfig.REDIS_URL = EnvConfig.validateEnvExistence('REDIS_URL');
    EnvConfig.ACCESS_TOKEN_SECRET = EnvConfig.validateEnvExistence('ACCESS_TOKEN_SECRET');
    EnvConfig.ACCESS_TOKEN_EXPIRATION = EnvConfig.validateEnvExistence('ACCESS_TOKEN_EXPIRATION');
    EnvConfig.REFRESH_TOKEN_SECRET = EnvConfig.validateEnvExistence('REFRESH_TOKEN_SECRET');
    EnvConfig.REFRESH_TOKEN_EXPIRATION = EnvConfig.validateEnvExistence('REFRESH_TOKEN_EXPIRATION');
    EnvConfig.TOKEN_LIFETIME_REFRESH_THRESHOLD = EnvConfig.parseValidFloat(
      'TOKEN_LIFETIME_REFRESH_THRESHOLD',
    );
  }

  static validateEnvExistence(name: string): string {
    if (process.env[name]) return process.env[name];

    throw new Error(`Environment variable value ${name} is missing from the .env config`);
  }

  static parseValidInt(name: string): number {
    const text = this.validateEnvExistence(name);
    const value = parseInt(text);

    if (!Number.isInteger(value)) throw new Error(`Invalid integer ${name} with value ${text}`);

    return value;
  }

  static parseValidFloat(name: string): number {
    const text = this.validateEnvExistence(name);
    const value = parseFloat(text);

    if (Number.isNaN(value)) throw new Error(`Invalid float ${name} with value ${text}`);

    return value;
  }
}
