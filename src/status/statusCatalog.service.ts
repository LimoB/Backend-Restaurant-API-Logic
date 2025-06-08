import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { order_status } from "../drizzle/schema";
import type { InferModel } from "drizzle-orm";

export type TOrderStatusInsert = InferModel<typeof order_status, "insert">;
export type TOrderStatusSelect = InferModel<typeof order_status, "select">;

// Get all order statuses with status name and restaurant name only
export const getOrderStatusesServices = async (): Promise<{
  statusName: string;
  orderName: string;
}[]> => {
  const statuses = await db.query.order_status.findMany({
    with: {
      statusCatalog: {
        columns: { name: true },
      },
      order: {
        columns: { id: true }, // must include id
        with: {
          restaurant: {
            columns: { name: true },
          },
        },
      },
    },
  });

  return statuses.map((status) => ({
    statusName: status.statusCatalog.name,
    orderName: status.order.restaurant.name,
  }));
};

// Get a specific order status by ID with status name and restaurant name
export const getOrderStatusByIdServices = async (
  id: number
): Promise<{ statusName: string; orderName: string } | undefined> => {
  const status = await db.query.order_status.findFirst({
    where: eq(order_status.id, id),
    with: {
      statusCatalog: {
        columns: { name: true },
      },
      order: {
        columns: { id: true },
        with: {
          restaurant: {
            columns: { name: true },
          },
        },
      },
    },
  });

  return status
    ? {
        statusName: status.statusCatalog.name,
        orderName: status.order.restaurant.name,
      }
    : undefined;
};

// Create a new order status entry
export const createOrderStatusServices = async (
  orderStatusData: TOrderStatusInsert
): Promise<string> => {
  await db.insert(order_status).values(orderStatusData);
  return "Order status created successfully 🎉";
};

// Update an order status by ID
export const updateOrderStatusServices = async (
  id: number,
  orderStatusData: Partial<TOrderStatusInsert>
): Promise<string> => {
  await db.update(order_status).set(orderStatusData).where(eq(order_status.id, id));
  return "Order status updated successfully 😎";
};

// Delete an order status by ID
export const deleteOrderStatusServices = async (id: number): Promise<string> => {
  await db.delete(order_status).where(eq(order_status.id, id));
  return "Order status deleted successfully 🎉";
};