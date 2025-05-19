import pg from "pg";
import { ALL_PERMISSIONS } from "../types/database-types.js";
import getLoggingPrefix from "../utils/logging.js";

const database = new pg.Pool();

database.on("error", (error) => {
  console.error("Unexpected error on idle client", error);
});

await database.connect();
/*
const sqlFilePath = path.join(__dirname, "schema.sql");
const sqlScript = await readFile(sqlFilePath, "utf8");

await database
  .query(sqlScript)
  .then(() =>
    console.info(
      `${getLoggingPrefix()} Database schema initialization executed`
    )
  )
  .catch((error) => {
    console.error(
      `${getLoggingPrefix()} Database schema initialization failed`,
      error
    );
    process.exit(1);
  });
*/
await database
  .query(
    "INSERT INTO permission (name) SELECT unnest($1::text[]) AS name ON CONFLICT (name) DO NOTHING;",
    [ALL_PERMISSIONS]
  )
  .then(({ rowCount }) => {
    if (rowCount) {
      console.info(`${getLoggingPrefix()} Database permissions seeded`);
    }
  })
  .catch((error) => {
    console.error(`${getLoggingPrefix()} Error seeding permissions`, error);
    process.exit(1);
  });

export default database;
