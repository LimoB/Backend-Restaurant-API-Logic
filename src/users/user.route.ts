import { Router } from "express";
import {
  unverifiedUserSchema,
  loginSchema,
  driverSchema,
  ownerSchema,
} from "../validation/user.validator";
import {
  createUserHandler,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./user.controller";

import {
  adminRoleAuth,
  bothRolesAuth,
  userRoleAuth,
} from "../middleware/bearAuth";

import validate from "../middleware/validate";  // <-- import your Zod validation middleware

export const userRouter = Router();

// Admin only can get all users
userRouter.get("/users", adminRoleAuth, getUsers);

// Get user by ID - no auth or optionally add bothRolesAuth
userRouter.get("/users/:id", getUserById); // uncomment bothRolesAuth if needed

// Create user - open or protected by bothRolesAuth
// Here, validate input with unverifiedUserSchema (adjust if you want other schemas)
userRouter.post("/users", validate(unverifiedUserSchema), createUserHandler);

// Update user - bothRolesAuth required
// Validate update body with the base schema or custom schema if you want partial validation
userRouter.put("/users/:id", bothRolesAuth, validate(unverifiedUserSchema), updateUser);

// Delete user - admin only
userRouter.delete("/users/:id", adminRoleAuth, deleteUser);
