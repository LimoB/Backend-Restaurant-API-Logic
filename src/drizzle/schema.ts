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

// Order Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  actual_delivery_time: timestamp("actual_delivery_time"),
  restaurant_id: integer("restaurant_id"),//.references(() => restaurant.id),
  delivery_address_id: integer("delivery_address_id"),//.references(() => address.id),
  user_id: integer("user_id"),//.references(() => user.id),
  driver_id: integer("driver_id"),//.references(() => driver.id),
  estimated_delivery_time: timestamp("estimated_delivery_time").notNull(),
  price: decimal("price").notNull(),
  discount: decimal("discount").notNull(),
  final_price: decimal("final_price").notNull(),
  comment: text("comment"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// Order Menu Item Table
export const order_menu_item = pgTable("order_menu_item", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id").references(() => orders.id),
  menu_item_id: integer("menu_item_id"),//.references(() => menu_item.id),
  quantity: integer("quantity"),
  item_name: text("item_name"),
  price: decimal("price"),
  comment: text("comment")
});

// Order Status Table
export const status_catalog = pgTable("status_catalog", {
  id: serial("id").primaryKey(),
  name: text("name")
});

export const order_status = pgTable("order_status", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id").references(() => orders.id),
  status_catalog_id: integer("status_catalog_id").references(() => status_catalog.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});










// Infer Types
export type TUserInsert = typeof users.$inferInsert;
export type TUserSelect = typeof users.$inferSelect;

export type TOrdersInsert = typeof orders.$inferInsert;
export type TOrdersSelect = typeof orders.$inferSelect;

export type TOrderMenuItemInsert = typeof order_menu_item.$inferInsert;
export type TOrderMenuItemSelect = typeof order_menu_item.$inferSelect;

 
export type TOrderStatusInsert = typeof order_status.$inferInsert;
 
export type TOrderStatusSelect = typeof order_status.$inferSelect;

export type TStatusCatalogInsert = typeof status_catalog.$inferInsert;
 
export type TStatusCatalogSelect = typeof status_catalog.$inferSelect;


// Relations

