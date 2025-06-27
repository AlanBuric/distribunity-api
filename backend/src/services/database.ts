import pg, { type Pool } from 'pg';
import getLoggingPrefix from '../utils/logging.js';
import EnvConfig from '../utils/config.js';
import { hashPassword } from '../routes/session/service.js';

let database: Pool | undefined = undefined;

async function registerAdminUser() {
  const hashedPassword = await hashPassword(EnvConfig.ADMIN_PASSWORD);

  const { rowCount } = await getDatabase().query(
    `INSERT INTO "user" (user_id, first_name, last_name, email, is_app_admin, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
    [1, 'Admin', 'Admin', EnvConfig.ADMIN_EMAIL, true, hashedPassword],
  );

  return !!rowCount;
}

export async function connectDatabase() {
  database = new pg.Pool().on('error', (error) =>
    console.error('Unexpected error on idle client', error),
  );

  await database.connect().then(async () => {
    console.info(`${getLoggingPrefix()} Connected to PostgreSQL database.`);

    const wasAdminCreated = await registerAdminUser();

    if (wasAdminCreated) {
      console.info(`${getLoggingPrefix()} Web application administrator account has been created.`);
    }
  });
}

export default function getDatabase() {
  if (!database) throw new Error("Database isn't initialized");

  return database;
}
