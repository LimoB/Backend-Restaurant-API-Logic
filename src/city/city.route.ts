import { Router } from "express";
import { createCity, deleteCity, getCities, getCityById, updateCity } from "./city.controller";

export const cityRouter = Router();

// City routes definition

// Get all cities
cityRouter.get('/city', getCities);

// Get city by ID
cityRouter.get('/city/:id', getCityById);

// Create a new city
cityRouter.post('/city', createCity);

// Update an existing city
cityRouter.put('/city/:id', updateCity);

// Delete an existing city
cityRouter.delete('/city/:id', deleteCity);
