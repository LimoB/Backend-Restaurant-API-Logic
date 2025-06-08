// src/driver/driver.controller.ts
import { Request, Response } from "express";
import {  createAddressServices, deleteAddressServices, getAddressByIdServices, getAllAddressesServices, updateAddressServices } from "./address.service";

// Get all drivers
export const getAddresses = async (req: Request, res: Response) => {
  try {
    const allAddress = await getAllAddressesServices();
    if (!allAddress || allAddress.length === 0) {
      res.status(404).json({ message: "No drivers found" });
      return;
    }
    res.status(200).json(allAddress);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch Addresses" });
  }
};

// Get Address by ID
export const getAddresssUsingId = async (req: Request, res: Response) => {
  const addressId = parseInt(req.params.userId);
  if (isNaN(addressId)) {
    res.status(400).json({ error: "Invalid Address ID" });
    return;
  }
  try {
    const addressData = await getAddressByIdServices(addressId);
    if (!addressData) {
      res.status(404).json({ message: "No address found for this id" });
      return;
    }
    res.status(200).json(addressData);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch Address" });
  }
};

// Create a new Address
export const createAddressHandler = async (req: Request, res: Response) => {
  const { street_address_1,
          street_address_2,
          zip_code, 
          delivery_instructions,
          city_id,
          created_at,
          updated_at
        } = req.body;

  if (!street_address_1 || !street_address_2 || !zip_code || !delivery_instructions || !city_id || created_at || updated_at){
    res.status(400).json({
      error: "All Fields Are Required",
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
          created_at,
          updated_at
    });
    res.status(201).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create driver" });
  }
};

// Update a driver
export const updateAddressses = async (req: Request, res: Response) => {
  const AddrressId = parseInt(req.params.id);
  if (isNaN(AddrressId)) {
    res.status(400).json({ error: "Invalid driver ID" });
    return;
  }

  const {
          street_address_1,
          street_address_2,
          zip_code, 
          delivery_instructions,
          city_id,
          created_at,
          updated_at
    
  } = req.body;

  try {
    const result = await updateAddressServices(AddrressId, {
      street_address_1,
          street_address_2,
          zip_code, 
          delivery_instructions,
          city_id,
          created_at,
          updated_at
    });
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update Address" });
  }
};

// Delete a driver
export const deleteAddress = async (req: Request, res: Response) => {
  const addressId = parseInt(req.params.id);
  if (isNaN(addressId)) {
    res.status(400).json({ error: "Invalid Address ID" });
    return;
  }

  try {
    const deleted = await deleteAddressServices(addressId);
    if (deleted) {
      res.status(200).json({ message: "Addresss deleted successfully" });
    } else {
      res.status(404).json({ message: "Addresss not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete Addresss" });
  }
};