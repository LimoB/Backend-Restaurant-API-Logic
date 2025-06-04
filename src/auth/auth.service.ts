import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { users } from "../drizzle/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

type UserInsert = InferInsertModel<typeof users>;
type UserSelect = InferSelectModel<typeof users>;

// Register a new user
export const createUserServices = async (user: UserInsert): Promise<UserSelect> => {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
};

// Get user by email
export const getUserByEmailIdServices = async (email: string): Promise<UserSelect | undefined> => {
    return await db.query.users.findFirst({
        where: eq(users.email, email),
    });
};

// Save reset token and expiry for a user
export const saveResetTokenService = async (
    userId: number,
    token: string | null,
    expiry: Date | null
): Promise<void> => {
    await db.update(users)
        .set({
            verification_code: token ?? "",
            updated_at: new Date(),
        })
        .where(eq(users.id, userId));
};

// Get user by reset token
export const getUserByResetTokenService = async (token: string): Promise<UserSelect | undefined> => {
    return await db.query.users.findFirst({
        where: eq(users.verification_code, token),
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
        })
        .where(eq(users.id, userId));
};
