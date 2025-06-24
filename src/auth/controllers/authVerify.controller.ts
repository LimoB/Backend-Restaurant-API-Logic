import { Request, Response } from "express";
import { getUnverifiedUserByCode, moveUnverifiedToVerified } from "../auth.service";

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const code = req.body.verificationCode || req.body.code || req.query.code;
  if (!code || typeof code !== "string") {
    res.status(400).json({ error: "Invalid verification code." });
    return;
  }

  try {
    const user = await getUnverifiedUserByCode(code);
    if (!user || new Date() > new Date(user.verification_code_expiry)) {
      res.status(400).json({ error: "Expired or invalid verification code." });
      return;
    }

    const { user: createdUser, token } = await moveUnverifiedToVerified(user);
    res.status(200).json({
      message: "Email verified successfully.",
      user: createdUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message || "Verification failed." });
  }
};
