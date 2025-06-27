import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { createUserService, getUserByEmailIdServices } from "../auth.service";
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

    const existing = await getUserByEmailIdServices(email);
    if (existing) {
      res.status(409).json({ error: "A user with this email already exists." });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);

    const types = ["member", "admin", "driver", "owner"] as const;
    type Allowed = typeof types[number];
    const finalType: Allowed = types.includes(user_type.toLowerCase() as Allowed)
      ? (user_type.toLowerCase() as Allowed)
      : "member";

    const newUser = await createUserService({
      name: full_name,
      email,
      password: hashed,
      contact_phone,
      user_type: finalType,
      email_verified: true,
      phone_verified: false,
      verification_code: null,
      reset_token: null,
      reset_token_expiry: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // 🎉 Styled email with emojis
    const html = `
      <p style="font-size: 1.1em;">👋 Hello <strong>${newUser.name}</strong>,</p>
      <p>🎉 We're excited to have you on board! Your account has been created by an administrator.</p>
      <p><strong> Login Credentials:</strong></p>
      <ul style="list-style: none; padding-left: 0;">
        <li><strong>Email:</strong> ${newUser.email}</li>
        <li> <strong>Password:</strong> ${password}</li>
      </ul>
      <p>You can login here: <a href="https://li-amazingrestaurant.com.com/login" style="color: #007bff;">https://li-amazingrestaurant.com/login</a></p>
      <p>If you have any questions❓, feel free to reach out to our support team.</p>
      <p style="margin-top: 30px;">Warm regards,<br/>💼 The YourApp Team</p>
    `;

    await sendNotificationEmail(
      newUser.email,
      newUser.name,
      "🎉 Welcome to Our Platform!",
      html
    );

    res.status(201).json({ message: "User created and welcome email sent." });
  } catch (error) {
    next(error);
  }
};
