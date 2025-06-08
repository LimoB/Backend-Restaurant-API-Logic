// src/category/category.controller.ts
import { Request, Response } from "express";
import {
  getCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  getCategoryWithMenuItemsService, // For the example of fetching with relations
} from "./category.service";
import { TCategoryInsert } from "../drizzle/schema"; // Assuming this path is correct

// Controller to get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getCategoriesService();
    if (categories && categories.length > 0) {
      res.status(200).json(categories);
      return;
    }
    res.status(404).json({ message: "No categories found." });
    return;
  } catch (error: any) {
    console.error("Controller: Get All Categories Error - ", error);
    res
      .status(500)
      .json({ message: "Error fetching categories.", error: error.message });
    return;
  }
};

// Controller to get a single category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "Invalid category ID format." });
    return;
  }
  try {
    const category = await getCategoryByIdService(id);
    if (category) {
      res.status(200).json(category);
      return;
    }
    res.status(404).json({ message: `Category with ID ${id} not found.` });
    return;
  } catch (error: any) {
    console.error(`Controller: Get Category By ID ${id} Error - `, error);
    res.status(500).json({
      message: `Error fetching category with ID ${id}.`,
      error: error.message,
    });
    return;
  }
};

// Controller to create a new category
export const createCategory = async (req: Request, res: Response) => {
  const categoryData = req.body as TCategoryInsert; // Add validation here (e.g., using Zod)

  // Basic validation example (you should use a library like Zod for robust validation)
  if (
    !categoryData.name ||
    typeof categoryData.name !== "string" ||
    categoryData.name.trim() === ""
  ) {
    res.status(400).json({
      message: "Category name is required and must be a non-empty string.",
    });
    return;
  }

  try {
    const message = await createCategoryService(categoryData);
    if (message.startsWith("Error:")) {
      // Check if service returned an error message
      // Determine appropriate status code based on error message if possible
      if (message.includes("already exists")) {
        res.status(409).json({ message }); // Conflict
        return;
      }
      res.status(400).json({ message }); // Bad request for other creation errors
      return;
    }
    // If successful, the service returns a success message.
    // Optionally, fetch the created category to return it in the response
    // For simplicity here, just returning the success message from service
    res.status(201).json({ message });
    return;
  } catch (error: any) {
    console.error("Controller: Create Category Error - ", error);
    res
      .status(500)
      .json({ message: "Error creating category.", error: error.message });
    return;
  }
};

// Controller to update an existing category
export const updateCategory = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "Invalid category ID format." });
    return;
  }
  const categoryData = req.body as Partial<TCategoryInsert>; // Add validation here

  // Basic validation example
  if (Object.keys(categoryData).length === 0) {
    res.status(400).json({ message: "No data provided for update." });
    return;
  }
  if (
    categoryData.name !== undefined &&
    (typeof categoryData.name !== "string" || categoryData.name.trim() === "")
  ) {
    res.status(400).json({
      message: "Category name must be a non-empty string if provided.",
    });
    return;
  }

  try {
    const message = await updateCategoryService(id, categoryData);
    if (message.startsWith("Error:")) {
      if (message.includes("name may already exist")) {
        res.status(409).json({ message }); // Conflict
        return;
      }
      res.status(400).json({ message });
      return;
    }
    if (message.includes("not found")) {
      res.status(404).json({ message });
      return;
    }
    // If successful, return the success message
    res.status(200).json({ message });
    return;
  } catch (error: any) {
    console.error(`Controller: Update Category ID ${id} Error - `, error);
    res.status(500).json({
      message: `Error updating category with ID ${id}.`,
      error: error.message,
    });
    return;
  }
};

// Controller to delete a category
export const deleteCategory = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "Invalid category ID format." });
    return;
  }
  try {
    const message = await deleteCategoryService(id);
    if (message.startsWith("Error:")) {
      if (message.includes("referenced by other records")) {
        res.status(409).json({ message }); // Conflict
        return;
      }
      res.status(400).json({ message });
      return;
    }
    if (message.includes("not found")) {
      res.status(404).json({ message });
      return;
    }
    // If successful, return the success message
    res.status(200).json({ message }); // Or 204 No Content for deletes
    return;
  } catch (error: any) {
    console.error(`Controller: Delete Category ID ${id} Error - `, error);
    res.status(500).json({
      message: `Error deleting category with ID ${id}.`,
      error: error.message,
    });
    return;
  }
};

// Example: Controller to get a category with its menu items
export const getCategoryWithMenuItems = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "Invalid category ID." });
    return;
  }
  try {
    const categoryDetails = await getCategoryWithMenuItemsService(id);
    if (categoryDetails) {
      res.status(200).json(categoryDetails);
      return;
    }
    res.status(404).json({
      message: `Category with ID ${id} and its menu items not found.`,
    });
    return;
  } catch (error: any) {
    console.error(
      `Controller: Get Category With Menu Items ID ${id} Error - `,
      error
    );
    res.status(500).json({
      message: "Error fetching category details.",
      error: error.message,
    });
    return;
  }
};
