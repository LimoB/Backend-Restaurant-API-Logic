// src/order_menu_item/order_menu_item.controller.ts
import { Request, Response } from "express";
import {
  createOrderMenuItemServices,
  deleteOrderMenuItemServices,
  getOrderMenuItemByIdServices,
  getOrderMenuItemsServices,
  updateOrderMenuItemServices,
  getOrderMenuItemsByOrderServices,
  getOrderMenuItemsByMenuItemServices,
} from "./order_menu_item.service"; // Ensure path is correct
import { TOrderMenuItemInsert } from "../drizzle/schema"; // For req.body typing
// Potentially: import { getMenuItemByIdServices } from "../menu_item/menu_item.service";

export const getOrderMenuItems = async (req: Request, res: Response) => {
  try {
    const allItems = await getOrderMenuItemsServices();
    if (!allItems) {
      res.status(404).json({ message: "No Order Menu Items found" });
      return;
    }
    res.status(200).json(allItems);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch Order Menu Items" });
  }
};

export const getOrderMenuItemById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid Order Menu Item ID" });
    return;
  }
  try {
    const item = await getOrderMenuItemByIdServices(id);
    if (!item) {
      res.status(404).json({ message: "Order Menu Item not found" });
      return;
    }
    res.status(200).json(item);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch order menu item" });
  }
};

export const createOrderMenuItem = async (req: Request, res: Response) => {
  // IMPORTANT: item_name and price for order_menu_item should be captured at the time of order.
  // You might fetch the menu_item first to get its current name and price.
  const { order_id, menu_item_id, quantity, item_name, price, comment } =
    req.body as TOrderMenuItemInsert;

  if (
    order_id === undefined ||
    menu_item_id === undefined ||
    quantity === undefined ||
    !item_name ||
    price === undefined
  ) {
    res.status(400).json({
      error:
        "Required fields (order_id, menu_item_id, quantity, item_name, price) are missing",
    });
    return;
  }
  if (typeof quantity !== "number" || quantity <= 0) {
    res.status(400).json({ error: "Quantity must be a positive number." });
    return;
  }

  try {
    // Example: Fetch menu_item details if item_name and price aren't sent from client
    // This is a common pattern. Adjust if client sends these.
    // const menuItemDetails = await getMenuItemByIdServices(menu_item_id);
    // if (!menuItemDetails) {
    //     return res.status(404).json({ message: "Menu item for order line not found." });
    // }

    const newItemData: TOrderMenuItemInsert = {
      order_id,
      menu_item_id,
      quantity,
      item_name: item_name, // Or menuItemDetails.name if fetched
      price: price, // Or menuItemDetails.price if fetched
      comment,
    };

    const newItem = await createOrderMenuItemServices(newItemData);

    if (typeof newItem === "string") {
      // Error message from service
      res.status(500).json({ message: newItem });
      return;
    }
    res.status(201).json(newItem); // Return created object
  } catch (error: any) {
    // More specific error handling (e.g., foreign key violation) could be added
    res
      .status(500)
      .json({ error: error.message || "Failed to create Order Menu Item" });
  }
};

export const updateOrderMenuItem = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid Order Menu Item ID" });
    return;
  }

  const { quantity, comment } = req.body as Partial<TOrderMenuItemInsert>;
  // Typically, you only allow updating quantity or comment for an existing order line.
  // Changing order_id or menu_item_id is usually a delete and add new.
  // Price and item_name are usually fixed once the order is placed.

  if (quantity === undefined && comment === undefined) {
    res
      .status(400)
      .json({ error: "No fields (quantity, comment) provided for update" });
    return;
  }
  if (
    quantity !== undefined &&
    (typeof quantity !== "number" || quantity <= 0)
  ) {
    res
      .status(400)
      .json({ error: "Quantity must be a positive number if provided." });
    return;
  }

  try {
    const updateData: Partial<TOrderMenuItemInsert> = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (comment !== undefined) updateData.comment = comment;
    // Do NOT allow updating item_name, price, order_id, menu_item_id here usually.

    const result = await updateOrderMenuItemServices(id, updateData);

    if (result === null) {
      res
        .status(404)
        .json({ message: "Order Menu Item not found or no changes made" });
      return;
    }
    // If service returns updated object:
    // res.status(200).json(result);
    // If service returns success message:
    res.status(200).json({ message: result });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to update order menu item" });
  }
};

export const deleteOrderMenuItem = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid Order Menu Item ID" });
    return;
  }
  try {
    const result = await deleteOrderMenuItemServices(id);
    if (result === null) {
      res
        .status(404)
        .json({ message: "Order Menu Item not found or failed to delete" });
      return;
    }
    res.status(200).json({ message: result }); // Or res.sendStatus(204)
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to delete order menu item" });
  }
};

export const getOrderMenuItemsByOrder = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.orderId);
  if (isNaN(orderId)) {
    res.status(400).json({ error: "Invalid Order ID" });
    return;
  }
  try {
    const items = await getOrderMenuItemsByOrderServices(orderId);
    if (!items) {
      res
        .status(404)
        .json({ message: "No Order Menu Items found for this order" });
      return;
    }
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "Failed to fetch order menu items by order",
    });
  }
};

export const getOrderMenuItemsByMenuItem = async (
  req: Request,
  res: Response
) => {
  const menuItemId = parseInt(req.params.menuItemId);
  if (isNaN(menuItemId)) {
    res.status(400).json({ error: "Invalid Menu Item ID" });
    return;
  }
  try {
    const items = await getOrderMenuItemsByMenuItemServices(menuItemId);
    if (!items) {
      res
        .status(404)
        .json({ message: "No Order Menu Items found for this menu item" });
      return;
    }
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "Failed to fetch order menu items by menu item",
    });
  }
};
