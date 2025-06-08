// src/order_menu_item/order_menu_item.service.ts
import { eq } from "drizzle-orm";
import db from "../drizzle/db"; // Ensure this path is correct
import {
  TOrderMenuItemInsert,
  TOrderMenuItemSelect,
  order_menu_item, // Corrected: use the schema definition
  // Import 'orders' and 'menu_item' if needed for explicit table references elsewhere
  // orders,
  // menu_item
} from "../drizzle/schema"; // Ensure this path is correct

export const getOrderMenuItemsServices = async (): Promise<
  TOrderMenuItemSelect[] | null
> => {
  try {
    const items = await db.query.order_menu_item.findMany({
      with: {
        order: true, // From orderMenuItemRelations
        menuItem: true, // From orderMenuItemRelations
      },
    });
    return items.length > 0 ? items : null;
  } catch (error) {
    console.error("Error fetching order menu items:", error);
    return null;
  }
};

export const getOrderMenuItemByIdServices = async (
  orderMenuItemId: number
): Promise<TOrderMenuItemSelect | undefined> => {
  try {
    return await db.query.order_menu_item.findFirst({
      where: eq(order_menu_item.id, orderMenuItemId),
      with: {
        order: true,
        menuItem: true,
      },
    });
  } catch (error) {
    console.error(
      `Error fetching order menu item with ID ${orderMenuItemId}:`,
      error
    );
    return undefined;
  }
};

// Consider returning the created item or its ID
export const createOrderMenuItemServices = async (
  itemData: TOrderMenuItemInsert
): Promise<TOrderMenuItemSelect | string> => {
  try {
    // Ensure itemData.item_name and itemData.price are correctly populated before this call.
    // These are not directly from menu_item in the body, but rather specific to this order line item.
    const newItems = await db
      .insert(order_menu_item)
      .values(itemData)
      .returning();
    if (newItems && newItems.length > 0) {
      // To get relations, you'd typically query again or ensure your 'returning' statement can fetch them
      // For now, returning the basic inserted item:
      return newItems[0] as TOrderMenuItemSelect; // Or a success message string
    }
    return "Failed to create order menu item or no item returned.";
  } catch (error) {
    console.error("Error creating order menu item:", error);
    throw error; // Re-throw to be caught by controller
  }
};

// Consider returning the updated item or a boolean
export const updateOrderMenuItemServices = async (
  orderMenuItemId: number,
  itemData: Partial<TOrderMenuItemInsert>
): Promise<TOrderMenuItemSelect | string | null> => {
  try {
    const updatedItems = await db
      .update(order_menu_item)
      .set(itemData)
      .where(eq(order_menu_item.id, orderMenuItemId))
      .returning();

    if (updatedItems && updatedItems.length > 0) {
      // return updatedItems[0] as TOrderMenuItemSelect; // To return the updated object
      return "Order Menu Item updated successfully 😎";
    }
    return null; // Indicates item not found or not updated
  } catch (error) {
    console.error(
      `Error updating order menu item with ID ${orderMenuItemId}:`,
      error
    );
    throw error; // Re-throw
  }
};

// Consider returning a boolean or the ID of the deleted item
export const deleteOrderMenuItemServices = async (
  orderMenuItemId: number
): Promise<string | null> => {
  try {
    const result = await db
      .delete(order_menu_item)
      .where(eq(order_menu_item.id, orderMenuItemId))
      .returning({ deletedId: order_menu_item.id });

    if (result && result.length > 0) {
      return "Order Menu Item deleted successfully 🎉";
    }
    return null; // Indicates item not found or not deleted
  } catch (error) {
    console.error(
      `Error deleting order menu item with ID ${orderMenuItemId}:`,
      error
    );
    throw error; // Re-throw
  }
};

export const getOrderMenuItemsByOrderServices = async (
  orderIdParam: number
): Promise<TOrderMenuItemSelect[] | null> => {
  try {
    const items = await db.query.order_menu_item.findMany({
      where: eq(order_menu_item.order_id, orderIdParam),
      with: {
        // order: true, // Might be redundant if filtering by order_id
        menuItem: true,
      },
    });
    return items.length > 0 ? items : null;
  } catch (error) {
    console.error(
      `Error fetching order menu items for order ID ${orderIdParam}:`,
      error
    );
    return null;
  }
};

export const getOrderMenuItemsByMenuItemServices = async (
  menuItemIdParam: number
): Promise<TOrderMenuItemSelect[] | null> => {
  try {
    const items = await db.query.order_menu_item.findMany({
      where: eq(order_menu_item.menu_item_id, menuItemIdParam),
      with: {
        order: true,
        // menuItem: true, // Might be redundant
      },
    });
    return items.length > 0 ? items : null;
  } catch (error) {
    console.error(
      `Error fetching order menu items for menu item ID ${menuItemIdParam}:`,
      error
    );
    return null;
  }
};
