import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { users, unverified_users } from "../drizzle/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { sendNotificationEmail } from "../middleware/googleMailer";

// ────────────────────────────────
// TYPES
// ────────────────────────────────

type UserInsert = InferInsertModel<typeof users>;
type UserSelect = InferSelectModel<typeof users>;

type UnverifiedUserInsert = InferInsertModel<typeof unverified_users>;
type UnverifiedUserSelect = InferSelectModel<typeof unverified_users>;

const allowedUserTypes = ["member", "admin", "driver", "owner"] as const;
type AllowedUserType = typeof allowedUserTypes[number];

function isUserType(value: any): value is AllowedUserType {
  return allowedUserTypes.includes(value);
}

// ────────────────────────────────
// USERS TABLE SERVICES
// ────────────────────────────────

export const createUserService = async (user: UserInsert): Promise<UserSelect> => {
  const [newUser] = await db.insert(users).values(user).returning();
  return newUser;
};



export const getUserByEmailIdServices = async (
  email: string
): Promise<UserSelect | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
};

export const saveResetTokenService = async (
  userId: number,
  token: string | null,
  expiry: Date | null
): Promise<void> => {
  await db.update(users)
    .set({
      reset_token: token ?? null,
      reset_token_expiry: expiry ?? null,
      updated_at: new Date(),
    })
    .where(eq(users.id, userId));
};

export const getUserByResetTokenService = async (
  token: string
): Promise<UserSelect | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.reset_token, token),
  });
};

export const resetUserPasswordService = async (
  userId: number,
  hashedPassword: string
): Promise<void> => {
  await db.update(users)
    .set({
      password: hashedPassword,
      updated_at: new Date(),
      reset_token: null,
      reset_token_expiry: null,
    })
    .where(eq(users.id, userId));
};




// ────────────────────────────────
// UNVERIFIED USERS TABLE SERVICES
// ────────────────────────────────

export const createUnverifiedUserService = async (
  user: UnverifiedUserInsert
): Promise<UnverifiedUserSelect> => {
  const [newUnverified] = await db.insert(unverified_users).values(user).returning();
  return newUnverified;
};

export const getUnverifiedUserByEmail = async (
  email: string
): Promise<UnverifiedUserSelect | undefined> => {
  return await db.query.unverified_users.findFirst({
    where: eq(unverified_users.email, email),
  });
};

export const getUnverifiedUserByCode = async (
  code: string
): Promise<UnverifiedUserSelect | undefined> => {
  return await db.query.unverified_users.findFirst({
    where: eq(unverified_users.verification_code, code),
  });
};

export const deleteUnverifiedUserById = async (id: number): Promise<void> => {
  await db.delete(unverified_users).where(eq(unverified_users.id, id));
};

// ────────────────────────────────
// MOVE UNVERIFIED TO VERIFIED + LOGIN TOKEN + WELCOME EMAIL
// ────────────────────────────────

export const moveUnverifiedToVerified = async (
  unverifiedUser: UnverifiedUserSelect
): Promise<{ user: UserSelect; token: string }> => {
  if (!isUserType(unverifiedUser.user_type)) {
    throw new Error("Invalid user_type for unverified user");
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.email, unverifiedUser.email),
  });

  if (existing) {
    throw new Error("A verified user already exists with this email.");
  }

  const newUserData: UserInsert = {
    name: unverifiedUser.name,
    email: unverifiedUser.email,
    password: unverifiedUser.password,
    contact_phone: unverifiedUser.contact_phone,
    user_type: unverifiedUser.user_type,
    email_verified: true,
    phone_verified: false,
    verification_code: null,
    reset_token: null,
    reset_token_expiry: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const createdUser = await db.transaction(async (tx) => {
    const [user] = await tx.insert(users).values(newUserData).returning();
    await tx.delete(unverified_users).where(eq(unverified_users.id, unverifiedUser.id));
    return user;
  });

  // 🔐 Generate JWT token
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");

  const token = jwt.sign(
    {
      userId: createdUser.id,
      email: createdUser.email,
      user_type: createdUser.user_type,
    },
    secret,
    { expiresIn: "1h" }
  );



  // 📧 Send Welcome Email
  const subject = "🎉 Welcome to Our Platform!";
  const html = `
    <h2>Welcome, ${createdUser.name}!</h2>
    <p>Your email has been verified successfully and your account is now active.</p>
    <p>Start exploring your dashboard and enjoy the experience.</p>
    <p><strong>Email:</strong> ${createdUser.email}</p>
    <p><em>Explore Nice Food in the city.</em></p>
  `;

  await sendNotificationEmail(createdUser.email, createdUser.name, subject, html);

  return { user: createdUser, token };
};




export const updateVerificationCodeForUser = async (
  userId: number,
  code: string,
  expiry: Date
): Promise<void> => {
  await db
    .update(unverified_users)
    .set({
      verification_code: code,
      verification_code_expiry: expiry,
      updated_at: new Date(),
    })
    .where(eq(unverified_users.id, userId));
};
