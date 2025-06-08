import { Router } from "express";
import {
  createState,
  deleteState,
  getStateById,
  getStates,
  updateState,
} from "./state.controller";

export const stateRouter = Router();

// State routes definition

// Get all states
stateRouter.get("/states", getStates);

// Get a state by ID
stateRouter.get("/states/:id", getStateById);

// Create a new state
stateRouter.post("/states", createState);

// Update an existing state
stateRouter.put("/states/:id", updateState);

// Delete an existing state
stateRouter.delete("/states/:id", deleteState);
