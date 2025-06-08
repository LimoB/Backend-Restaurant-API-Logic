import { Request, Response, NextFunction } from "express";
import {
  createStateServices,
  deleteStateServices,
  getStateByIdServices,
  getStatesServices,
  updateStateServices,
} from "./state.service";

// Get all states
export const getStates = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allStates = await getStatesServices();
    if (!allStates || allStates.length === 0) {
      res.status(404).json({ message: "No states found" });
      return;
    }
    res.status(200).json(allStates);
  } catch (error) {
    next(error);
  }
};

// Get state by ID
export const getStateById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const stateId = parseInt(req.params.id);
  if (isNaN(stateId)) {
    res.status(400).json({ error: "Invalid state ID" });
    return;
  }

  try {
    const state = await getStateByIdServices(stateId);
    if (!state) {
      res.status(404).json({ message: "State not found" });
      return;
    }
    res.status(200).json(state);
  } catch (error) {
    next(error);
  }
};

// Create new state
export const createState = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, code } = req.body;
  if (!name || !code) {
    res.status(400).json({ error: "Name and code are required" });
    return;
  }

  try {
    const newState = await createStateServices({ name, code });
    if (!newState) {
      res.status(500).json({ message: "Failed to create state" });
      return;
    }
    res.status(201).json({ message: newState });
  } catch (error) {
    next(error);
  }
};

// Update state
export const updateState = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const stateId = parseInt(req.params.id);
  if (isNaN(stateId)) {
    res.status(400).json({ error: "Invalid state ID" });
    return;
  }

  const { name, code } = req.body;
  if (!name || !code) {
    res.status(400).json({ error: "Name and code are required" });
    return;
  }

  try {
    const updatedState = await updateStateServices(stateId, { name, code });
    if (!updatedState) {
      res.status(404).json({ message: "State not found or failed to update" });
      return;
    }
    res.status(200).json({ message: updatedState });
  } catch (error) {
    next(error);
  }
};

// Delete state
export const deleteState = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const stateId = parseInt(req.params.id);
  if (isNaN(stateId)) {
    res.status(400).json({ error: "Invalid state ID" });
    return;
  }

  try {
    const existingState = await getStateByIdServices(stateId);
    if (!existingState) {
      res.status(404).json({ message: "State does not exist" });
      return;
    }

    const deletedState = await deleteStateServices(stateId);
    if (deletedState) {
      res.status(200).json({ message: deletedState });
    } else {
      res.status(404).json({ message: "Failed to delete state" });
    }
  } catch (error) {
    next(error);
  }
};
