import { z } from "zod";

// ✅ Shared base user schema (for member, admin, driver, owner)
const baseUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact_phone: z.string().min(7, "Phone number too short").max(20),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  user_type: z.enum(["member", "admin", "driver", "owner"]),
});

// ✅ For creating a user (verification_code removed — it's generated server-side)
export const createUserSchema = baseUserSchema;

// 🛠 For updating a user (all fields optional)
export const updateUserSchema = baseUserSchema.partial();

// 🚗 Driver-specific schema (extends base)
export const driverSchema = baseUserSchema.extend({
  car_make: z.string().min(1),
  car_model: z.string().min(1),
  car_year: z.string().length(4, "Car year must be 4 digits"),
  license_plate: z.string().min(1).max(20),
});

// 🍽️ Owner-specific schema (extends base)
export const ownerSchema = baseUserSchema.extend({
  restaurant_id: z.number().int().positive("Valid restaurant ID is required"),
});

// 🔑 Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
