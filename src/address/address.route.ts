import { Router } from "express";
import {
  getAddresses,
  getAddressById,
  createAddressHandler,
  updateAddress,
  deleteAddress,
} from "./address.controller";

export const addressRouter = Router();

// Address routes definition

// Get all addresses
addressRouter.get("/address", getAddresses);

// Get address by ID
addressRouter.get("/address/:id", getAddressById);

// Create a new address
addressRouter.post("/address", createAddressHandler);

// Update an existing address
addressRouter.put("/address/:id", updateAddress);

// Delete an existing address
addressRouter.delete("/address/:id", deleteAddress);