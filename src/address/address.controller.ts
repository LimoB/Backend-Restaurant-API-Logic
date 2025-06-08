import { Request, Response } from "express";
import {
  createAddressServices,
  deleteAddressServices,
  getAddressByIdServices,
  getAddressesServices,
  updateAddressServices,
} from "./address.service";

// Get all addresses
export const getAddresses = async (req: Request, res: Response) => {
  try {
    const allAddresses = await getAddressesServices();
    if (!allAddresses || allAddresses.length === 0) {
      res.status(404).json({ message: "No addresses found" });
      return;
    }
    res.status(200).json(allAddresses);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch addresses" });
  }
};

// Get address by ID
export const getAddressById = async (req: Request, res: Response) => {
  const addressId = parseInt(req.params.id);
  if (isNaN(addressId)) {
    res.status(400).json({ error: "Invalid address ID" });
    return;
  }
  try {
    const addr = await getAddressByIdServices(addressId);
    if (!addr) {
      res.status(404).json({ message: "Address not found" });
      return;
    }
    res.status(200).json(addr);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch address" });
  }
};

// Create a new address
export const createAddressHandler = async (req: Request, res: Response) => {
  const {
    street_address_1,
    street_address_2 = "",
    zip_code,
    delivery_instructions = "",
    city_id,
  } = req.body;

  if (!street_address_1 || !zip_code || !city_id) {
    res.status(400).json({
      error: "Required fields: street_address_1, zip_code, city_id",
    });
    return;
  }

  try {
    const result = await createAddressServices({
      street_address_1,
      street_address_2,
      zip_code,
      delivery_instructions,
      city_id,
    });
    res.status(201).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create address" });
  }
};

// Update an address
export const updateAddress = async (req: Request, res: Response) => {
  const addressId = parseInt(req.params.id);
  if (isNaN(addressId)) {
    res.status(400).json({ error: "Invalid address ID" });
    return;
  }

  const {
    street_address_1,
    street_address_2,
    zip_code,
    delivery_instructions,
    city_id,
  } = req.body;

  try {
    const result = await updateAddressServices(addressId, {
      street_address_1,
      street_address_2,
      zip_code,
      delivery_instructions,
      city_id,
    });
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update address" });
  }
};

// Delete an address
export const deleteAddress = async (req: Request, res: Response) => {
  const addressId = parseInt(req.params.id);
  if (isNaN(addressId)) {
    res.status(400).json({ error: "Invalid address ID" });
    return;
  }

  try {
    const deleted = await deleteAddressServices(addressId);
    if (deleted) {
      res.status(200).json({ message: "Address deleted successfully" });
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete address" });
  }
};