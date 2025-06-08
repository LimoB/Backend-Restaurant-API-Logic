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
  customType,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const statusEnum = pgEnum("status_enum", [
  "pending",
  "accepted",
  "rejected",
  "delivered",
]);

export const userTypeEnum = pgEnum("user_type", [
  "member",
  "admin",
  "driver",
  "owner",
]);

// Enum for comment type
export const commentTypeEnum = pgEnum("comment_type", ["praise", "complaint", "neutral"]);


// State
export const state = pgTable("state", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: varchar("code", { length: 10 }).notNull(),
});

// City
export const city = pgTable("city", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  state_id: integer("state_id").references(() => state.id, { onDelete: "cascade" }).notNull(),
  address: text("address").default(""),
  // state: text("state").default(""),
});

// Address
export const address = pgTable("address", {
  id: serial("id").primaryKey(),
  street_address_1: text("street_address_1").notNull(),
  street_address_2: text("street_address_2").default(""),
  zip_code: varchar("zip_code", { length: 20 }).notNull(),
  delivery_instructions: text("delivery_instructions").default(""),
  city_id: integer("city_id").references(() => city.id).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Users
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
  reset_token: varchar("reset_token", { length: 255 }),
  reset_token_expiry: timestamp("reset_token_expiry"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  address_id: integer("address_id").references(() => address.id),
});

// Unverified Users
export const unverified_users = pgTable("unverified_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact_phone: varchar("contact_phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  verification_code: varchar("verification_code", { length: 100 }).notNull(),
  verification_code_expiry: timestamp("verification_code_expiry").notNull(),
  password: text("password").notNull(),
  user_type: userTypeEnum("user_type").default("member").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Restaurant
export const restaurant = pgTable("restaurant", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  street_address: text("street_address").notNull(),
  zip_code: varchar("zip_code", { length: 20 }).notNull(),
  city_id: integer("city_id").references(() => city.id).notNull(),
  contact_phone: varchar("contact_phone", { length: 20 }).default(""),
  contact_email: varchar("contact_email", { length: 255 }).default(""),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Category
export const category = pgTable("category", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

// Menu Item
export const menu_item = pgTable("menu_item", {
  id: serial("id").primaryKey(),
  category_id: integer("category_id").references(() => category.id).notNull(),
  restaurant_id: integer("restaurant_id").references(() => restaurant.id).notNull(),
  name: text("name").notNull(),
  ingredients: text("ingredients").default(""),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  active: boolean("active").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Driver
export const driver = pgTable("driver", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  car_make: text("car_make").notNull(),
  car_model: text("car_model").notNull(),
  car_year: varchar("car_year", { length: 4 }).notNull(),
  license_plate: varchar("license_plate", { length: 20 }).notNull(),
  active: boolean("active").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Restaurant Owner
export const restaurant_owner = pgTable("restaurant_owner", {
  id: serial("id").primaryKey(),
  restaurant_id: integer("restaurant_id").references(() => restaurant.id, { onDelete: "cascade" }).notNull(),
  owner_id: integer("owner_id").references(() => users.id).notNull(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  actual_delivery_time: timestamp("actual_delivery_time"),
  restaurant_id: integer("restaurant_id").references(() => restaurant.id).notNull(),
  delivery_address_id: integer("delivery_address_id").references(() => address.id).notNull(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  driver_id: integer("driver_id").references(() => driver.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0").notNull(),
  final_price: decimal("final_price", { precision: 10, scale: 2 }).notNull(),
  comment: text("comment").default(""),
   status: statusEnum("status").default("pending").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Comment
export const comment = pgTable("comment", {
  id: serial("id").primaryKey(),

  order_id: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),

  user_id: integer("user_id")
    .references(() => users.id)
    .notNull(),

  comment_text: text("comment_text").notNull(),

  comment_type: commentTypeEnum("comment_type").notNull(),

  rating: integer("rating"), // optional

  created_at: timestamp("created_at").defaultNow().notNull(),

  updated_at: timestamp("updated_at").defaultNow().notNull(),
});


// Order Menu Item
export const order_menu_item = pgTable("order_menu_item", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id").references(() => orders.id).notNull(),
  menu_item_id: integer("menu_item_id").references(() => menu_item.id).notNull(),
  quantity: integer("quantity").notNull(),
  item_name: text("item_name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  comment: text("comment").default(""),
});

// Status Catalog
export const status_catalog = pgTable("status_catalog", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

// Order Status
export const order_status = pgTable("order_status", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id").references(() => orders.id).notNull(),
  status_catalog_id: integer("status_catalog_id").references(() => status_catalog.id).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Types
export type TUserInsert = typeof users.$inferInsert;
export type TUserSelect = typeof users.$inferSelect;
export type TDriverInsert = typeof driver.$inferInsert;
export type TDriverSelect = typeof driver.$inferSelect;
export type TStateInsert = typeof state.$inferInsert;
export type TStateSelect = typeof state.$inferSelect;
export type TCityInsert = typeof city.$inferInsert;
export type TCitySelect = typeof city.$inferSelect;
export type TAddressInsert = typeof address.$inferInsert;
export type TAddressSelect = typeof address.$inferSelect;
export type TCategoryInsert = typeof category.$inferInsert;
export type TCategorySelect = typeof category.$inferSelect;
export type TMenuItemInsert = typeof menu_item.$inferInsert;
export type TMenuItemSelect = typeof menu_item.$inferSelect;
export type TRestaurantInsert = typeof restaurant.$inferInsert;
export type TRestaurantSelect = typeof restaurant.$inferSelect;
export type TRestaurantOwnerInsert = typeof restaurant_owner.$inferInsert;
export type TRestaurantOwnerSelect = typeof restaurant_owner.$inferSelect;
export type TOrdersInsert = typeof orders.$inferInsert;
export type TOrdersSelect = typeof orders.$inferSelect;
export type TOrderMenuItemInsert = typeof order_menu_item.$inferInsert;
export type TOrderMenuItemSelect = typeof order_menu_item.$inferSelect;
export type TOrderStatusInsert = typeof order_status.$inferInsert;
export type TOrderStatusSelect = typeof order_status.$inferSelect;
export type TStatusCatalogInsert = typeof status_catalog.$inferInsert;
export type TStatusCatalogSelect = typeof status_catalog.$inferSelect;
export type TCommentInsert = typeof comment.$inferInsert;
export type TCommentSelect = typeof comment.$inferSelect;


// City ↔ State
export const cityRelations = relations(city, ({ one, many }) => ({
  state: one(state, {
    fields: [city.state_id],
    references: [state.id],
  }),
  restaurants: many(restaurant),
  addresses: many(address),
}));

export const stateRelations = relations(state, ({ many }) => ({
  cities: many(city),
}));

// Address ↔ City, Users, Orders
export const addressRelations = relations(address, ({ one, many }) => ({
  city: one(city, {
    fields: [address.city_id],
    references: [city.id],
  }),
  users: many(users),
  orders: many(orders),
}));

// Users ↔ Address, Driver, Comments, Orders, Restaurant Owners
export const userRelations = relations(users, ({ one, many }) => ({
  address: one(address, {
    fields: [users.address_id],
    references: [address.id],
  }),
  drivers: many(driver),
  comments: many(comment),
  orders: many(orders),
  restaurantOwners: many(restaurant_owner),
}));

export const driverRelations = relations(driver, ({ one, many }) => ({
  user: one(users, {
    fields: [driver.user_id],
    references: [users.id],
  }),
  orders: many(orders),
}));

// Menu Item ↔ Category, Restaurant, Order Menu Items
export const menuItemRelations = relations(menu_item, ({ one, many }) => ({
  category: one(category, {
    fields: [menu_item.category_id],
    references: [category.id],
  }),
  restaurant: one(restaurant, {
    fields: [menu_item.restaurant_id],
    references: [restaurant.id],
  }),
  orderMenuItems: many(order_menu_item),
}));

// Restaurant ↔ City, Menu Items, Restaurant Owners, Orders
export const restaurantRelations = relations(restaurant, ({ one, many }) => ({
  city: one(city, {
    fields: [restaurant.city_id],
    references: [city.id],
  }),
  menuItems: many(menu_item),
  restaurantOwners: many(restaurant_owner),
  orders: many(orders),
}));

// Restaurant Owner ↔ User, Restaurant
export const restaurantOwnerRelations = relations(restaurant_owner, ({ one }) => ({
  user: one(users, {
    fields: [restaurant_owner.owner_id],
    references: [users.id],
  }),
  restaurant: one(restaurant, {
    fields: [restaurant_owner.restaurant_id],
    references: [restaurant.id],
  }),
}));

// Orders ↔ User, Driver, Restaurant, Address, Order Menu Items, Comments, Order Status
export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.user_id],
    references: [users.id],
  }),
  driver: one(driver, {
    fields: [orders.driver_id],
    references: [driver.id],
  }),
  restaurant: one(restaurant, {
    fields: [orders.restaurant_id],
    references: [restaurant.id],
  }),
  address: one(address, {
    fields: [orders.delivery_address_id],
    references: [address.id],
  }),
  orderMenuItems: many(order_menu_item),
  comments: many(comment),
  statuses: many(order_status),
}));

// Comment ↔ Order, User
export const commentRelations = relations(comment, ({ one }) => ({
  order: one(orders, {
    fields: [comment.order_id],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [comment.user_id],
    references: [users.id],
  }),
}));

// Order Menu Item ↔ Order, Menu Item
export const orderMenuItemRelations = relations(order_menu_item, ({ one }) => ({
  order: one(orders, {
    fields: [order_menu_item.order_id],
    references: [orders.id],
  }),
  menuItem: one(menu_item, {
    fields: [order_menu_item.menu_item_id],
    references: [menu_item.id],
  }),
}));

// Order Status ↔ Order, Status Catalog
export const orderStatusRelations = relations(order_status, ({ one }) => ({
  order: one(orders, {
    fields: [order_status.order_id],
    references: [orders.id],
  }),
  statusCatalog: one(status_catalog, {
    fields: [order_status.status_catalog_id],
    references: [status_catalog.id],
  }),
}));
