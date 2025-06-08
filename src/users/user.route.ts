import { Router } from "express";
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

export const userRouter = Router();

// Admin only can get all users
userRouter.get('/users', adminRoleAuth, getUsers);

// Get user by ID - no auth or optionally add bothRolesAuth
userRouter.get('/users/:id', getUserById); // you can uncomment bothRolesAuth if needed

// Create user - open or protected by bothRolesAuth
userRouter.post('/users', createUserHandler); // add bothRolesAuth if desired

// Update user - bothRolesAuth required
userRouter.put('/users/:id', bothRolesAuth, updateUser);

// Delete user - admin only
userRouter.delete('/users/:id', adminRoleAuth, deleteUser);
