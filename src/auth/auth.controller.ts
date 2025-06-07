import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import {
  createUserServices,
  getUserByEmailIdServices,
  saveResetTokenService,
  resetUserPasswordService,
  getUserByResetTokenService,
  createUnverifiedUserService,
  getUnverifiedUserByEmail,
  getUnverifiedUserByCode,
  deleteUnverifiedUserById,
  moveUnverifiedToVerified,
} from "./auth.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendNotificationEmail } from "../middleware/googleMailer";

interface UserInput {
  name: string | null;
  email: string;
  password: string;
  contact_phone?: string;
  user_type?: string;  // allow user_type in request body (raw string)
}

const allowedUserTypes = ["member", "admin", "driver", "owner"] as const;
type AllowedUserType = typeof allowedUserTypes[number];

// ────────────────────────────────
// 🔹 Register User
// ────────────────────────────────
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user: UserInput = req.body;

    if (!user.name || !user.email || !user.password) {
      res.status(400).json({ error: "Name, email, and password are required." });
      return;
    }

    const existingUser = await getUserByEmailIdServices(user.email);
    if (existingUser) {
      res.status(400).json({ error: "A user with this email already exists." });
      return;
    }

    const existingUnverified = await getUnverifiedUserByEmail(user.email);
    if (existingUnverified) {
      await deleteUnverifiedUserById(existingUnverified.id);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const rawUserType = user.user_type?.toLowerCase();
    const userType: AllowedUserType = allowedUserTypes.includes(rawUserType as AllowedUserType)
      ? (rawUserType as AllowedUserType)
      : "member";

    await createUnverifiedUserService({
      name: user.name,
      email: user.email,
      password: hashedPassword,
      contact_phone: user.contact_phone ?? "0000000000",
      verification_code: verificationCode,
      verification_code_expiry: expiry,
      user_type: userType,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await sendNotificationEmail(
      user.email,
      user.name,
      "Email Verification Required",
      `Welcome! Your verification code is: <span style="color:blue; font-weight:bold;">${verificationCode}</span>. It will expire in 10 minutes.`
    );

    res.status(201).json({
      message: "A verification email has been sent. Please check your inbox.",
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || "Failed to register user." });
  }
};

// ────────────────────────────────
// 🔹 Login User
// ────────────────────────────────
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const user = await getUserByEmailIdServices(email);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid password." });
      return;
    }

    const payload = {
      userId: user.id,
      email: user.email,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not set.");

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful.",
      token,
      userId: user.id,
      email: user.email,
      name: user.name,
      user_type: user.user_type,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || "Failed to log in user." });
  }
};

// ────────────────────────────────
// 🔹 Request Password Reset
// ────────────────────────────────
export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required." });
      return;
    }

    const user = await getUserByEmailIdServices(email);

    if (!user) {
      res.status(200).json({ message: "If the email exists, a reset code has been sent." });
      return;
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit token
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await saveResetTokenService(user.id, resetToken, resetTokenExpiry);

    await sendNotificationEmail(
      user.email,
      user.name ?? "User",
      "Password Reset Request",
      `You requested a password reset. Your reset code is: <span style="color:blue; font-weight:bold;">${resetToken}</span>. It is valid for 1 hour.`
    );

    res.status(200).json({ message: "If the email exists, a reset code has been sent." });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || "Failed to request password reset." });
  }
};

// ────────────────────────────────
// 🔹 Reset Password
// ────────────────────────────────
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ error: "Token and new password are required." });
      return;
    }

    const user = await getUserByResetTokenService(token);
    if (
      !user ||
      !user.reset_token_expiry ||
      new Date() > new Date(user.reset_token_expiry)
    ) {
      res.status(400).json({ error: "Invalid or expired reset token." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await resetUserPasswordService(user.id, hashedPassword);

    await saveResetTokenService(user.id, null, null); // clear token

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || "Failed to reset password." });
  }
};

// ────────────────────────────────
// 🔹 Verify Email
// ────────────────────────────────
// export const verifyEmail = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { code } = req.query;

//     if (!code || typeof code !== "string") {
//       res.status(400).json({ error: "Invalid verification code." });
//       return;
//     }

//     const unverifiedUser = await getUnverifiedUserByCode(code);
//     if (
//       !unverifiedUser ||
//       !unverifiedUser.verification_code_expiry ||
//       new Date() > new Date(unverifiedUser.verification_code_expiry)
//     ) {
//       res.status(400).json({ error: "Invalid or expired verification code." });
//       return;
//     }

//     const createdUser = await moveUnverifiedToVerified(unverifiedUser);

//     res.status(200).json({
//       message: "Email verified successfully. Account created.",
//       user: createdUser,
//     });
//   } catch (error) {
//     const err = error as Error;
//     res.status(500).json({ error: err.message || "Failed to verify email." });
//   }
// };
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { verificationCode } = req.body;

    if (!verificationCode || typeof verificationCode !== "string") {
      res.status(400).json({ error: "Invalid verification code." });
      return;
    }

    const unverifiedUser = await getUnverifiedUserByCode(verificationCode);
    if (
      !unverifiedUser ||
      !unverifiedUser.verification_code_expiry ||
      new Date() > new Date(unverifiedUser.verification_code_expiry)
    ) {
      res.status(400).json({ error: "Invalid or expired verification code." });
      return;
    }

    const createdUser = await moveUnverifiedToVerified(unverifiedUser);

    res.status(200).json({
      message: "Email verified successfully. Account created.",
      user: createdUser,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || "Failed to verify email." });
  }
};

