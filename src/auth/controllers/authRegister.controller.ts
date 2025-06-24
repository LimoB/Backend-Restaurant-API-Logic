import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import {
  getUserByEmailIdServices,
  createUnverifiedUserService,
  getUnverifiedUserByEmail,
  deleteUnverifiedUserById,
} from "../auth.service";
import { sendNotificationEmail } from "../../middleware/googleMailer";

const allowedUserTypes = ["member", "admin", "driver", "owner"] as const;
type AllowedUserType = typeof allowedUserTypes[number];

export const createUser = async (req: Request, res: Response): Promise<void> => {
  console.log("🚨 createUser called", req.body);

  try {
    const { name, email, password, contact_phone, user_type } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required." });
      return;
    }

    const existingUser = await getUserByEmailIdServices(email);
    if (existingUser) {
      res.status(400).json({ error: "A user with this email already exists." });
      return;
    }

    const existingUnverified = await getUnverifiedUserByEmail(email);
    if (existingUnverified) {
      await deleteUnverifiedUserById(existingUnverified.id);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const rawType = user_type?.toLowerCase?.();
    const finalType: AllowedUserType = allowedUserTypes.includes(rawType as AllowedUserType)
      ? (rawType as AllowedUserType)
      : "member";

    await createUnverifiedUserService({
      name,
      email,
      password: hashedPassword,
      contact_phone: contact_phone || "0000000000",
      verification_code: verificationCode,
      verification_code_expiry: expiry,
      user_type: finalType,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const subject = "Email Verification Required";
    const htmlMessage = `
      <p>Hello ${name},</p>
      <p>Your verification code is:</p>
      <h2 style="color:blue;">${verificationCode}</h2>
      <p>Please enter this code to complete your registration. It expires in 10 minutes.</p>
    `;

    await sendNotificationEmail(email, name, subject, htmlMessage);

    res.status(201).json({
      message: "A verification email has been sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("❌ Error in createUser:", error);
    res.status(500).json({ error: (error as Error).message || "Failed to register user." });
  }
};
