// src/driver/driver.routes.ts
import { Router } from "express";
import {
  getDrivers,
  getDriverById,
  getDriversByUserId,
  createDriverHandler,
  updateDriver,
  deleteDriver,
} from "./driver.controller";

export const driverRouter = Router();

// Driver routes definition

// Get all drivers
driverRouter.get("/drivers", getDrivers);

// Get driver by ID
driverRouter.get("/driver/:id", getDriverById);

// Get drivers by User ID
driverRouter.get("/driver/user/:userId", getDriversByUserId);

// Create a new driver
driverRouter.post("/driver", createDriverHandler);

// Update an existing driver
driverRouter.put("/driver/:id", updateDriver);

// Delete an existing driver
driverRouter.delete("/driver/:id", deleteDriver);