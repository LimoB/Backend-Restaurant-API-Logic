// src/menu_item/menu_item.controller.ts
import { Request, Response } from "express";
import {
  createMenuItemServices,
  deleteMenuItemServices,
  getMenuItemByIdServices,
  getMenuItemsServices,
  updateMenuItemServices,
  getMenuItemsByRestaurantIdServices,
  getMenuItemsByCategoryIdServices,
} from "./menu_item.service";
import { TMenuItemInsert, TMenuItemSelect } from "../drizzle/schema";

// getMenuItems, getMenuItemById (largely the same, ensure error handling)
export const getMenuItems = async (req: Request, res: Response) => {
  try {
    const allMenuItems = await getMenuItemsServices();
    if (allMenuItems == null || allMenuItems.length == 0) {
      res.status(404).json({ message: "No Menu Items found" });
      return;
    }
    res.status(200).json(allMenuItems);
    return;
  } catch (error: any) {
    console.error("Controller: Get All Menu Items Error - ", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch Menu Items" });
    return;
  }
};

export const getMenuItemById = async (req: Request, res: Response) => {
  const menuItemId = parseInt(req.params.id);
  if (isNaN(menuItemId) || menuItemId <= 0) {
    // Added check for positive ID
    res.status(400).json({ error: "Invalid Menu Item ID format" });
    return;
  }
  try {
    const menuItem = await getMenuItemByIdServices(menuItemId);
    if (menuItem == null) {
      res.status(404).json({ message: "Menu Item not found" });
      return;
    }
    res.status(200).json(menuItem);
    return;
  } catch (error: any) {
    console.error(
      `Controller: Get Menu Item By ID ${menuItemId} Error - `,
      error
    );
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch menu item" });
    return;
  }
};

export const createMenuItem = async (req: Request, res: Response) => {
  const { category_id, restaurant_id, name, ingredients, price, active } =
    req.body;
  if (
    !category_id ||
    !restaurant_id ||
    !name ||
    price === undefined ||
    active === undefined
  ) {
    res.status(400).json({
      error:
        "Required fields (category_id, restaurant_id, name, price, active) are missing",
    });
    return;
  }

  try {
    const newMenuItem = await createMenuItemServices({
      category_id,
      restaurant_id,
      name,
      ingredients,
      price,
      active,
    });
    if (newMenuItem) {
      res.status(201).json({ message: newMenuItem });
      return; // Adjusted to return object with message
    } else {
      res.status(500).json({ message: "Failed to create Menu Item" });
      return;
    }
  } catch (error: any) {
    console.error("Controller: Create Menu Item Error - ", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to create Menu Item" });
    return;
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  const menuItemId = parseInt(req.params.id);
  if (isNaN(menuItemId) || menuItemId <= 0) {
    res.status(400).json({ error: "Invalid Menu Item ID format" });
    return;
  }

  const { category_id, restaurant_id, name, ingredients, price, active } =
    req.body;
  if (
    !category_id &&
    !restaurant_id &&
    !name &&
    ingredients === undefined &&
    price === undefined &&
    active === undefined
  ) {
    res.status(400).json({ error: "No fields provided for update" });
    return;
  }

  try {
    const updatedMenuItem = await updateMenuItemServices(
      menuItemId,
      {
        category_id,
        restaurant_id,
        name,
        ingredients,
        price,
        active,
      } as Partial<TMenuItemInsert> // Cast to Partial<TMenuItemInsert>
    );
    if (updatedMenuItem) {
      res.status(200).json({ message: updatedMenuItem });
      return; // Adjusted to return object with message
    } else {
      // This could mean not found, or update failed for other reasons if service doesn't distinguish
      res
        .status(404)
        .json({ message: "Menu Item not found or failed to update" });
      return;
    }
  } catch (error: any) {
    console.error(`Controller: Update Menu Item ${menuItemId} Error - `, error);
    res
      .status(500)
      .json({ error: error.message || "Failed to update menu item" });
    return;
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  const menuItemId = parseInt(req.params.id);
  if (isNaN(menuItemId) || menuItemId <= 0) {
    res.status(400).json({ error: "Invalid Menu Item ID format" });
    return;
  }
  try {
    const success = await deleteMenuItemServices(menuItemId);
    if (success) {
      res.status(200).json({ message: success });
      return; // Return the success message from service
      // For truly RESTful, return 204 No Content for successful delete
      // return res.status(204).send();
    } else {
      res
        .status(404)
        .json({ message: "Menu Item not found or failed to delete." });
      return;
    }
  } catch (error: any) {
    console.error(`Controller: Delete Menu Item ${menuItemId} Error - `, error);
    res
      .status(500)
      .json({ error: error.message || "Failed to delete menu item" });
    return;
  }
};

// getMenuItemsByRestaurantId and getMenuItemsByCategoryId controllers
// remain largely the same as in previous response, ensure they handle null from service.

export const getMenuItemsByRestaurantId = async (
  req: Request,
  res: Response
) => {
  const restaurantId = parseInt(req.params.restaurantId);
  if (isNaN(restaurantId) || restaurantId <= 0) {
    res.status(400).json({ error: "Invalid Restaurant ID format" });
    return;
  }
  try {
    const menuItems = await getMenuItemsByRestaurantIdServices(restaurantId);
    if (!menuItems || menuItems.length === 0) {
      res
        .status(404)
        .json({ message: "No Menu Items found for this restaurant" });
      return;
    }
    res.status(200).json(menuItems);
    return;
  } catch (error: any) {
    console.error(
      `Controller: Get Menu Items By Restaurant ID ${restaurantId} Error - `,
      error
    );
    res.status(500).json({
      error: error.message || "Failed to fetch menu items by restaurant",
    });
    return;
  }
};

export const getMenuItemsByCategoryId = async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.categoryId);
  if (isNaN(categoryId) || categoryId <= 0) {
    res.status(400).json({ error: "Invalid Category ID format" });
    return;
  }
  try {
    const menuItems = await getMenuItemsByCategoryIdServices(categoryId);
    if (!menuItems || menuItems.length === 0) {
      res
        .status(404)
        .json({ message: "No Menu Items found for this category" });
      return;
    }
    res.status(200).json(menuItems);
    return;
  } catch (error: any) {
    console.error(
      `Controller: Get Menu Items By Category ID ${categoryId} Error - `,
      error
    );
    res.status(500).json({
      error: error.message || "Failed to fetch menu items by category",
    });
    return;
  }
};
