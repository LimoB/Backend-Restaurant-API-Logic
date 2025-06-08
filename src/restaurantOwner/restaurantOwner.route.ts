import { Router } from "express";
import {
  getRestaurantOwners,
  getRestaurantOwnerById,
  getRestaurantOwnersByOwnerId,
  createRestaurantOwnerHandler,
  updateRestaurantOwner,
  deleteRestaurantOwner,
} from "./restaurantOwner.controller";

export const restaurantOwnerRouter = Router();

// Get all restaurant owners
restaurantOwnerRouter.get("/restaurant-owner", getRestaurantOwners);

// Get restaurant owner by ID
restaurantOwnerRouter.get("/restaurant-owner/:id", getRestaurantOwnerById);

// Get restaurant owners by owner ID
restaurantOwnerRouter.get("/restaurant-owner/owner/:ownerId", getRestaurantOwnersByOwnerId);

// Create a new restaurant owner
restaurantOwnerRouter.post("/restaurant-owner", createRestaurantOwnerHandler);

// Update a restaurant owner
restaurantOwnerRouter.put("/restaurant-owner/:id", updateRestaurantOwner);

// Delete a restaurant owner
restaurantOwnerRouter.delete("/restaurant-owner/:id", deleteRestaurantOwner);
