import { Request, Response, NextFunction } from "express";
import {
  createOrderStatusServices,
  deleteOrderStatusServices,
  getOrderStatusByIdServices,
  getOrderStatusesServices,
  updateOrderStatusServices,
} from "./order_status.service";

// Get all order statuses
export const getOrderStatuses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const statuses = await getOrderStatusesServices();
    res.status(200).json(statuses);
  } catch (error) {
    next(error);
  }
};

// Get order status by ID
export const getOrderStatusById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid order status ID" });
    return;
  }

  try {
    const status = await getOrderStatusByIdServices(id);
    if (!status) {
      res.status(404).json({ message: "Order status not found" });
      return;
    }
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

// Create a new order status
export const createOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { order_id, status_catalog_id } = req.body;

  if (!order_id || !status_catalog_id) {
    res.status(400).json({ error: "order_id and status_catalog_id are required" });
    return;
  }

  try {
    const newStatus = await createOrderStatusServices({ order_id, status_catalog_id });
    res.status(201).json(newStatus);
  } catch (error) {
    next(error);
  }
};

// Update an order status
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid order status ID" });
    return;
  }

  const { order_id, status_catalog_id } = req.body;

  try {
    const updatedStatus = await updateOrderStatusServices(id, { order_id, status_catalog_id });
    if (!updatedStatus) {
      res.status(404).json({ message: "Order status not found" });
      return;
    }
    res.status(200).json(updatedStatus);
  } catch (error) {
    next(error);
  }
};

// Delete an order status
export const deleteOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid order status ID" });
    return;
  }

  try {
    const deleted = await deleteOrderStatusServices(id);
    if (!deleted) {
      res.status(404).json({ message: "Order status not found" });
      return;
    }
    res.status(200).json({ message: "Order status deleted successfully" });
  } catch (error) {
    next(error);
  }
};
