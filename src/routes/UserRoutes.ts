import express from "express";
import { UserController } from "@/controllers/UserController"; // Import the controller

const router = express.Router();
const userController = new UserController(); // Instantiate the controller

router.get("/", userController.getAllUsers);
router.post("/", userController.addUser);

export default router;
