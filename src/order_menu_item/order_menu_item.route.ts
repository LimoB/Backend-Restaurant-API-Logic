// src/order_menu_item/order_menu_item.router.ts
import { Router } from "express";
import {
  createOrderMenuItem,
  deleteOrderMenuItem,
  getOrderMenuItemById,
  getOrderMenuItems,
  updateOrderMenuItem,
  getOrderMenuItemsByOrder,
  getOrderMenuItemsByMenuItem,
} from "./order_menu_item.controller"; // Ensure path is correct

export const orderMenuItemRouter = Router();

// Order Menu Item routes definition - using kebab-case convention
orderMenuItemRouter.get("/order-menu-items", getOrderMenuItems);
orderMenuItemRouter.get("/order-menu-items/:id", getOrderMenuItemById);
orderMenuItemRouter.post("/order-menu-items", createOrderMenuItem);
orderMenuItemRouter.put("/order-menu-items/:id", updateOrderMenuItem);
orderMenuItemRouter.delete("/order-menu-items/:id", deleteOrderMenuItem);

// Custom routes based on business rules
orderMenuItemRouter.get(
  "/orders/:orderId/order-menu-items",
  getOrderMenuItemsByOrder
);
orderMenuItemRouter.get(
  "/menu-items/:menuItemId/order-menu-items",
  getOrderMenuItemsByMenuItem
);
