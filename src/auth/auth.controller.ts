import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import {
  createUserServices,
  getUserByEmailIdServices,
  saveResetTokenService,
  resetUserPasswordService,
  getUserByResetTokenService,
} from "./auth.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendNotificationEmail } from "../middleware/googleMailer";

interface UserInput {
  name: string | null;
  email: string;
  password: string;
}

// 🔹 Register User
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user: UserInput = req.body;

    if (!user.name || !user.email || !user.password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }

    const existingUser = await getUserByEmailIdServices(user.email);
    if (existingUser) {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    await createUserServices({
      name: user.name,
      email: user.email,
      password: hashedPassword,
      contact_phone: "0000000000", // default or extract from req
      phone_verified: false,
      email_verified: false,
      verification_code: "",
      address_id: null,
    });

    const emailResult = await sendNotificationEmail(
      user.email,
      user.name,
      "Hi ${user.name} your Account has been Created Successfully 🌟",
      "Welcome to our Amazing Restoutant Food Services"
    );

    res.status(201).json({
      message: "User created successfully",
      emailNotification: emailResult,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || "Failed to create user" });
  }
};

// 🔹 Login User
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await getUserByEmailIdServices(email);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    const payload = {
      userId: user.id,
      email: user.email,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not set in environment variables");
    }

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user.id,
      email: user.email,
      name: user.name, // add this
      user_type: user.user_type // if using this field
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || "Failed to login user" });
  }
};

// 🔹 Request Password Reset
export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const user = await getUserByEmailIdServices(email);
    if (!user) {
      res.status(200).json({ message: "If the email exists, a reset link has been sent." });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await saveResetTokenService(user.id, resetToken, resetTokenExpiry);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await sendNotificationEmail(
      user.email,
      user.name ?? "User",
      "Password Reset Request",
      `You requested a password reset. Click the link to reset your password: ${resetUrl}`
    );

    res.status(200).json({ message: "If the email exists, a reset link has been sent." });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || "Failed to request password reset" });
  }
};

// 🔹 Reset Password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ error: "Token and newPassword are required" });
      return;
    }

    const user = await getUserByResetTokenService(token);
    if (!user || !user.reset_token_expiry || new Date() > new Date(user.reset_token_expiry)) {
      res.status(400).json({ error: "Invalid or expired reset token" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await resetUserPasswordService(user.id, hashedPassword);
    await saveResetTokenService(user.id, null, null);

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || "Failed to reset password" });
  }
};
