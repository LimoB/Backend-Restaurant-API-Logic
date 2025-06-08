import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  users,
  type TUserInsert,
  type TUserSelect,
} from "../drizzle/schema";

// Get all users with related data
export const getUsersServices = async (): Promise<TUserSelect[]> => {
  try {
    const result = await db.query.users.findMany({
      with: {
        address: true,
        drivers: true,
        restaurantOwners: true,
        orders: true,
        comments: {
          with: {
            order: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Unable to fetch users");
  }
};

// Get single user by ID with related data
export const getUserByIdServices = async (
  userId: number
): Promise<TUserSelect | null> => {
  try {
    const result = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        address: true,
        drivers: true,
        restaurantOwners: true,
        orders: true,
        comments: {
          with: {
            order: true,
          },
        },
      },
    });
    return result ?? null;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw new Error("Unable to fetch user by ID");
  }
};

// Create a new user
export const createUserServices = async (
  user: TUserInsert
): Promise<string> => {
  try {
    const result = await db.insert(users).values(user).returning();
    if (result.length > 0) {
      return "✅ User created successfully!";
    }
    throw new Error("User creation failed");
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Unable to create user");
  }
};

// Update an existing user
export const updateUserServices = async (
  userId: number,
  user: Partial<TUserInsert>
): Promise<string> => {
  try {
    const result = await db
      .update(users)
      .set(user)
      .where(eq(users.id, userId))
      .returning();

    if (result.length > 0) {
      return "✅ User updated successfully!";
    }
    throw new Error("User update failed or user not found");
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    throw new Error("Unable to update user");
  }
};

// Delete a user
export const deleteUserServices = async (
  userId: number
): Promise<boolean> => {
  try {
    const result = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    return result.length > 0;
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw new Error("Unable to delete user");
  }
};
