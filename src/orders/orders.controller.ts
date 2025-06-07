import { Request, Response } from "express";
import {
  createOrderServices,
  deleteOrderServices,
  getOrderByIdServices,
  getOrdersServices,
  updateOrderServices,
} from "./orders.service";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await getOrdersServices();
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid order ID" });

  try {
    const order = await getOrderByIdServices(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const newOrder = await createOrderServices(req.body);
    res.status(201).json(newOrder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid order ID" });

  try {
    const updated = await updateOrderServices(id, req.body);
    if (!updated) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid order ID" });

  try {
    const deleted = await deleteOrderServices(id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(deleted);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
