// src/restaurant/restaurant.service.ts
import { eq } from "drizzle-orm";
import db from "../drizzle/db"; // Ensure this path is correct
import {
  TRestaurantInsert,
  TRestaurantSelect,
  restaurant, // Use the schema definition 'restaurant'
} from "../drizzle/schema"; // Ensure this path is correct

// CRUD Operations for Restaurant entity

/**
 * Retrieves all restaurants.
 */
export const getRestaurantsServices = async (): Promise<
  TRestaurantSelect[] | null
> => {
  // try...catch can be added here if you want service-level logging,
  // but the provided format implies simpler error propagation.
  const allRestaurants = await db.query.restaurant.findMany({});
  return allRestaurants.length > 0 ? allRestaurants : null;
};

/**
 * Retrieves a single restaurant by its ID.
 */
export const getRestaurantByIdServices = async (
  restaurantId: number
): Promise<TRestaurantSelect | undefined> => {
  return await db.query.restaurant.findFirst({
    where: eq(restaurant.id, restaurantId), // Ensure 'id' is the correct primary key name in your restaurant schema
  });
};

/**
 * Creates a new restaurant.
 */
export const createRestaurantServices = async (
  restaurantData: TRestaurantInsert
): Promise<string> => {
  try {
    await db.insert(restaurant).values(restaurantData); // .returning() is optional if you only return a string
    return "Restaurant created successfully 🎉";
  } catch (error: any) {
    // Basic error handling to return a string, matching the state.service.ts style
    console.error("Error creating restaurant:", error);
    if (
      error.code === "23503" &&
      error.constraint === "restaurant_city_id_fkey"
    ) {
      return `Error: City with ID ${restaurantData.city_id} does not exist.`;
    }
    if (error.code === "23505") {
      return `Error: A restaurant with this unique identifier already exists.`;
    }
    return "Failed to create restaurant."; // Generic error message
  }
};

/**
 * Updates an existing restaurant.
 */
export const updateRestaurantServices = async (
  restaurantId: number,
  restaurantData: Partial<TRestaurantInsert>
): Promise<string> => {
  try {
    // Check if any rows were affected to determine if the update was "successful"
    // Drizzle's update().returning() would give more info, but here we just attempt the update.
    const result = await db
      .update(restaurant)
      .set(restaurantData)
      .where(eq(restaurant.id, restaurantId))
      .returning({ id: restaurant.id }); // Returning something minimal to check if a row was matched

    if (result.length > 0) {
      return "Restaurant updated successfully 😎";
    } else {
      return "Restaurant not found or no changes made.";
    }
  } catch (error: any) {
    console.error("Error updating restaurant:", error);
    if (
      error.code === "23503" &&
      restaurantData.city_id &&
      error.constraint === "restaurant_city_id_fkey"
    ) {
      return `Error: City with ID ${restaurantData.city_id} does not exist for update.`;
    }
    return "Failed to update restaurant.";
  }
};

/**
 * Deletes a restaurant by its ID.
 */
export const deleteRestaurantServices = async (
  restaurantId: number
): Promise<string> => {
  try {
    const result = await db
      .delete(restaurant)
      .where(eq(restaurant.id, restaurantId))
      .returning({ id: restaurant.id }); // Returning something minimal

    if (result.length > 0) {
      return "Restaurant deleted successfully 🎉";
    } else {
      return "Restaurant not found.";
    }
  } catch (error: any) {
    console.error("Error deleting restaurant:", error);
    if (error.code === "23503") {
      return `Error: Cannot delete restaurant. It is referenced by other records.`;
    }
    return "Failed to delete restaurant.";
  }
};

// --- Service for specific queries (if needed, separate from basic CRUD) ---

/**
 * Retrieves all restaurants associated with a specific city ID.
 * This function follows the more detailed query pattern and can return objects.
 */
export const getRestaurantsByCityServices = async (
  cityIdParam: number
): Promise<TRestaurantSelect[] | null> => {
  try {
    const restaurantsInCity = await db.query.restaurant.findMany({
      where: eq(restaurant.city_id, cityIdParam),
      // orderBy: (restaurants, { asc }) => [asc(restaurants.name)] // Optional: add asc to imports
    });
    return restaurantsInCity.length > 0 ? restaurantsInCity : null;
  } catch (error) {
    console.error(
      `Error fetching restaurants for city ID ${cityIdParam}:`,
      error
    );
    return null;
  }
};

// If you need a function to get a restaurant WITH details (relations),
// it would be a separate function like 'getRestaurantWithDetailsServices' from previous examples,
// as it doesn't fit the simple string-returning CRUD pattern.
