import { Router } from "express";
import {
  createUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  adminCreateUser,
} from "./auth.controller";

import validate from "../middleware/validate";
import {
  createUserSchema,
  loginSchema,
} from "../validation/user.validator";

import { adminOnly } from "../middleware/adminOnly"; // ✅ Import middleware

export const authRouter = Router();

authRouter.post("/auth/register", validate(createUserSchema), createUser);
authRouter.post("/auth/login", validate(loginSchema), loginUser);
authRouter.post("/auth/request-reset", requestPasswordReset);
authRouter.post("/auth/reset-password", resetPassword);
authRouter.post("/auth/verify-email", verifyEmail);

// ✅ Secure admin-only route
authRouter.post("/admin/create-user", adminOnly, adminCreateUser);
