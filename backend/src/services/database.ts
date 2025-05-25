import pg from "pg";
import getLoggingPrefix from "../utils/logging.js";

const database = new pg.Pool().on("error", (error) =>
  console.error("Unexpected error on idle client", error)
);

export default database;
