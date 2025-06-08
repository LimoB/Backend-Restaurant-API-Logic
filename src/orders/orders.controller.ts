import { Request, Response, NextFunction } from "express";
import {
  createOrderServices,
  deleteOrderServices,
  getOrderByIdServices,
  getOrdersServices,
  updateOrderServices,
} from "./orders.service";

// Get all orders
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allOrders = await getOrdersServices();
    if (!allOrders || allOrders.length === 0) {
      res.status(404).json({ message: "No orders found" });
      return;
    }
    res.status(200).json(allOrders);
  } catch (error) {
    next(error);
  }
};

// Get order by ID
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const orderId = parseInt(req.params.id);
  if (isNaN(orderId)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }

  try {
    const order = await getOrderByIdServices(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Create new order
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newOrder = await createOrderServices(req.body);
    res.status(201).json({ message: newOrder });
  } catch (error) {
    next(error);
  }
};

// Update order
export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const orderId = parseInt(req.params.id);
  if (isNaN(orderId)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }

  try {
    const updatedOrder = await updateOrderServices(orderId, req.body);
    res.status(200).json({ message: updatedOrder });
  } catch (error) {
    next(error);
  }
};

// Delete order
export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const orderId = parseInt(req.params.id);
  if (isNaN(orderId)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }

  try {
    const existingOrder = await getOrderByIdServices(orderId);
    if (!existingOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const deletedOrder = await deleteOrderServices(orderId);
    res.status(200).json({ message: deletedOrder });
  } catch (error) {
    next(error);
  }
};

