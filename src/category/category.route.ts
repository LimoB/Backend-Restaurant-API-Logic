// src/category/category.router.ts
import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryWithMenuItems, // For the example route
} from "./category.controller";
// import { requireAdmin } from "../middleware/authMiddleware"; // Example: If you have auth middleware

export const categoryRouter = Router();

// Public routes (or add specific auth middleware if needed)
categoryRouter.get("/categories", getCategories);
categoryRouter.get("/categories/:id", getCategoryById);

// Example: Route to get category with its menu items
categoryRouter.get("/categories/:id/menu-items", getCategoryWithMenuItems);

// Protected routes (example: only admins can create, update, delete)
// You would need to implement requireAdmin or similar middleware based on your auth setup.
// For now, these are open for simplicity.
// categoryRouter.post("/categories", requireAdmin, createCategory);
// categoryRouter.put("/categories/:id", requireAdmin, updateCategory);
// categoryRouter.delete("/categories/:id", requireAdmin, deleteCategory);

categoryRouter.post("/categories", createCategory); // Open for now
categoryRouter.put("/categories/:id", updateCategory); // Open for now
categoryRouter.delete("/categories/:id", deleteCategory); // Open for now
