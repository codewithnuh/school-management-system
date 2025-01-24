import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
// Create a new express application instance
const app = express();

// Set the network port
const port = process.env.PORT || 5000;

// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
