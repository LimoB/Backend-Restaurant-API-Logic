import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { status_catalog } from "../drizzle/schema";
import type { InferModel } from "drizzle-orm";

// Define types for status insert and select from your schema
export type TStatusInsert = InferModel<typeof status_catalog, "insert">;
export type TStatusSelect = InferModel<typeof status_catalog, "select">;

// Get all statuses
export const getStatusesServices = async (): Promise<TStatusSelect[] | null> => {
  return await db.query.status_catalog.findMany();
};

// Get status by ID
export const getStatusByIdServices = async (statusId: number): Promise<TStatusSelect | undefined> => {
  return await db.query.status_catalog.findFirst({
    where: eq(status_catalog.id, statusId),
  });
};

// Create a new status
export const createStatusServices = async (statusData: TStatusInsert): Promise<string> => {
  await db.insert(status_catalog).values(statusData).returning();
  return "Status created successfully 🎉";
};

// Update an existing status by ID
export const updateStatusServices = async (statusId: number, statusData: Partial<TStatusInsert>): Promise<string> => {
  await db.update(status_catalog).set(statusData).where(eq(status_catalog.id, statusId));
  return "Status updated successfully 😎";
};

// Delete a status by ID
export const deleteStatusServices = async (statusId: number): Promise<string> => {
  await db.delete(status_catalog).where(eq(status_catalog.id, statusId));
  return "Status deleted successfully 🎉";
};