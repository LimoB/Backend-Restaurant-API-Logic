import { Router } from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "./orders.controller";
import { RateLimiterMiddleware } from "../middleware/rateLimiter"; // ✅ adjust path as needed

export const orderRouter = Router();

// Apply rate limiting to all routes
orderRouter.get("/orders", RateLimiterMiddleware, getOrders);
orderRouter.get("/orders/:id", RateLimiterMiddleware, getOrderById);
orderRouter.post("/orders", RateLimiterMiddleware, createOrder);
orderRouter.put("/orders/:id", RateLimiterMiddleware, updateOrder);
orderRouter.delete("/orders/:id", RateLimiterMiddleware, deleteOrder);

