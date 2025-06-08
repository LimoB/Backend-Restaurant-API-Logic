import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { restaurant_owner, type TRestaurantOwnerInsert } from "../drizzle/schema";

/// Get all restaurant owners with user and restaurant names
export const getRestaurantOwnersServices = async () => {
  return await db.query.restaurant_owner.findMany({
    with: {
      user: {
        columns: { id: true, name: true },    // object with booleans
      },
      restaurant: {
        columns: { id: true, name: true },
      },
    },
  });
};

// Get restaurant owner by ID with user and restaurant names
export const getRestaurantOwnerByIdServices = async (id: number) => {
  return await db.query.restaurant_owner.findFirst({
    where: eq(restaurant_owner.id, id),
    with: {
      user: {
        columns: { id: true, name: true },
      },
      restaurant: {
        columns: { id: true, name: true },
      },
    },
  });
};

// Get all restaurant owners by owner_id with user and restaurant names
export const getRestaurantOwnersByOwnerIdServices = async (ownerId: number) => {
  return await db.query.restaurant_owner.findMany({
    where: eq(restaurant_owner.owner_id, ownerId),
    with: {
      user: {
        columns: { id: true, name: true },
      },
      restaurant: {
        columns: { id: true, name: true },
      },
    },
  });
};

// Create a new restaurant owner
export const createRestaurantOwnerServices = async (
  data: TRestaurantOwnerInsert
): Promise<string> => {
  await db.insert(restaurant_owner).values(data).returning();
  return "Restaurant Owner Created Successfully 🏠";
};

// Update restaurant owner by ID
export const updateRestaurantOwnerServices = async (
  id: number,
  data: Partial<TRestaurantOwnerInsert>
): Promise<string> => {
  await db.update(restaurant_owner).set(data).where(eq(restaurant_owner.id, id));
  return "Restaurant Owner Updated Successfully 🏢";
};

// Delete restaurant owner by ID
export const deleteRestaurantOwnerServices = async (id: number): Promise<boolean> => {
  const deletedRows = await db.delete(restaurant_owner).where(eq(restaurant_owner.id, id)).returning();
  return deletedRows.length > 0;
};
