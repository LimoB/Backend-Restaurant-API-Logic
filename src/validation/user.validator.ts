import { z } from "zod";

// Shared base user schema (used for both verified and unverified users)
const baseUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact_phone: z.string().min(7, "Phone number too short").max(20),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  user_type: z.enum(["member", "admin", "driver", "owner"]),
});

// Additional validation for driver-specific fields
export const driverSchema = baseUserSchema.extend({
  car_make: z.string().min(1),
  car_model: z.string().min(1),
  car_year: z.string().length(4, "Car year must be 4 digits"),
  license_plate: z.string().min(1).max(20),
});

// Additional validation for owner-specific fields
export const ownerSchema = baseUserSchema.extend({
  restaurant_id: z.number().int().positive("Valid restaurant ID is required"),
});

// Used for user registration (unverified_users)
export const unverifiedUserSchema = baseUserSchema.extend({
  verification_code: z.string().min(1),
});

// For user login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
