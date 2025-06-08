import { Request, Response, NextFunction } from "express";
import {
  createStatusServices,
  deleteStatusServices,
  getStatusByIdServices,
  getStatusesServices,
  updateStatusServices,
} from "./statusCatalog.service";

// Get all statuses
export const getStatuses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allStatuses = await getStatusesServices();
    if (!allStatuses || allStatuses.length === 0) {
      res.status(404).json({ message: "No statuses found" });
      return;
    }
    res.status(200).json(allStatuses);
  } catch (error) {
    next(error);
  }
};

// Get status by ID
export const getStatusById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const statusId = parseInt(req.params.id);
  if (isNaN(statusId)) {
    res.status(400).json({ error: "Invalid status ID" });
    return;
  }

  try {
    const status = await getStatusByIdServices(statusId);
    if (!status) {
      res.status(404).json({ message: "Status not found" });
      return;
    }
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

// Create new status
export const createStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  try {
    const newStatus = await createStatusServices({ name,});
    res.status(201).json({ message: newStatus });
  } catch (error) {
    next(error);
  }
};

// Update status
export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const statusId = parseInt(req.params.id);
  if (isNaN(statusId)) {
    res.status(400).json({ error: "Invalid status ID" });
    return;
  }

  const { name, description } = req.body;

  if (!name) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  try {
    const updatedStatus = await updateStatusServices(statusId, { name});
    res.status(200).json({ message: updatedStatus });
  } catch (error) {
    next(error);
  }
};

// Delete status
export const deleteStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const statusId = parseInt(req.params.id);
  if (isNaN(statusId)) {
    res.status(400).json({ error: "Invalid status ID" });
    return;
  }

  try {
    const existingStatus = await getStatusByIdServices(statusId);
    if (!existingStatus) {
      res.status(404).json({ message: "Status not found" });
      return;
    }

    const deletedStatus = await deleteStatusServices(statusId);
    res.status(200).json({ message: deletedStatus });
  } catch (error) {
    next(error);
  }
};