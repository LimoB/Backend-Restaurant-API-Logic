import { Router } from "express";
import {
  createUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail, // ✅ Import verify controller
} from "./auth.controller";

export const authRouter = Router();

// 🔐 Register a new user
authRouter.post("/auth/register", createUser);

// 🔑 Login user
authRouter.post("/auth/login", loginUser);

// 🔄 Request password reset
authRouter.post("/auth/request-reset", requestPasswordReset);

// 🔁 Reset password using token
authRouter.post("/auth/reset-password", resetPassword);

// 📧 Verify email with code
// authRouter.get("/auth/verify-email", verifyEmail); 
authRouter.post('/auth/verify-email', verifyEmail);

