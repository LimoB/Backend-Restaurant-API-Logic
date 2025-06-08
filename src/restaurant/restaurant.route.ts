// src/restaurant/restaurant.router.ts
import { Router } from "express";
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurantById,
  getRestaurants,
  updateRestaurant,
  getRestaurantsByCity, // Example for custom route
} from "./restaurant.controller"; // Ensure path is correct

export const restaurantRouter = Router();

// Restaurant routes definition - using kebab-case convention
restaurantRouter.get("/restaurants", getRestaurants);
restaurantRouter.get("/restaurants/:id", getRestaurantById);
restaurantRouter.post("/restaurants", createRestaurant);
restaurantRouter.put("/restaurants/:id", updateRestaurant);
restaurantRouter.delete("/restaurants/:id", deleteRestaurant);

// Example custom route: Get all restaurants for a specific city
restaurantRouter.get("/cities/:cityId/restaurants", getRestaurantsByCity);
