// invite.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
    createUnverifiedUserService,
    getUnverifiedUserByEmail,
    deleteUnverifiedUserById,
} from "./auth.service";
import { sendNotificationEmail } from "../middleware/googleMailer";

// ✅ Only these user types are allowed
const allowedUserTypes = ["member", "admin", "driver", "owner"] as const;
type AllowedUserType = typeof allowedUserTypes[number];

export const adminCreateUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, full_name, user_type, contact_phone } = req.body;

        console.log("📩 Incoming invite data:", req.body);

        // ✅ Check for missing fields
        if (!email || !full_name || !user_type || !contact_phone) {
            res.status(400).json({
                error: "All fields (email, full_name, user_type, contact_phone) are required.",
            });
            return;
        }

        // ✅ Normalize and validate user_type
        const normalizedType = user_type.toLowerCase();
        if (!allowedUserTypes.includes(normalizedType as AllowedUserType)) {
            res.status(400).json({ error: "Invalid user_type. Must be one of: member, admin, driver, owner." });
            return;
        }
        const validUserType = normalizedType as AllowedUserType;

        // ✅ Delete any unverified record with the same email
        const existingUnverified = await getUnverifiedUserByEmail(email);
        if (existingUnverified) {
            await deleteUnverifiedUserById(existingUnverified.id);
        }

        // ✅ Generate temporary password and verification code
        const tempPassword = crypto.randomBytes(4).toString("hex");
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // ✅ Create the unverified user
        await createUnverifiedUserService({
            name: full_name,
            email,
            password: hashedPassword,
            contact_phone,
            user_type: validUserType,
            verification_code: verificationCode,
            verification_code_expiry: expiry,
            created_at: new Date(),
            updated_at: new Date(),
        });

        // ✅ Compose email
        const subject = "You're Invited to Join Our Platform";
        const htmlMessage = `
      <p>Hello ${full_name},</p>
      <p>You have been invited to join our platform. Please verify your email to activate your account.</p>
      <p><strong>🔐 Verification Code: ${verificationCode}</strong></p>
      <p>Or click the link below:</p>
      <a href="https://yourapp.com/verify?code=${verificationCode}">Verify Your Email</a>
      <hr />
      <p>Temporary Login Details:</p>
      <ul>
        <li>Email: <strong>${email}</strong></li>
        <li>Password: <strong>${tempPassword}</strong></li>
      </ul>
      <p><em>This code will expire in 15 minutes.</em></p>
    `;

        await sendNotificationEmail(email, full_name, subject, htmlMessage);

        res.status(201).json({ message: "Invitation sent successfully." });
    } catch (error) {
        console.error("❌ Error in adminCreateUser:", error);
        const err = error as Error;
        res.status(500).json({ error: err.message || "Failed to send invitation." });
    }
};

// Stub to confirm endpoint is reachable
export const verifyEmail = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.status(200).json({ message: "Verification endpoint works." });
};
