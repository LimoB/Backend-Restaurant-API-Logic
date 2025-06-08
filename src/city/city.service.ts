import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { city, state } from "../drizzle/schema";
import type { InferModel } from "drizzle-orm";

// Define types for city insert and select from your schema
export type TCityInsert = InferModel<typeof city, "insert">;
export type TCitySelect = InferModel<typeof city, "select">;

// Get all cities with related state info (name, code)
export const getCitysServices = async (): Promise<(TCitySelect & { state: { name: string; code: string } })[] | null> => {
  return await db.query.city.findMany({
    with: {
      state: {
        columns: {
          name: true,
          code: true,
        },
      },
    },
  });
};

// Get city by ID
export const getCityByIdServices = async (cityId: number): Promise<TCitySelect | undefined> => {
  return await db.query.city.findFirst({
    where: eq(city.id, cityId),
  });
};

// Create a new city
export const createCityServices = async (cityData: TCityInsert): Promise<string> => {
  await db.insert(city).values(cityData).returning();
  return "City created successfully 🎉";
};

// Update an existing city by ID
export const updateCityServices = async (cityId: number, cityData: Partial<TCityInsert>): Promise<string> => {
  await db.update(city).set(cityData).where(eq(city.id, cityId));
  return "City updated successfully 😎";
};

// Delete a city by ID
export const deleteCityServices = async (cityId: number): Promise<string> => {
  await db.delete(city).where(eq(city.id, cityId));
  return "City deleted successfully 🎉";
};
