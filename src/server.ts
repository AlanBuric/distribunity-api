import application from "./application.js";
import {validateConfigValue} from "./utils/config.js";
import {connectDatabase} from "./database/database.js";
import {styleText} from "node:util";
import getLoggingPrefix from "./utils/logging.js";

const port = validateConfigValue("PORT");

await connectDatabase();

application.listen(port, () => console.info(styleText(['blueBright'], `${getLoggingPrefix()} Distribunity API server started on http://localhost:${port}/api/v1`)));