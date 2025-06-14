import { Request, Response, NextFunction } from "express";
import {
  createUserServices,
  deleteUserServices,
  getUserByIdServices,
  getUsersServices,
  updateUserServices,
} from "./user.service";

import { sendNotificationEmail } from "../middleware/googleMailer";
import { generateVerificationCode } from "../middleware/bearAuth";

// 🔹 GET /api/users - Get all users
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("➡️ GET /api/users hit");

  try {
    const users = await getUsersServices();
    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error in getUsers:", error);
    next(error);
  }
};

// 🔹 GET /api/users/:id - Get user by ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = parseInt(req.params.id);
  console.log(`➡️ GET /api/users/${req.params.id} hit`);

  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const user = await getUserByIdServices(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error in getUserById:", error);
    next(error);
  }
};

// 🔹 POST /api/users - Public user registration
export const createUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userData = req.body;
  console.log("➡️ POST /api/users hit with:", userData);

  if (!userData.email || !userData.password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  try {
    const message = await createUserServices(userData);
    res.status(201).json({ message });
  } catch (error) {
    console.error("❌ Error in createUserHandler:", error);
    next(error);
  }
};

// 🔹 PUT /api/users/:id - Update user (admin or self)
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = parseInt(req.params.id);
  const userUpdates = req.body;
  console.log(`➡️ PUT /api/users/${req.params.id} hit with:`, userUpdates);

  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const message = await updateUserServices(userId, userUpdates);
    res.status(200).json({ message });
  } catch (error) {
    console.error("❌ Error in updateUser:", error);
    next(error);
  }
};

// 🔹 DELETE /api/users/:id - Delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = parseInt(req.params.id);
  console.log(`➡️ DELETE /api/users/${req.params.id} hit`);

  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const deleted = await deleteUserServices(userId);
    if (deleted) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found or could not be deleted" });
    }
  } catch (error) {
    console.error("❌ Error in deleteUser:", error);
    next(error);
  }
};
