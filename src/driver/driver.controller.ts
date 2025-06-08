// src/driver/driver.controller.ts
import { Request, Response } from "express";
import {
  createDriverServices,
  deleteDriverServices,
  getDriverByIdServices,
  getDriversByUserIdServices,
  getDriversServices,
  updateDriverServices,
} from "./driver.service";

// Get all drivers
export const getDrivers = async (req: Request, res: Response) => {
  try {
    const allDrivers = await getDriversServices();
    if (!allDrivers || allDrivers.length === 0) {
      res.status(404).json({ message: "No drivers found" });
      return;
    }
    res.status(200).json(allDrivers);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch drivers" });
  }
};

// Get driver by ID
export const getDriverById = async (req: Request, res: Response) => {
  const driverId = parseInt(req.params.id);
  if (isNaN(driverId)) {
    res.status(400).json({ error: "Invalid driver ID" });
    return;
  }
  try {
    const driver = await getDriverByIdServices(driverId);
    if (!driver) {
      res.status(404).json({ message: "Driver not found" });
      return;
    }
    res.status(200).json(driver);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch driver" });
  }
};

// Get drivers by user ID
export const getDriversByUserId = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }
  try {
    const drivers = await getDriversByUserIdServices(userId);
    if (!drivers || drivers.length === 0) {
      res.status(404).json({ message: "No drivers found for this user" });
      return;
    }
    res.status(200).json(drivers);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch drivers" });
  }
};

// Create a new driver
export const createDriverHandler = async (req: Request, res: Response) => {
  const {
    user_id,
    car_make,
    car_model,
    car_year,
    license_plate,
    active = true,
  } = req.body;

  if (!user_id || !car_make || !car_model || !car_year || !license_plate) {
    res.status(400).json({
      error: "Required fields: user_id, car_make, car_model, car_year, license_plate",
    });
    return;
  }

  try {
    const result = await createDriverServices({
      user_id,
      car_make,
      car_model,
      car_year,
      license_plate,
      active,
    });
    res.status(201).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create driver" });
  }
};

// Update a driver
export const updateDriver = async (req: Request, res: Response) => {
  const driverId = parseInt(req.params.id);
  if (isNaN(driverId)) {
    res.status(400).json({ error: "Invalid driver ID" });
    return;
  }

  const {
    car_make,
    car_model,
    car_year,
    license_plate,
    active,
  } = req.body;

  try {
    const result = await updateDriverServices(driverId, {
      car_make,
      car_model,
      car_year,
      license_plate,
      active,
    });
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update driver" });
  }
};

// Delete a driver
export const deleteDriver = async (req: Request, res: Response) => {
  const driverId = parseInt(req.params.id);
  if (isNaN(driverId)) {
    res.status(400).json({ error: "Invalid driver ID" });
    return;
  }

  try {
    const deleted = await deleteDriverServices(driverId);
    if (deleted) {
      res.status(200).json({ message: "Driver deleted successfully" });
    } else {
      res.status(404).json({ message: "Driver not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete driver" });
  }
};