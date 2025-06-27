import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  orders,
  order_menu_item,
  comment,
  order_status,
  type TOrdersInsert,
  type TOrdersSelect,
} from "../drizzle/schema";



// ✅ Safe & Correctly Typed Nested Relations
const orderRelations = {
  user: {
    columns: { id: true, name: true },
    with: {
      address: {
        columns: { id: true, street_address_1: true },
        with: {
          city: {
            columns: { id: true, name: true },
            with: {
              state: {
                columns: { id: true, name: true, code: true },
              },
            },
          },
        },
      },
    },
  },

  driver: {
    with: {
      user: {
        columns: { id: true, name: true },
      },
    },
  },

  restaurant: {
    columns: { id: true, name: true },
    with: {
      city: {
        columns: { id: true, name: true },
        with: {
          state: {
            columns: { id: true, name: true, code: true },
          },
        },
      },
    },
  },

  address: {
    columns: { id: true, street_address_1: true },
    with: {
      city: {
        columns: { id: true, name: true },
        with: {
          state: {
            columns: { id: true, name: true, code: true },
          },
        },
      },
    },
  },

  orderMenuItems: {
    columns: {
      id: true,
      quantity: true,
      price: true,
      comment: true,
      item_name: true,
    },
    with: {
      menuItem: {
        columns: { id: true, name: true, price: true },
        with: {
          category: {
            columns: { id: true, name: true },
          },
          restaurant: {
            columns: { id: true, name: true },
          },
        },
      },
    },
  },

  comments: {
    columns: {
      id: true,
      comment_text: true,
      comment_type: true,
      rating: true,
      created_at: true,
    },
    with: {
      user: {
        columns: { id: true, name: true },
      },
    },
  },

  statuses: {
    columns: { id: true, created_at: true },
    with: {
      statusCatalog: {
        columns: { id: true, name: true },
      },
    },
  },
};





// 🔹 Get all orders
export const getOrdersServices = async (): Promise<TOrdersSelect[]> => {
  return await db.query.orders.findMany({
    with: orderRelations,
  });
};

// 🔹 Get a single order by ID
export const getOrderByIdServices = async (
  orderId: number
): Promise<TOrdersSelect | undefined> => {
  return await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: orderRelations,
  });
};

// 🔹 Create a new order (only order row)
export const createOrderServices = async (
  order: TOrdersInsert
): Promise<TOrdersInsert & { id: number }> => {
  try {
    const [newOrder] = await db.insert(orders).values(order).returning();

    if (!newOrder || typeof newOrder.id !== "number") {
      throw new Error("No ID returned from order insert.");
    }

    return newOrder;
  } catch (error) {
    console.error("❌ Failed to create order:", error);
    throw error;
  }
};

// 🔹 Create a new order with cart items
interface CartItemInput {
  menu_item_id: number;
  item_name: string;
  quantity: number;
  price: string;
  comment?: string;
}

interface CreateFullOrderInput extends TOrdersInsert {
  cart: CartItemInput[];
}

export const createOrderWithItemsService = async (
  input: CreateFullOrderInput
): Promise<{
  order: TOrdersInsert & { id: number };
  items: any[];
}> => {
  const { cart, ...orderData } = input;

  // ✅ Convert actual_delivery_time from string to Date if needed
  if (
    orderData.actual_delivery_time &&
    typeof orderData.actual_delivery_time === "string"
  ) {
    orderData.actual_delivery_time = new Date(orderData.actual_delivery_time);
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    throw new Error("Cart is empty or invalid.");
  }

  // ✅ Create order first
  const [newOrder] = await db.insert(orders).values(orderData).returning();

  if (!newOrder || typeof newOrder.id !== "number") {
    throw new Error("Order was not created or ID missing.");
  }

  const orderId = newOrder.id;

  // ✅ Insert each cart item with default empty comment if missing
  const insertedItems = [];

  for (const item of cart) {
    const isValid =
      typeof item.menu_item_id === "number" &&
      typeof item.item_name === "string" &&
      typeof item.quantity === "number" &&
      typeof item.price === "string";

    if (!isValid) {
      console.warn("⚠️ Skipping invalid cart item:", item);
      continue;
    }

    const [inserted] = await db
      .insert(order_menu_item)
      .values({
        order_id: orderId,
        menu_item_id: item.menu_item_id,
        item_name: item.item_name,
        quantity: item.quantity,
        price: item.price,
        comment: item.comment ?? "",
      })
      .returning();

    insertedItems.push(inserted);
  }

  return {
    order: newOrder,
    items: insertedItems,
  };
};


// 🔹 Update an existing order
export const updateOrderServices = async (
  orderId: number,
  order: Partial<TOrdersInsert>
): Promise<string> => {
  const updatedOrder: Partial<TOrdersInsert> = {
    ...order,
    actual_delivery_time: order.actual_delivery_time
      ? new Date(order.actual_delivery_time)
      : undefined,
  };

  try {
    await db.update(orders).set(updatedOrder).where(eq(orders.id, orderId));
    return "✅ Order updated successfully!";
  } catch (error) {
    console.error("❌ Failed to update order:", error);
    throw new Error("Failed to update order.");
  }
};

// 🔹 Delete an order

export const deleteOrderServices = async (
  orderId: number
): Promise<boolean> => {
  try {
    // Delete related order_menu_items
    await db.delete(order_menu_item).where(eq(order_menu_item.order_id, orderId));

    // Delete related comments
    await db.delete(comment).where(eq(comment.order_id, orderId));

    // Delete related statuses
    await db.delete(order_status).where(eq(order_status.order_id, orderId));

    // Finally, delete the order itself
    const deleted = await db.delete(orders).where(eq(orders.id, orderId)).returning();

    return deleted.length > 0;
  } catch (error) {
    console.error("❌ Failed to delete order:", error);
    throw new Error("Failed to delete order.");
  }
};

