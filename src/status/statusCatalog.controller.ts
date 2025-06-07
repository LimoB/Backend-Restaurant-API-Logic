import { Request, Response } from "express";
import {
  createStatusServices,
  deleteStatusServices,
  getStatusByIdServices,
  getStatusesServices,
  updateStatusServices,
} from "./statusCatalog.service";

// Get all statuses
export const getStatuses = async (req: Request, res: Response) => {
  try {
    const allStatuses = await getStatusesServices();
    if (!allStatuses || allStatuses.length === 0) {
      res.status(404).json({ message: "No statuses found" });
      return;
    }
    res.status(200).json(allStatuses);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch statuses" });
  }
};

// Get status by ID
export const getStatusById = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch status" });
  }
};

// Create new status
export const createStatus = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  try {
    const message = await createStatusServices({ name });
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create status" });
  }
};

// Update status
export const updateStatus = async (req: Request, res: Response) => {
  const statusId = parseInt(req.params.id);
  if (isNaN(statusId)) {
    res.status(400).json({ error: "Invalid status ID" });
    return;
  }

  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  try {
    const message = await updateStatusServices(statusId, { name });
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update status" });
  }
};

// Delete status
export const deleteStatus = async (req: Request, res: Response) => {
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

    const message = await deleteStatusServices(statusId);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete status" });
  }
};