import { Router } from "express";
import {
  createUserHandler,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
 // ✅ Imported your updated controller for admin-based creation with email verification
} from "./user.controller";

import { adminCreateUser } from "../auth/invite.controller"; // adjust path if needed


import {
  adminRoleAuth,
  adminOrMemberAuth, // ✅ This allows both admin and member
} from "../middleware/bearAuth";

import validate from "../middleware/validate";

import {
  createUserSchema,
  updateUserSchema,
} from "../validation/user.validator";

export const userRouter = Router();

// ✅ Get all users (Admin only)
userRouter.get("/users", adminRoleAuth, getUsers);

// ✅ Get user by ID (no auth, public or will restrict later via custom logic)
userRouter.get("/users/:id", getUserById);

// ✅ Self-service public user registration (no auth, only validation)
userRouter.post("/users", validate(createUserSchema), createUserHandler);

// ✅ Admin OR authenticated member creating user (uses your createUser function)
userRouter.post(
  "/users/create",
  adminOrMemberAuth,
  validate(createUserSchema),
  adminCreateUser
);


// ✅ Update user (Admin or same user, assume your controller checks ownership)
userRouter.put("/users/:id", adminOrMemberAuth, validate(updateUserSchema), updateUser);

// ✅ Delete user (Admin only)
userRouter.delete("/users/:id", adminRoleAuth, deleteUser);
