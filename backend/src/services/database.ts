import pg, { type Pool } from 'pg';
import getLoggingPrefix from '../utils/logging.js';

let database: Pool | undefined = undefined;

export async function connectDatabase() {
  database = new pg.Pool().on('error', (error) =>
    console.error('Unexpected error on idle client', error),
  );

  await database.connect().then(() => {
    console.info(`${getLoggingPrefix()} Connected to PostgreSQL database.`);
    // TODO: query insert, on conflict shut up
    console.info(`${getLoggingPrefix()} Web application administrator account has been created.`);
  });
}

export default function getDatabase() {
  if (!database) throw new Error("Database isn't initialized");

  return database;
}
