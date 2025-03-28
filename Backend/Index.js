import express from "express";
import dotenv from "dotenv";
import authRoutes from "./Routes/AuthRoutes.js";
import connectDB from "./Config/database.js";
import middleware from "./middleware/middleware.js";
import userRoutes from "./Routes/userRoutes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
middleware(app);

// connect to database
connectDB();

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
