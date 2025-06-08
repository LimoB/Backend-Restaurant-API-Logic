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
import validate from "../middleware/validate"; // Ensure you have this
import { driverSchema } from "../validation/user.validator"; // Adjust path if needed

export const driverRouter = Router();

// Get all drivers
driverRouter.get("/drivers", getDrivers);

// Get driver by ID
driverRouter.get("/driver/:id", getDriverById);

// Get drivers by User ID
driverRouter.get("/driver/user/:userId", getDriversByUserId);

// Create a new driver (validated)
driverRouter.post("/driver", validate(driverSchema), createDriverHandler);

// Update an existing driver (partial validation)
driverRouter.put("/driver/:id", validate(driverSchema.partial()), updateDriver);

// Delete an existing driver
driverRouter.delete("/driver/:id", deleteDriver);
