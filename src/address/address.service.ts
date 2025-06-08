import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { address, TAddressInsert, TAddressSelect } from "../drizzle/schema";

// Get all addresses

export const getAllAddressesServices = async (): Promise<TAddressSelect[] | null> => {
  return await db.query.address.findMany({
    with: {
      city: {
        columns: {
          name: true,
        },
      },
    },
  });
};

//Get a single address by ID
export const getAddressByIdServices = async (addressId: number): Promise<TAddressSelect | undefined> => {
  return await db.query.address.findFirst({
    where: eq(address.id, addressId),
    with: {
      city: {
        columns: {
          name: true,
        },
      },
    },
  });
};


 //Create a new address

export const createAddressServices = async (addressData: TAddressInsert): Promise<string> => {
  await db.insert(address).values(addressData);
  return "✅ Address created successfully";
};


// Update an existing address
export const updateAddressServices = async (addressId: number, driverData: Partial<TAddressInsert>): Promise<string> => {
  await db.update(address).set(driverData).where(eq(address.id, addressId));
  return "Address Updated Successfully ✏️";
};


// Delete Address
export const deleteAddressServices = async (addressId: number): Promise<string> => {
  await db.delete(address).where(eq(address.id, addressId));
  return "🗑️ Address deleted successfully";
};
