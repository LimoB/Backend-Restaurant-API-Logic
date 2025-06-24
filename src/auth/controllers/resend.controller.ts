import { Request, Response } from "express";
import { getUnverifiedUserByEmail, updateVerificationCodeForUser } from "../auth.service";
import { sendNotificationEmail } from "../../middleware/googleMailer";

export const resendVerificationCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required." });
      return;
    }

    const user = await getUnverifiedUserByEmail(email);

    if (!user) {
      res.status(404).json({
        error: "No unverified user found with this email.",
      });
      return;
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await updateVerificationCodeForUser(user.id, newCode, expiry);

    const subject = "Resend Email Verification";
    const html = `
      <p>Hello ${user.name},</p>
      <p>Your new verification code is:</p>
      <h2 style="color:blue">${newCode}</h2>
      <p>This code expires in 10 minutes.</p>
    `;

    await sendNotificationEmail(email, user.name, subject, html);

    res.status(200).json({ message: "Verification code resent successfully." });
  } catch (error) {
    console.error("Error in resendVerificationCode:", error);
    res.status(500).json({
      error: (error as Error).message || "Failed to resend code.",
    });
  }
};
