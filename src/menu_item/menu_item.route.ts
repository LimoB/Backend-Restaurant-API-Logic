// src/menu_item/menu_item.router.ts
import { Router } from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItemById,
  getMenuItems,
  updateMenuItem,
  getMenuItemsByRestaurantId,
  getMenuItemsByCategoryId,
} from "./menu_item.controller"; // Ensure path is correct

export const menuItemRouter = Router(); // Changed from menu_itemRouter to menuItemRouter for consistency

// Menu Item routes definition
menuItemRouter.get("/menu-items", getMenuItems); // Conventionally kebab-case for routes
menuItemRouter.get("/menu-items/:id", getMenuItemById);
menuItemRouter.post("/menu-items", createMenuItem);
menuItemRouter.put("/menu-items/:id", updateMenuItem);
menuItemRouter.delete("/menu-items/:id", deleteMenuItem);

// Custom routes based on business rules
menuItemRouter.get(
  "/restaurants/:restaurantId/menu-items",
  getMenuItemsByRestaurantId
);
menuItemRouter.get(
  "/categories/:categoryId/menu-items",
  getMenuItemsByCategoryId
);
