import cors from "cors";
import express from "express";
import sequelize from "./config/database.js";
import authRoutes from "./routes/authRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    await sequelize.sync({ alter: true });
    console.log("Tables synchronized!");

    app.listen(8000, () => console.log("Server running on port 8000"));
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();
