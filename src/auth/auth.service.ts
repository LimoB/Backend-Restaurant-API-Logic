import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { users, unverified_users } from "../drizzle/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

type UserInsert = InferInsertModel<typeof users>;
type UserSelect = InferSelectModel<typeof users>;

type UnverifiedUserInsert = InferInsertModel<typeof unverified_users>;
type UnverifiedUserSelect = InferSelectModel<typeof unverified_users>;


// Allowed user types as literal array
const allowedUserTypes = ["member", "admin", "driver", "owner"] as const;
type AllowedUserType = typeof allowedUserTypes[number];

function isUserType(value: any): value is AllowedUserType {
  return allowedUserTypes.includes(value);
}

// ────────────────────────────────
// USERS TABLE SERVICES
// ────────────────────────────────

// Create verified user
export const createUserServices = async (user: UserInsert): Promise<UserSelect> => {
  const [newUser] = await db.insert(users).values(user).returning();
  return newUser;
};

// Get verified user by email
export const getUserByEmailIdServices = async (
  email: string
): Promise<UserSelect | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
};

// Save reset token and expiry
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

// Get user by reset token
export const getUserByResetTokenService = async (
  token: string
): Promise<UserSelect | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.reset_token, token),
  });
};

// Reset user password
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

// Create unverified user
export const createUnverifiedUserService = async (
  user: UnverifiedUserInsert
): Promise<UnverifiedUserSelect> => {
  const [newUnverified] = await db.insert(unverified_users).values(user).returning();
  return newUnverified;
};

// Get unverified user by email
export const getUnverifiedUserByEmail = async (
  email: string
): Promise<UnverifiedUserSelect | undefined> => {
  return await db.query.unverified_users.findFirst({
    where: eq(unverified_users.email, email),
  });
};

// Get unverified user by verification code
export const getUnverifiedUserByCode = async (
  code: string
): Promise<UnverifiedUserSelect | undefined> => {
  return await db.query.unverified_users.findFirst({
    where: eq(unverified_users.verification_code, code),
  });
};

// Delete unverified user by ID
export const deleteUnverifiedUserById = async (id: number): Promise<void> => {
  await db.delete(unverified_users).where(eq(unverified_users.id, id));
};

// ────────────────────────────────
// Helper: Move unverified user to verified users
// ────────────────────────────────
export const moveUnverifiedToVerified = async (
  unverifiedUser: UnverifiedUserSelect
): Promise<UserSelect> => {
  if (!isUserType(unverifiedUser.user_type)) {
    throw new Error("Invalid user_type for unverified user");
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

  return await db.transaction(async (tx) => {
    const [newUser] = await tx.insert(users).values(newUserData).returning();
    await tx.delete(unverified_users).where(eq(unverified_users.id, unverifiedUser.id));
    return newUser;
  });
};
