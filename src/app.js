import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import authrouter from "./routes/auth.routes.js";
import foodRouter from "./routes/food.routes.js";
import cors from "cors";
import profileRouter from "./routes/foodpartner.routes.js";
const app = express();
const allowedOrigins = (
    process.env.FRONTEND_URL || "http://localhost:5173,http://localhost:5174,https://vercel-ft.vercel.app"
).split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials:true
}))
app.get("/", (req, res) => {
    res.send("Backend is working!");
});
 
app.use("/api/auth",authrouter);
app.use("/api/food",foodRouter);
app.use("/api/foodpartner",profileRouter)

export default app;