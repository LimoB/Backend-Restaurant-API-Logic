import { Request, Response, NextFunction } from "express";
import {
  createOrderStatusServices,
  deleteOrderStatusServices,
  getOrderStatusByIdServices,
  getOrderStatusesServices,
  updateOrderStatusServices,
} from "./statusCatalog.service";  // ideally rename this file to orderStatus.service.ts for clarity

// Get all order statuses
export const getOrderStatuses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allOrderStatuses = await getOrderStatusesServices();
    if (!allOrderStatuses || allOrderStatuses.length === 0) {
      res.status(404).json({ message: "No order statuses found" });
      return;
    }
    res.status(200).json(allOrderStatuses);
  } catch (error) {
    next(error);
  }
};

// Get order status by ID
export const getOrderStatusById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const orderStatusId = parseInt(req.params.id);
  if (isNaN(orderStatusId)) {
    res.status(400).json({ error: "Invalid order status ID" });
    return;
  }

  try {
    const orderStatus = await getOrderStatusByIdServices(orderStatusId);
    if (!orderStatus) {
      res.status(404).json({ message: "Order status not found" });
      return;
    }
    res.status(200).json(orderStatus);
  } catch (error) {
    next(error);
  }
};
// Create new order status
export const createOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { order_id, status_catalog_id } = req.body;

  if (!order_id || !status_catalog_id) {
    res.status(400).json({ error: "order_id and status_catalog_id are required" });
    return;
  }

  try {
    const newOrderStatus = await createOrderStatusServices({ order_id, status_catalog_id });
    res.status(201).json({ message: "Order status created successfully 🎉", data: newOrderStatus });
  } catch (error) {
    next(error);
  }
};
// Update order status
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const orderStatusId = parseInt(req.params.id);
  if (isNaN(orderStatusId)) {
    res.status(400).json({ error: "Invalid order status ID" });
    return;
  }

  const { order_id, status_catalog_id } = req.body;

  if (!order_id || !status_catalog_id) {
    res.status(400).json({ error: "order_id and status_catalog_id are required" });
    return;
  }

  try {
    const updatedOrderStatus = await updateOrderStatusServices(orderStatusId, { order_id, status_catalog_id });
    res.status(200).json({ message: "Order status updated successfully 😎", data: updatedOrderStatus });
 } catch (error) {
    next(error);
  }
};

// Delete order status
export const deleteOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const orderStatusId = parseInt(req.params.id);
  if (isNaN(orderStatusId)) {
    res.status(400).json({ error: "Invalid order status ID" });
    return;
  }
 try {
    const existingOrderStatus = await getOrderStatusByIdServices(orderStatusId);
    if (!existingOrderStatus) {
      res.status(404).json({ message: "Order status not found" });
      return;
    }

    const deletedOrderStatus = await deleteOrderStatusServices(orderStatusId);
    res.status(200).json({ message: "Order status deleted successfully 🎉" });
  } catch (error) {
    next(error);
  }
};