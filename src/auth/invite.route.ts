// invite.routes.ts
import { Router } from "express";
import { adminCreateUser, verifyEmail } from "./invite.controller";
import { adminOnly } from "../middleware/adminOnly";

const router = Router();

router.post("/admin/invite", adminOnly, adminCreateUser); // secured
router.post("/verify", verifyEmail); // public

export default router;
