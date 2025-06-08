import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { state, TStateInsert, TStateSelect } from "../drizzle/schema";

// Get all states with city names
export const getStatesServices = async (): Promise<TStateSelect[] | null> => {
  return await db.query.state.findMany({
    with: {
      cities: {
        columns: {
          name: true,
        },
      },
    },
  });
};

// Get state by ID with cities
export const getStateByIdServices = async (
  stateId: number
): Promise<TStateSelect | undefined> => {
  return await db.query.state.findFirst({
    where: eq(state.id, stateId),
    with: {
      cities: {
        columns: {
          name: true,
        },
      },
    },
  });
};

// Create new state
export const createStateServices = async (
  stateData: TStateInsert
): Promise<string> => {
  await db.insert(state).values(stateData).returning();
  return "State created successfully 🎉";
};

// Update existing state
export const updateStateServices = async (
  stateId: number,
  stateData: Partial<TStateInsert>
): Promise<string> => {
  await db.update(state).set(stateData).where(eq(state.id, stateId));
  return "State updated successfully 😎";
};

// Delete state
export const deleteStateServices = async (
  stateId: number
): Promise<string> => {
  await db.delete(state).where(eq(state.id, stateId));
  return "State deleted successfully 🎉";
};
