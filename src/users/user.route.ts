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

userRouter.get('/users', getUsers);// adminRoleAuth,

userRouter.get('/users/:id', getUserById);

userRouter.post('/users', createUserHandler);

userRouter.put('/users/:id', updateUser);

userRouter.delete('/users/:id', adminRoleAuth, deleteUser);
