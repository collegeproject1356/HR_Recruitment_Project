import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();
const app = express();
app.set("trust proxy", 1);
connectDB();
app.use(express.json()); 
app.use(cookieParser()); 
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true
}));

const PORT = process.env.PORT || 5000;

app.use("/api/users", userRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/applications", applicationRoute);

app.listen(PORT, () => {
     
    console.log(` Server is running on Port: ${PORT}`);
});