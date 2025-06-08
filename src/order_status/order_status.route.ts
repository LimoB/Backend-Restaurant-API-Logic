import { Router } from "express";
import {
  getOrderStatuses,
  getOrderStatusById,
  createOrderStatus,
  updateOrderStatus,
  deleteOrderStatus,
} from "./order_status.controller";

const order_statusRouter = Router();

order_statusRouter.get("/", getOrderStatuses);
order_statusRouter.get("/:id", getOrderStatusById);
order_statusRouter.post("/", createOrderStatus);
order_statusRouter.put("/:id", updateOrderStatus);
order_statusRouter.delete("/:id", deleteOrderStatus);

export default order_statusRouter;
