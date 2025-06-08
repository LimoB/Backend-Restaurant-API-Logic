import { Router } from "express";
import { createAddressHandler, deleteAddress, getAddresses, getAddresssUsingId, updateAddressses } from "./address.controller";

export const addressRouter = Router();

// getAllAddresses
addressRouter.get('/address',getAddresses);

// getAddressById
addressRouter.get('/address/:id',getAddresssUsingId);

// create Address
addressRouter.post('/address',createAddressHandler);

// Update Adress
addressRouter.put('/address/:id',updateAddressses);

// Delete Address
addressRouter.delete('/address/:id',deleteAddress);

