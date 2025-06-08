// src/menu_item/menu_item.service.ts
import { eq } from "drizzle-orm";
import db from "../drizzle/db"; // Assuming this path is correct
import {
  TMenuItemInsert,
  TMenuItemSelect,
  menu_item, // Corrected: use the schema definition
  // restaurant, // Import if you need to reference restaurantTable directly for other reasons
  // category    // Import if you need to reference categoryTable directly
} from "../drizzle/schema"; // Assuming this path is correct

export const getMenuItemsServices = async (): Promise<
  TMenuItemSelect[] | null
> => {
  try {
    const items = await db.query.menu_item.findMany({
      with: {
        restaurant: true, // Assumes relation named 'restaurant' in menuItemRelations
        category: true, // Assumes relation named 'category' in menuItemRelations
      },
    });
    return items.length > 0 ? items : null;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    // Depending on your error handling strategy, you might re-throw,
    // or return null/empty array and let controller handle status.
    return null;
  }
};

export const getMenuItemByIdServices = async (
  menuItemId: number
): Promise<TMenuItemSelect | undefined> => {
  try {
    return await db.query.menu_item.findFirst({
      where: eq(menu_item.id, menuItemId),
      with: {
        restaurant: true,
        category: true,
      },
    });
  } catch (error) {
    console.error(`Error fetching menu item with ID ${menuItemId}:`, error);
    return undefined;
  }
};

// Consider returning the created item or its ID
export const createMenuItemServices = async (
  itemData: TMenuItemInsert
): Promise<TMenuItemSelect | string> => {
  try {
    // Drizzle's .returning() by default returns all columns of the inserted row(s)
    const newItems = await db.insert(menu_item).values(itemData).returning();
    if (newItems && newItems.length > 0) {
      // To include relations, you might need a subsequent query or adjust how relations are handled post-insertion
      // For now, returning the basic inserted item:
      return newItems[0] as TMenuItemSelect; // Or just "Menu item created successfully"
    }
    return "Failed to create menu item or no item returned."; // Should ideally not happen if insert is successful
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw error; // Re-throw to be caught by controller
  }
};

// Consider returning the updated item or a boolean
export const updateMenuItemServices = async (
  menuItemId: number,
  itemData: Partial<TMenuItemInsert>
): Promise<TMenuItemSelect | string | null> => {
  try {
    const updatedItems = await db
      .update(menu_item)
      .set(itemData)
      .where(eq(menu_item.id, menuItemId))
      .returning();

    if (updatedItems && updatedItems.length > 0) {
      // return updatedItems[0] as TMenuItemSelect; // If you want to return the updated object
      return "Menu Item updated successfully 😎";
    }
    return null; // Indicates item not found or not updated
  } catch (error) {
    console.error(`Error updating menu item with ID ${menuItemId}:`, error);
    throw error; // Re-throw
  }
};

// Consider returning a boolean or the ID of the deleted item
export const deleteMenuItemServices = async (
  menuItemId: number
): Promise<string | null> => {
  try {
    const result = await db
      .delete(menu_item)
      .where(eq(menu_item.id, menuItemId))
      .returning({ deletedId: menu_item.id }); // Check if any row was affected

    if (result && result.length > 0) {
      return "Menu Item deleted successfully 🎉";
    }
    return null; // Indicates item not found or not deleted
  } catch (error) {
    console.error(`Error deleting menu item with ID ${menuItemId}:`, error);
    throw error; // Re-throw
  }
};

export const getMenuItemsByRestaurantIdServices = async (
  restaurantId: number
): Promise<TMenuItemSelect[] | null> => {
  try {
    const items = await db.query.menu_item.findMany({
      where: eq(menu_item.restaurant_id, restaurantId),
      with: {
        restaurant: true,
        category: true,
      },
    });
    return items.length > 0 ? items : null;
  } catch (error) {
    console.error(
      `Error fetching menu items for restaurant ID ${restaurantId}:`,
      error
    );
    return null;
  }
};

export const getMenuItemsByCategoryIdServices = async (
  categoryId: number
): Promise<TMenuItemSelect[] | null> => {
  try {
    const items = await db.query.menu_item.findMany({
      where: eq(menu_item.category_id, categoryId),
      with: {
        restaurant: true,
        category: true,
      },
    });
    return items.length > 0 ? items : null;
  } catch (error) {
    console.error(
      `Error fetching menu items for category ID ${categoryId}:`,
      error
    );
    return null;
  }
};
