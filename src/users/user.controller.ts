import { Request, Response, NextFunction } from "express";
import {
  createUserServices,
  deleteUserServices,
  getUserByIdServices,
  getUsersServices,
  updateUserServices,
} from "./user.service";

// Get all users
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await getUsersServices();
    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = parseInt(req.params.id);
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
    next(error);
  }
};

// Create new user
export const createUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userData = req.body;

  // Add here any required fields validation if needed
  if (!userData.email || !userData.password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  try {
    const message = await createUserServices(userData);
    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};

// Update existing user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const userUpdates = req.body;

  try {
    const message = await updateUserServices(userId, userUpdates);
    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = parseInt(req.params.id);
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
    next(error);
  }
};
