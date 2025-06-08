// src/driver/driver.service.ts
import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { driver, type TDriverInsert, type TDriverSelect } from "../drizzle/schema";

// Get all drivers
export const getDriversServices = async (): Promise<TDriverSelect[] | null> => {
  return await db.query.driver.findMany({
    with:{
        user:true,
    }
  });
};

// Get driver by ID
export const getDriverByIdServices = async (driverId: number): Promise<TDriverSelect | undefined> => {
  return await db.query.driver.findFirst({
    where: eq(driver.id, driverId),
    with: {
        user:true,
    }
  });
};

// Get drivers by user ID
export const getDriversByUserIdServices = async (userId: number): Promise<TDriverSelect[] | null> => {
  return await db.query.driver.findMany({
    where: eq(driver.user_id, userId),
  });
};

// Create a new driver
export const createDriverServices = async (driverData: TDriverInsert): Promise<string> => {
  await db.insert(driver).values(driverData).returning();
  return "Driver Created Successfully 🚗";
};

// Update an existing driver
export const updateDriverServices = async (
  driverId: number,
  driverData: Partial<TDriverInsert>
): Promise<string> => {
  await db.update(driver).set(driverData).where(eq(driver.id, driverId));
  return "Driver Updated Successfully 🚙";
};

// Delete a driver
export const deleteDriverServices = async (driverId: number): Promise<boolean> => {
  const deletedRows = await db.delete(driver).where(eq(driver.id, driverId)).returning();
  return deletedRows.length > 0;
};
