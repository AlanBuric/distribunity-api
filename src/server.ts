import application from "./application.js";
import {validateConfigValue} from "./utils/config.js";
import {connectDatabase} from "./database/database.js";

await connectDatabase();

application.listen(validateConfigValue("PORT"), () => {
   console.log(`Server started on port ${process.env.PORT}`);
});