import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { orders, type TOrdersInsert, type TOrdersSelect } from "../drizzle/schema";

// Get all orders
export const getOrdersServices = async (): Promise<TOrdersSelect[] | null> => {
  return await db.query.orders.findMany();
};

// Get order by ID
export const getOrderByIdServices = async (orderId: number): Promise<TOrdersSelect | undefined> => {
  return await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });
};

// Create a new order
export const createOrderServices = async (order: TOrdersInsert): Promise<string> => {
  await db.insert(orders).values(order).returning();
  return "Order Created Successfully 🎉";
};

// Update an existing order
export const updateOrderServices = async (
  orderId: number,
  order: Partial<TOrdersInsert>
): Promise<string> => {
  await db.update(orders).set(order).where(eq(orders.id, orderId));
  return "Order Updated Successfully 😎";
};

// Delete an order
export const deleteOrderServices = async (orderId: number): Promise<boolean> => {
  const deletedRows = await db.delete(orders).where(eq(orders.id, orderId)).returning();
  return deletedRows.length > 0;
};

