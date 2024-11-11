import application from "./application.js";
import {validateConfigValue} from "./utils/config.js";
import {connectDatabase} from "./database/database.js";

const port = validateConfigValue("PORT");

await connectDatabase();

application.listen(port, () => {
   console.log(`Server started on port ${port}`);
});