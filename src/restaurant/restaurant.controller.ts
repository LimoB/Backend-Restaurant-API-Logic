import { Request, Response } from "express";
import {
  createRestaurantServices,
  deleteRestaurantServices,
  getRestaurantByIdServices,
  getRestaurantsServices,
  updateRestaurantServices, // Added import for city-specific restaurants
  getRestaurantsByCityServices, // Import for city-specific restaurants
} from "./restaurant.service"; // Ensure path is correct
import { TRestaurantInsert } from "../drizzle/schema"; // For req.body typing
// import { getCityByIdService } from "../city/city.service"; // If you need to validate city_id

export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const allRestaurants = await getRestaurantsServices();
    if (!allRestaurants || allRestaurants.length === 0) {
      // Check for empty array as well
      res.status(404).json({ message: "No Restaurants found" });
      return;
    }
    res.status(200).json(allRestaurants);
  } catch (error: any) {
    console.error("Controller: Get All Restaurants Error - ", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch Restaurants" });
    return;
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    // Added check for positive ID
    res.status(400).json({ error: "Invalid Restaurant ID format" });
    return;
  }
  try {
    const singleRestaurant = await getRestaurantByIdServices(id);
    if (!singleRestaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }
    res.status(200).json(singleRestaurant);
    return;
  } catch (error: any) {
    console.error(`Controller: Get Restaurant By ID ${id} Error - `, error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch restaurant" });
    return;
  }
};

export const createRestaurant = async (req: Request, res: Response) => {
  const {
    name,
    street_address,
    zip_code,
    city_id,
    contact_phone,
    contact_email,
  } = req.body as TRestaurantInsert;

  if (!name || !street_address || !zip_code || city_id === undefined) {
    res.status(400).json({
      error:
        "Required fields (name, street_address, zip_code, city_id) are missing",
    });
    return;
  }
  if (typeof city_id !== "number" || city_id <= 0) {
    // Added check for positive city_id
    res.status(400).json({ error: "city_id must be a positive number" });
    return;
  }

  try {
    // Optional: Validate if city_id exists
    // const cityExists = await getCityByIdService(city_id);
    // if (!cityExists) {
    //     return res.status(400).json({ message: `City with ID ${city_id} not found.` });
    // }

    const restaurantData: TRestaurantInsert = {
      name,
      street_address,
      zip_code,
      city_id,
      contact_phone: contact_phone || "", // Provide default if optional and not sent
      contact_email: contact_email || "", // Provide default
    };

    const newRestaurant = await createRestaurantServices(restaurantData);

    if (newRestaurant === null) {
      // Expecting TRestaurantSelect | null
      res.status(500).json({ message: "Failed to create Restaurant" });
      return;
    }
    res.status(201).json(newRestaurant); // Return created object
    return;
  } catch (error: any) {
    console.error("Controller: Create Restaurant Error - ", error);
    // Handle specific errors, e.g., unique constraint violation for name if applicable
    if (error.code === "23503") {
      // Example: PostgreSQL foreign key violation for city_id
      res
        .status(400)
        .json({ error: `Invalid city_id: ${city_id}. City does not exist.` });
      return;
    }
    if (error.code === "23505") {
      // Example unique constraint error
      res.status(409).json({
        error:
          "A restaurant with this name or unique identifier already exists.",
      });
      return;
    }
    res
      .status(500)
      .json({ error: error.message || "Failed to create Restaurant" });
    return;
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    // Added check for positive ID
    res.status(400).json({ error: "Invalid Restaurant ID format" });
    return;
  }

  const {
    name,
    street_address,
    zip_code,
    city_id,
    contact_phone,
    contact_email,
  } = req.body as Partial<TRestaurantInsert>;

  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ error: "No fields provided for update" });
    return;
  }
  if (city_id !== undefined && (typeof city_id !== "number" || city_id <= 0)) {
    // Added check for positive city_id
    res
      .status(400)
      .json({ error: "If provided, city_id must be a positive number" });
    return;
  }

  try {
    const updateData: Partial<TRestaurantInsert> = {};
    if (name !== undefined) updateData.name = name;
    if (street_address !== undefined)
      updateData.street_address = street_address;
    if (zip_code !== undefined) updateData.zip_code = zip_code;
    if (city_id !== undefined) updateData.city_id = city_id;
    if (contact_phone !== undefined) updateData.contact_phone = contact_phone;
    if (contact_email !== undefined) updateData.contact_email = contact_email;

    // Optional: If city_id is being updated, validate it
    // if (city_id !== undefined) {
    //     const cityExists = await getCityByIdService(city_id);
    //     if (!cityExists) {
    //         return res.status(400).json({ message: `City with ID ${city_id} not found for update.` });
    //     }
    // }

    const updatedRestaurant = await updateRestaurantServices(id, updateData);

    if (updatedRestaurant === null) {
      // Expecting TRestaurantSelect | null
      res
        .status(404)
        .json({ message: "Restaurant not found or no changes made" });
      return;
    }
    res.status(200).json(updatedRestaurant); // Return updated object
    return;
  } catch (error: any) {
    console.error(`Controller: Update Restaurant ${id} Error - `, error);
    if (
      error.code === "23503" &&
      error.constraint === "restaurant_city_id_fkey"
    ) {
      res.status(400).json({ error: `Invalid city_id. City does not exist.` });
      return;
    }
    res
      .status(500)
      .json({ error: error.message || "Failed to update restaurant" });
    return;
  }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    // Added check for positive ID
    res.status(400).json({ error: "Invalid Restaurant ID format" });
    return;
  }
  try {
    // The service layer should handle if the restaurant exists before attempting to delete.
    const result = await deleteRestaurantServices(id); // Expecting string | null

    if (result === null) {
      res
        .status(404)
        .json({ message: "Restaurant not found or failed to delete" });
      return;
    }
    res.status(200).json({ message: result }); // Return success message
    return;
  } catch (error: any) {
    console.error(`Controller: Delete Restaurant ${id} Error - `, error);
    // Handle potential errors like foreign key constraints if not handled by CASCADE or business logic
    if (error.code === "23503") {
      // Example foreign key violation
      res.status(409).json({
        error:
          "Cannot delete restaurant. It is still referenced by other records (e.g., menu items, orders).",
      });
      return;
    }
    res
      .status(500)
      .json({ error: error.message || "Failed to delete restaurant" });
    return;
  }
};

// src/restaurant/restaurant.controller.ts
// ... (other imports: Request, Response, getRestaurantsByCityServices)

export const getRestaurantsByCity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const cityIdParam = req.params.cityId;
  const cityId = parseInt(cityIdParam, 10); // Specify radix for parseInt

  if (isNaN(cityId) || cityId <= 0) {
    res.status(400).json({
      message: "Invalid City ID format. City ID must be a positive integer.",
    });
    return;
  }

  try {
    const restaurants = await getRestaurantsByCityServices(cityId);

    if (!restaurants || restaurants.length === 0) {
      res
        .status(404)
        .json({ message: `No restaurants found for City ID ${cityId}` });
      return;
    }

    res.status(200).json(restaurants);
    // No explicit 'return;' needed here as res.json() sends the response and ends it.
  } catch (error: any) {
    console.error(
      `Error in getRestaurantsByCity controller for cityId ${cityId}:`,
      error
    );
    res.status(500).json({
      message: "An error occurred while fetching restaurants by city.",
      // Optionally include error.message in development, but be cautious in production
      // detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
    // No explicit 'return;' needed here
  }
};
