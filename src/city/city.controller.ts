import { Request, Response, NextFunction } from "express";
import {
  createCityServices,
  deleteCityServices,
  getCityByIdServices,
  getCitysServices,
  updateCityServices,
} from "./city.service";

// Get all cities
export const getCities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allCities = await getCitysServices();
    if (!allCities || allCities.length === 0) {
      res.status(404).json({ message: "No cities found" });
      return;
    }
    res.status(200).json(allCities);
  } catch (error) {
    next(error);
  }
};

// Get city by ID
export const getCityById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const cityId = parseInt(req.params.id);
  if (isNaN(cityId)) {
    res.status(400).json({ error: "Invalid city ID" });
    return;
  }

  try {
    const city = await getCityByIdServices(cityId);
    if (!city) {
      res.status(404).json({ message: "City not found" });
      return;
    }
    res.status(200).json(city);
  } catch (error) {
    next(error);
  }
};

// Create new city
export const createCity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { cityName, stateId, address, state } = req.body;

  if (!cityName || !stateId) {
    res.status(400).json({ error: "cityName and stateId are required" });
    return;
  }

  try {
    // Map request body properties to expected service properties
    const newCity = await createCityServices({ 
      name: cityName, 
      state_id: stateId, 
      address
      
    });
    if (!newCity) {
      res.status(500).json({ message: "Failed to create city" });
      return;
    }
    res.status(201).json({ message: newCity });
  } catch (error) {
    next(error);
  }
};

// Update city
export const updateCity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const cityId = parseInt(req.params.id);
  if (isNaN(cityId)) {
    res.status(400).json({ error: "Invalid city ID" });
    return;
  }

  const { cityName, stateId, address, state } = req.body;

  if (!cityName || !stateId) {
    res.status(400).json({ error: "cityName and stateId are required" });
    return;
  }

  try {
    const updatedCity = await updateCityServices(cityId, {
      name: cityName,
      state_id: stateId,
      address
      
    });
    if (!updatedCity) {
      res.status(404).json({ message: "City not found or failed to update" });
      return;
    }
    res.status(200).json({ message: updatedCity });
  } catch (error) {
    next(error);
  }
};

// Delete city
export const deleteCity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const cityId = parseInt(req.params.id);
  if (isNaN(cityId)) {
    res.status(400).json({ error: "Invalid city ID" });
    return;
  }

  try {
    const existingCity = await getCityByIdServices(cityId);
    if (!existingCity) {
      res.status(404).json({ message: "City not found" });
      return;
    }

    const deletedCity = await deleteCityServices(cityId);
    if (deletedCity) {
      res.status(200).json({ message: "City deleted successfully" });
    } else {
      res.status(404).json({ message: "Failed to delete city" });
    }
  } catch (error) {
    next(error);
  }
};
