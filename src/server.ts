import "./database/database.js";
import { styleText } from "node:util";
import application from "./application.js";
import { validateConfigValue } from "./utils/config.js";
import getLoggingPrefix from "./utils/logging.js";
import { initializeCache } from "./routes/cache-service.js";

const port = validateConfigValue("PORT");

await initializeCache();

application.listen(port, () =>
  console.info(
    styleText(
      ["blueBright"],
      `${getLoggingPrefix()} Distribunity API server started on http://localhost:${port}/api/v1`
    )
  )
);
