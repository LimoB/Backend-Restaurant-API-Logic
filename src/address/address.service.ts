import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { address, type TAddressInsert, type TAddressSelect } from "../drizzle/schema";

// Get all addresses
export const getAddressesServices = async (): Promise<TAddressSelect[]> => {
  return await db.query.address.findMany();
};

// Get address by ID
export const getAddressByIdServices = async (addressId: number): Promise<TAddressSelect | undefined> => {
  return await db.query.address.findFirst({
    where: eq(address.id, addressId),
  });
};

// Create a new address
export const createAddressServices = async (addressData: TAddressInsert): Promise<string> => {
  await db.insert(address).values(addressData).returning();
  return "Address Created Successfully 🏠";
};

// Update an existing address
export const updateAddressServices = async (
  addressId: number,
  addressData: Partial<TAddressInsert>
): Promise<string> => {
  await db.update(address).set(addressData).where(eq(address.id, addressId));
  return "Address Updated Successfully 🏡";
};

// Delete an address
export const deleteAddressServices = async (addressId: number): Promise<boolean> => {
  const deletedRows = await db.delete(address).where(eq(address.id, addressId)).returning();
  return deletedRows.length > 0;
};