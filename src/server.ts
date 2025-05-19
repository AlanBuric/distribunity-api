import "dotenv/config";
import "./services/database.js";
import { styleText } from "node:util";
import { validateConfigValue } from "./utils/config.js";
import getLoggingPrefix from "./utils/logging.js";
import application from "./application.js";

const port = Number(validateConfigValue("PORT"));

application.listen(port, () =>
  console.info(
    styleText(
      ["blueBright"],
      `${getLoggingPrefix()} Distribunity API server started on http://localhost:${port}/api/v1`
    )
  )
);
