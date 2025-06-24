import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import {
  createUnverifiedUserService,
  deleteUnverifiedUserById,
  getUnverifiedUserByEmail,
} from "../auth.service";
import { sendNotificationEmail } from "../../middleware/googleMailer";

export const adminCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, full_name, password, user_type, contact_phone } = req.body;

    if (!email || !full_name || !password || !user_type || !contact_phone) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    const existing = await getUnverifiedUserByEmail(email);
    if (existing) await deleteUnverifiedUserById(existing.id);

    const hashed = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    const types = ["member", "admin", "driver", "owner"] as const;
    type Allowed = typeof types[number];
    const finalType: Allowed = types.includes(user_type.toLowerCase() as Allowed)
      ? (user_type.toLowerCase() as Allowed)
      : "member";

    await createUnverifiedUserService({
      name: full_name,
      email,
      password: hashed,
      contact_phone,
      verification_code: code,
      verification_code_expiry: expiry,
      user_type: finalType,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const html = `
      <p><strong>Verification Code: ${code}</strong></p>
      <a href="https://yourapp.com/verify?code=${code}">Verify Account</a>
      <hr />
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
    `;
    await sendNotificationEmail(email, full_name, "Admin Created Account", html);

    res.status(201).json({ message: "User created and verification email sent." });
  } catch (error) {
    next(error);
  }
};
