import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { users, type TUserInsert, type TUserSelect } from "../drizzle/schema";

// Get all users
export const getUsersServices = async (): Promise<TUserSelect[] | null> => {
  return await db.query.users.findMany();
};

// Get user by ID
export const getUserByIdServices = async (userId: number): Promise<TUserSelect | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
};

// Create a new user
export const createUserServices = async (user: TUserInsert): Promise<string> => {
  await db.insert(users).values(user).returning();
  return "User Created Successfully 😎";
};

// Update an existing user
export const updateUserServices = async (userId: number, user: Partial<TUserInsert>): Promise<string> => {
  await db.update(users).set(user).where(eq(users.id, userId));
  return "User Updated Successfully 😎";
};

// Delete a user
export const deleteUserServices = async (userId: number): Promise<boolean> => {
  const deletedRows = await db.delete(users).where(eq(users.id, userId)).returning();
  return deletedRows.length > 0;
};
