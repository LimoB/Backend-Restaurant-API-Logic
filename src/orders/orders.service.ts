import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  orders,
  type TOrdersInsert,
  type TOrdersSelect,
} from "../drizzle/schema";

// Get all orders with relations
export const getOrdersServices = async () => {
  return await db.query.orders.findMany({
    with: {
      user: {
        with: {
          address: {
            with: {
              city: {
                with: {
                  state: true,
                },
              },
            },
          },
        },
      },
      driver: {
        with: {
          user: true,
        },
      },
      restaurant: {
        with: {
          city: true,
        },
      },
      address: {
        with: {
          city: {
            with: {
              state: true,
            },
          },
        },
      },
      orderMenuItems: {
        with: {
          menuItem: {
            with: {
              category: true,
              restaurant: true,
            },
          },
        },
      },
      comments: {
        with: {
          user: true,
        },
      },
      statuses: {
        with: {
          statusCatalog: true,
        },
      },
    },
  });
};

// Get a single order by ID with relations
export const getOrderByIdServices = async (orderId: number) => {
  return await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      user: {
        with: {
          address: {
            with: {
              city: {
                with: {
                  state: true,
                },
              },
            },
          },
        },
      },
      driver: {
        with: {
          user: true,
        },
      },
      restaurant: {
        with: {
          city: true,
        },
      },
      address: {
        with: {
          city: {
            with: {
              state: true,
            },
          },
        },
      },
      orderMenuItems: {
        with: {
          menuItem: {
            with: {
              category: true,
              restaurant: true,
            },
          },
        },
      },
      comments: {
        with: {
          user: true,
        },
      },
      statuses: {
        with: {
          statusCatalog: true,
        },
      },
    },
  });
};

// Create a new order
export const createOrderServices = async (
  order: TOrdersInsert
): Promise<string> => {
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
export const deleteOrderServices = async (
  orderId: number
): Promise<boolean> => {
  const deletedRows = await db.delete(orders).where(eq(orders.id, orderId)).returning();
  return deletedRows.length > 0;
};
