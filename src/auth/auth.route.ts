import { Router } from "express";
import validate from "../middleware/validate";
import { adminOnly } from "../middleware/adminOnly";




// Schemas
import {
  createUserSchema,
  loginSchema,
} from "../users/user.validator";

// Controllers (modularized)
import { createUser } from "./controllers/authRegister.controller";
import { loginUser } from "./controllers/authLogin.controller";
import {
  requestPasswordReset,
  resetPassword,
} from "./controllers/authPassword.controller";
import { verifyEmail } from "./controllers/authVerify.controller";
import { adminCreateUser } from "./controllers/authAdmin.controller";

import { resendVerificationCode } from "./controllers/resend.controller";


export const authRouter = Router();

// Auth Routes
authRouter.post("/auth/register", validate(createUserSchema), createUser);
authRouter.post("/auth/login", validate(loginSchema), loginUser);
authRouter.post("/auth/request-reset", requestPasswordReset);
authRouter.post("/auth/reset-password", resetPassword);
authRouter.post("/auth/verify-email", verifyEmail);
authRouter.post("/auth/resend-code", resendVerificationCode);

// Admin-only route
authRouter.post("/admin/create-user", adminOnly, adminCreateUser);
