import { Request, Response } from "express";
import {
  createUserServices,
  deleteUserServices,
  getUserByIdServices,
  getUsersServices,
  updateUserServices,
} from "./user.service";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await getUsersServices();
    if (!allUsers || allUsers.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }
    res.status(200).json(allUsers);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch user" });
  }
};

export const createUserHandler = async (req: Request, res: Response) => {
  const {
    name,
    contact_phone,
    phone_verified = false,
    email,
    email_verified = false,
    verification_code = "",
    password,
    address_id,
  } = req.body;

  if (!name || !contact_phone || !email || !password) {
    res.status(400).json({ error: "Required fields: name, contact_phone, email, password" });
    return;
  }

  try {
    const newUser = await createUserServices({
      name,
      contact_phone,
      phone_verified,
      email,
      email_verified,
      verification_code,
      password,
      address_id,
    });
    res.status(201).json({ message: newUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const {
    name,
    contact_phone,
    phone_verified,
    email,
    email_verified,
    verification_code,
    password,
    address_id,
  } = req.body;

  if (!name || !contact_phone || !email || !password) {
    res.status(400).json({ error: "Required fields: name, contact_phone, email, password" });
    return;
  }

  try {
    const updatedUser = await updateUserServices(userId, {
      name,
      contact_phone,
      phone_verified,
      email,
      email_verified,
      verification_code,
      password,
      address_id,
    });
    res.status(200).json({ message: updatedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
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
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete user" });
  }
};
