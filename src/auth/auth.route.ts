import { Router } from "express";
import {
  createUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} from "./auth.controller";

import validate from "../middleware/validate";
import {
  unverifiedUserSchema,
  loginSchema,
} from "../validation/user.validator";

export const authRouter = Router();

// 🔐 Register a new user (with validation)
authRouter.post("/auth/register",  createUser);//validate(unverifiedUserSchema),

// 🔑 Login user (with validation)
authRouter.post("/auth/login", validate(loginSchema), loginUser);

// 🔄 Request password reset (add schema if desired)
authRouter.post("/auth/request-reset", requestPasswordReset);

// 🔁 Reset password using token (add schema if desired)
authRouter.post("/auth/reset-password", resetPassword);

// 📧 Verify email with code
authRouter.post("/auth/verify-email", verifyEmail);
