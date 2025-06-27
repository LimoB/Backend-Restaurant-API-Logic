import { Request, Response, NextFunction } from "express";
import {
  getOrdersServices,
  getOrderByIdServices,
  createOrderWithItemsService,
  updateOrderServices,
  deleteOrderServices,
} from "./orders.service";

// 📦 Get all orders
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allOrders = await getOrdersServices();

    if (!allOrders.length) {
      res.status(404).json({
        success: false,
        message: "No orders found",
        data: [],
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: allOrders,
    });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    next(error);
  }
};

// 📦 Get order by ID
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const orderId = parseInt(req.params.id, 10);

  if (isNaN(orderId)) {
    res.status(400).json({ success: false, error: "Invalid order ID" });
    return;
  }

  try {
    const order = await getOrderByIdServices(orderId);

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    next(error);
  }
};

// 🛒 Create new order with items
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { cart, ...orderData } = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
      res.status(400).json({
        success: false,
        message: "Cart is empty or invalid",
      });
      return;
    }

    const result = await createOrderWithItemsService({
      ...orderData,
      cart,
    });

    res.status(201).json({
      success: true,
      message: "Order and items created",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    next(error);
  }
};

// 🔁 Update order
export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const orderId = parseInt(req.params.id, 10);

  if (isNaN(orderId)) {
    res.status(400).json({ success: false, error: "Invalid order ID" });
    return;
  }

  try {
    const result = await updateOrderServices(orderId, req.body);

    res.status(200).json({
      success: true,
      message: "Order updated",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    next(error);
  }
};

// 🗑️ Delete order
export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const orderId = parseInt(req.params.id, 10);

  if (isNaN(orderId)) {
    res.status(400).json({ success: false, error: "Invalid order ID" });
    return;
  }

  try {
    const existingOrder = await getOrderByIdServices(orderId);

    if (!existingOrder) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    const deleted = await deleteOrderServices(orderId);

    res.status(200).json({
      success: true,
      message: "Order deleted",
      data: deleted,
    });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    next(error);
  }
};
