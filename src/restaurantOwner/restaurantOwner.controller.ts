import { Request, Response } from "express";
import {
  createRestaurantOwnerServices,
  deleteRestaurantOwnerServices,
  getRestaurantOwnerByIdServices,
  getRestaurantOwnersByOwnerIdServices,
  getRestaurantOwnersServices,
  updateRestaurantOwnerServices,
} from "./restaurantOwner.service";

// Get all restaurant owners
export const getRestaurantOwners = async (req: Request, res: Response) => {
  try {
    const owners = await getRestaurantOwnersServices();
    if (!owners || owners.length === 0) {
      res.status(404).json({ message: "No restaurant owners found" });
      return;
    }
    res.status(200).json(owners);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch restaurant owners" });
  }
};

// Get restaurant owner by ID
export const getRestaurantOwnerById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid restaurant owner ID" });
    return;
  }
  try {
    const owner = await getRestaurantOwnerByIdServices(id);
    if (!owner) {
      res.status(404).json({ message: "Restaurant owner not found" });
      return;
    }
    res.status(200).json(owner);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch restaurant owner" });
  }
};

// Get restaurant owners by owner ID
export const getRestaurantOwnersByOwnerId = async (req: Request, res: Response) => {
  const ownerId = parseInt(req.params.ownerId);
  if (isNaN(ownerId)) {
    res.status(400).json({ error: "Invalid owner ID" });
    return;
  }
  try {
    const owners = await getRestaurantOwnersByOwnerIdServices(ownerId);
    if (!owners || owners.length === 0) {
      res.status(404).json({ message: "No restaurant owners found for this user" });
      return;
    }
    res.status(200).json(owners);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch restaurant owners" });
  }
};

// Create a new restaurant owner
export const createRestaurantOwnerHandler = async (req: Request, res: Response) => {
  const { restaurant_id, owner_id } = req.body;

  if (!restaurant_id || !owner_id) {
    res.status(400).json({ error: "Required fields: restaurant_id, owner_id" });
    return;
  }

  try {
    const result = await createRestaurantOwnerServices({ restaurant_id, owner_id });
    res.status(201).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create restaurant owner" });
  }
};

// Update a restaurant owner
export const updateRestaurantOwner = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid restaurant owner ID" });
    return;
  }

  const { restaurant_id, owner_id } = req.body;

  try {
    const result = await updateRestaurantOwnerServices(id, { restaurant_id, owner_id });
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update restaurant owner" });
  }
};

// Delete a restaurant owner
export const deleteRestaurantOwner = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid restaurant owner ID" });
    return;
  }

  try {
    const deleted = await deleteRestaurantOwnerServices(id);
    if (deleted) {
      res.status(200).json({ message: "Restaurant owner deleted successfully" });
    } else {
      res.status(404).json({ message: "Restaurant owner not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete restaurant owner" });
  }
};
