import { Request, Response } from "express";
import { User } from "@/models/User"; // Use path alias
export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      // const users = await User.findAll();
      const users = [{ name: "Noor" }];
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }
  async addUser(req: Request, res: Response) {
    try {
      const { email, firstName, lastName } = req.body;
      const user = await User.create();
      res.json({
        user,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.json({
          msg: "You got some error",
          error,
        });
      }
    }
  }
  // Add other controller methods (create, update, delete) here
}
