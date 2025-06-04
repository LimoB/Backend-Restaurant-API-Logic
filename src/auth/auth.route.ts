
import { Router } from "express";
import {
  createUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
} from "./auth.controller"; // ✅ Remove `.js` if you're using TypeScript

export const authRouter = Router();

// 🔐 Register a new user
authRouter.post("/auth/register", createUser);

// 🔑 Login user
authRouter.post("/auth/login", loginUser);

// 🔄 Request password reset
authRouter.post("/auth/request-reset", requestPasswordReset);

// 🔁 Reset password using token
authRouter.post("/auth/reset-password", resetPassword);
