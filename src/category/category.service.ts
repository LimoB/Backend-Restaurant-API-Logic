// src/category/category.service.ts
import { eq } from "drizzle-orm";
import db from "../drizzle/db"; // Ensure this path is correct
import {
  TCategoryInsert,
  TCategorySelect,
  category, // Your category table schema
} from "../drizzle/schema"; // Ensure this path is correct

// Service to get all categories
export const getCategoriesService = async (): Promise<
  TCategorySelect[] | null
> => {
  const categories = await db.query.category.findMany();
  return categories.length > 0 ? categories : null;
};

// Service to get a single category by its ID
export const getCategoryByIdService = async (
  id: number
): Promise<TCategorySelect | undefined> => {
  return await db.query.category.findFirst({
    where: eq(category.id, id),
  });
};

// Service to create a new category
export const createCategoryService = async (
  categoryData: TCategoryInsert
): Promise<string> => {
  try {
    await db.insert(category).values(categoryData);
    return "Category created successfully 🎉";
  } catch (error: any) {
    console.error("Error creating category:", error);
    // Example: Check for unique constraint violation if 'name' should be unique
    // This depends on your database schema constraints beyond the Drizzle definition
    if (error.code === "23505") {
      // PostgreSQL unique violation
      return "Error: A category with this name already exists.";
    }
    return "Failed to create category.";
  }
};

// Service to update an existing category
export const updateCategoryService = async (
  id: number,
  categoryData: Partial<TCategoryInsert>
): Promise<string> => {
  try {
    const result = await db
      .update(category)
      .set(categoryData)
      .where(eq(category.id, id))
      .returning({ id: category.id }); // Check if any row was updated

    if (result.length > 0) {
      return "Category updated successfully 😎";
    } else {
      return "Category not found or no changes made.";
    }
  } catch (error: any) {
    console.error("Error updating category:", error);
    if (error.code === "23505") {
      return "Error: Cannot update category, name may already exist.";
    }
    return "Failed to update category.";
  }
};

// Service to delete a category
export const deleteCategoryService = async (id: number): Promise<string> => {
  try {
    const result = await db
      .delete(category)
      .where(eq(category.id, id))
      .returning({ id: category.id }); // Check if any row was deleted

    if (result.length > 0) {
      return "Category deleted successfully 🎉";
    } else {
      return "Category not found.";
    }
  } catch (error: any) {
    console.error("Error deleting category:", error);
    // Example: Check for foreign key constraint violation
    // (e.g., if menu_items reference this category and onDelete is not CASCADE)
    if (error.code === "23503") {
      // PostgreSQL foreign key violation
      return "Error: Cannot delete category. It is still referenced by other records (e.g., menu items).";
    }
    return "Failed to delete category.";
  }
};

// If you need to fetch categories with their related menu items:
export const getCategoryWithMenuItemsService = async (
  categoryId: number
): Promise<(TCategorySelect & { menuItems: any[] }) | undefined> => {
  return await db.query.category.findFirst({
    where: eq(category.id, categoryId),
    // Assuming you've defined 'menuItemRelations' in your schema that links category to menu_item
    // and a general relation from category to menu_items like:
    // export const categoryRelations = relations(category, ({ many }) => ({
    // menuItems: many(menu_item),
    // }));
    // If not, you'll need to add such a relation in your drizzle/schema.ts
    with: {
      menuItems: {
        // This 'menuItems' must match the relation name in your schema
        columns: { name: true, price: true }, // Example: only fetch name and price
      },
    },
  });
};
