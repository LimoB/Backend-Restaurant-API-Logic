import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  getUserByEmailIdServices,
  saveResetTokenService,
  getUserByResetTokenService,
  resetUserPasswordService,
} from "../auth.service";
import { sendNotificationEmail } from "../../middleware/googleMailer";

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required." });
      return;
    }

    const user = await getUserByEmailIdServices(email);
    if (user) {
      const token = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 3600000); // 1hr
      await saveResetTokenService(user.id, token, expiry);
      await sendNotificationEmail(
        user.email,
        user.name ?? "User",
        "Password Reset Request",
        `Your reset code is <strong style="color:blue">${token}</strong>.`
      );
    }

    res.status(200).json({ message: "If the email exists, a reset code has been sent." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message || "Request failed." });
  }
};


export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      res.status(400).json({ error: "Token and new password required." });
      return;
    }

    const user = await getUserByResetTokenService(token);
    if (!user || !user.reset_token_expiry || new Date() > new Date(user.reset_token_expiry)) {
      res.status(400).json({ error: "Invalid or expired token." });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await resetUserPasswordService(user.id, hashed);
    await saveResetTokenService(user.id, null, null); // clear token

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message || "Reset failed." });
  }
};
