import { Router } from "express";
import { 
  getOrderStatuses,
  getOrderStatusById,
  createOrderStatus,
  updateOrderStatus,
  deleteOrderStatus,
} from "./statusCatalog.controller";

export const statusRouter = Router();

// Status routes definition

// Get all statuses
statusRouter.get('/status', getOrderStatuses);

// Get status by ID
statusRouter.get('/status/:id', getOrderStatusById);

// Create a new status
statusRouter.post('/status', createOrderStatus);

// Update an existing status
statusRouter.put('/status/:id', updateOrderStatus);

// Delete an existing status
statusRouter.delete('/status/:id', deleteOrderStatus);