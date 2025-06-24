import pg, { type Pool } from 'pg';
import getLoggingPrefix from '../utils/logging.js';
import { registerUser } from '../routes/user/service.js';
import EnvConfig from '../utils/config.js';
import type { UserRegistrationRequest } from '../types/data-transfer-objects.js';
import { hashPassword } from '../routes/session/service.js';

let database: Pool | undefined = undefined;

async function registerAdminUser(registration: UserRegistrationRequest) {
  const hashedPassword = await hashPassword(registration.password);

  await getDatabase().query(
    `INSERT INTO "user" (first_name, last_name, email, password_hash)
      VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
    [registration.firstName, registration.lastName, registration.email, hashedPassword],
  );
}

export async function connectDatabase() {
  database = new pg.Pool().on('error', (error) =>
    console.error('Unexpected error on idle client', error),
  );

  await database.connect().then(async () => {
    console.info(`${getLoggingPrefix()} Connected to PostgreSQL database.`);

    await registerAdminUser({
      firstName: 'Admin',
      lastName: 'Admin',
      email: EnvConfig.ADMIN_EMAIL,
      password: EnvConfig.ADMIN_PASSWORD,
    });

    console.info(`${getLoggingPrefix()} Web application administrator account has been created.`);
  });
}

export default function getDatabase() {
  if (!database) throw new Error("Database isn't initialized");

  return database;
}
