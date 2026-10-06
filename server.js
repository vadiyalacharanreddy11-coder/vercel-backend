// import dotenv from "dotenv";
// dotenv.config();
// import app from "./src/app.js";
// import createDb from "./src/db/db.js";
 
// createDb();

// app.listen(8000,()=>{
//     console.log("Server is running")
// })

 import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import createDb from "./src/db/db.js";

createDb();

export default app;