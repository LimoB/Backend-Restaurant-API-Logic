// src/restaurant-owner/restaurantOwner.routes.ts
import { Router } from "express";
import {
  getRestaurantOwners,
  getRestaurantOwnerById,
  getRestaurantOwnersByOwnerId,
  createRestaurantOwnerHandler,
  updateRestaurantOwner,
  deleteRestaurantOwner,
} from "./restaurantOwner.controller";

import validate from "../middleware/validate";
import { ownerSchema } from "../users/user.validator"; // adjust if path differs

export const restaurantOwnerRouter = Router();

// Get all restaurant owners
restaurantOwnerRouter.get("/restaurant-owner", getRestaurantOwners);

// Get restaurant owner by ID
restaurantOwnerRouter.get("/restaurant-owner/:id", getRestaurantOwnerById);

// Get restaurant owners by owner ID
restaurantOwnerRouter.get(
  "/restaurant-owner/owner/:ownerId",
  getRestaurantOwnersByOwnerId
);

// Create a new restaurant owner (validated)
restaurantOwnerRouter.post(
  "/restaurant-owner",
  validate(ownerSchema),
  createRestaurantOwnerHandler
);

// Update a restaurant owner (partial validation)
restaurantOwnerRouter.put(
  "/restaurant-owner/:id",
  validate(ownerSchema.partial()),
  updateRestaurantOwner
);

// Delete a restaurant owner
restaurantOwnerRouter.delete("/restaurant-owner/:id", deleteRestaurantOwner);
