import pg, { type Pool } from 'pg';
import getLoggingPrefix from '../utils/logging.js';

let database: Pool | undefined = undefined;

export async function connectDatabase() {
  database = new pg.Pool().on('error', (error) =>
    console.error('Unexpected error on idle client', error),
  );
  database
    .connect()
    .then(() => console.info(`${getLoggingPrefix()} Connected to PostgreSQL database.`));
}

export default function getDatabase() {
  if (!database) throw new Error("Database isn't initialized");

  return database;
}
