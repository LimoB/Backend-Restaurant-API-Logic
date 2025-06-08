import db from "../drizzle/db";; // adjust based on your setup
import { order_status } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Get all order statuses
export const getOrderStatusesServices = async () => {
  return await db.select().from(order_status);
};

// Get order status by ID
export const getOrderStatusByIdServices = async (id: number) => {
  const result = await db.select().from(order_status).where(eq(order_status.id, id));
  return result[0];
};

// Create new order status
export const createOrderStatusServices = async (data: {
  order_id: number;
  status_catalog_id: number;
}) => {
  const result = await db.insert(order_status).values(data).returning();
  return result[0];
};

// Update order status
export const updateOrderStatusServices = async (
  id: number,
  data: { order_id?: number; status_catalog_id?: number }
) => {
  const result = await db
    .update(order_status)
    .set({ ...data, updated_at: new Date() })
    .where(eq(order_status.id, id))
    .returning();
  return result[0];
};

// Delete order status
export const deleteOrderStatusServices = async (id: number) => {
  const result = await db.delete(order_status).where(eq(order_status.id, id)).returning();
  return result[0];
};
