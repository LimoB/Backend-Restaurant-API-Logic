import { Router } from "express";
import { 
  createStatus, 
  deleteStatus, 
  getStatuses, 
  getStatusById, 
  updateStatus 
} from "./statusCatalog.controller";

export const statusRouter = Router();

// Status routes definition

// Get all statuses
statusRouter.get('/status', getStatuses);

// Get status by ID
statusRouter.get('/status/:id', getStatusById);

// Create a new status
statusRouter.post('/status', createStatus);

// Update an existing status
statusRouter.put('/status/:id', updateStatus);

// Delete an existing status
statusRouter.delete('/status/:id', deleteStatus);
