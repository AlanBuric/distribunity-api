import pg from "pg";

const database = new pg.Pool();

database.on("error", (error) => {
  console.error("Unexpected error on idle client", error);
});

export default database;
