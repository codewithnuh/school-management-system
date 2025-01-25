import express from "express";
// import { UserController } from "@/controllers/UserController"; // Import the controller
import { createUser, getAllUsers } from "@/controllers/UserController";
const router = express.Router();
// const userController = new UserController(); // Instantiate the controller

// router.get("/", userController.getAllUsers);
router.post("/", createUser);
router.post("/a", getAllUsers);

export default router;
