import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  varchar,
  boolean,
  decimal,
  pgEnum,
  
} from "drizzle-orm/pg-core";

// Status Enum for order status tracking
// export const statusEnum = pgEnum("status_enum", [
//   "pending",
//   "accepted",
//   "rejected",
//   "delivered",
// ]);

// Role Enum for user authorization roles
export const userTypeEnum = pgEnum("user_type", [
  "member",
  "admin",
  "driver",
  "owner",
]);





// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact_phone: varchar("contact_phone", { length: 20 }).notNull(),
  phone_verified: boolean("phone_verified").default(false).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  email_verified: boolean("email_verified").default(false).notNull(),
  verification_code: varchar("verification_code", { length: 100 }).default(""),
  password: text("password").notNull(),
  user_type: userTypeEnum("user_type").default("member").notNull(),
  reset_token: varchar("reset_token", { length: 255 }),//.default(null),
  reset_token_expiry: timestamp("reset_token_expiry"),//.nullable(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  address_id: integer("address_id")//.references(() => address.id),//.nullable(),
});










// Infer Types
export type TUserInsert = typeof users.$inferInsert;
export type TUserSelect = typeof users.$inferSelect;


// Relations

