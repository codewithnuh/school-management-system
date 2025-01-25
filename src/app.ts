import express from "express";
import sequelize from "@/config/database";
import userRoutes from "@/routes/UserRoutes";
import { config } from "dotenv";
config();
const app = express();
const port = 3000;
app.use(express.json());
app.use("/users", userRoutes);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    await sequelize.sync({ force: true }); // Creates tables if they don't exist (use force: true with caution in production)
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
