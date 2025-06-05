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
export const statusEnum = pgEnum("status_enum", [
  "pending",
  "accepted",
  "rejected",
  "delivered",
]);

// Role Enum for user authorization roles
export const userTypeEnum = pgEnum("user_type", [
  "member",
  "admin",
  "driver",
  "owner",
]);


// State Table
export const state = pgTable("state", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: varchar("code", { length: 10 }).notNull(),
});

// City Table
export const city = pgTable("city", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  state_id: integer("state_id")
    .references(() => state.id, { onDelete: "cascade" })
    .notNull(),
  address: text("address").default(""),
  state: text("state").default(""),
});

// Address Table
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

// Driver Table
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


// Restaurant Owner Table
export const restaurant_owner = pgTable("restaurant_owner", {
  id: serial("id").primaryKey(),
  restaurant_id: integer("restaurant_id")
    .references(() => restaurant.id, { onDelete: "cascade" })
    .notNull(),
  owner_id: integer("owner_id").references(() => users.id).notNull(),
});



// Restaurant Table
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

// Category Table
export const category = pgTable("category", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

// Menu Item Table
export const menu_item = pgTable("menu_item", {
  id: serial("id").primaryKey(),
  category_id: integer("category_id")
    .references(() => category.id, { onDelete: "restrict" })
    .notNull(),
  restaurant_id: integer("restaurant_id")
    .references(() => restaurant.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  ingredients: text("ingredients").default(""),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  active: boolean("active").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  actual_delivery_time: timestamp("actual_delivery_time"),//.nullable(),
  restaurant_id: integer("restaurant_id").references(() => restaurant.id).notNull(),
  delivery_address_id: integer("delivery_address_id")
    .references(() => address.id)
    .notNull(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  driver_id: integer("driver_id").references(() => driver.id),//.nullable(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0").notNull(),
  final_price: decimal("final_price", { precision: 10, scale: 2 }).notNull(),
  comment: text("comment").default(""),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Comment Table
export const comment = pgTable("comment", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  comment: text("comment").notNull(),
  rating: integer("rating").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Order Menu Item Table
export const order_menu_item = pgTable("order_menu_item", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id").references(() => orders.id).notNull(),
  menu_item_id: integer("menu_item_id")
    .references(() => menu_item.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  item_name: text("item_name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  comment: text("comment").default(""),
});


//end of caleb tables


// Status Catalog Table
export const status_catalog = pgTable("status_catalog", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

// Order Status Table
export const order_status = pgTable("order_status", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id").references(() => orders.id).notNull(),
  status_catalog_id: integer("status_catalog_id")
    .references(() => status_catalog.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});




// Infer Types
export type TUserInsert = typeof users.$inferInsert;
export type TUserSelect = typeof users.$inferSelect;
//caleb added infer types below
//start of caleb types
export type TCategoryInsert = typeof category.$inferInsert;
export type TCategorySelect = typeof category.$inferSelect;

//chela
export type TOrdersInsert = typeof orders.$inferInsert;
export type TOrdersSelect = typeof orders.$inferSelect;

export type TMenuItemInsert = typeof menu_item.$inferInsert;
export type TMenuItemSelect = typeof menu_item.$inferSelect;

export type TRestaurantInsert = typeof restaurant.$inferInsert;
export type TRestaurantSelect = typeof restaurant.$inferSelect;

//end of caleb types

export type TDriverInsert = typeof driver.$inferInsert;
export type TDriverSelect = typeof driver.$inferSelect;

export type TStateInsert = typeof state.$inferInsert;
export type TStateSelect = typeof state.$inferSelect;

export type TCityInsert = typeof city.$inferInsert;
export type TCitySelect = typeof city.$inferSelect;

export type TAddressInsert = typeof address.$inferInsert;
export type TAddressSelect = typeof address.$inferSelect;


//chela...

export type TOrderStatusInsert = typeof order_status.$inferInsert;
export type TOrderStatusSelect = typeof order_status.$inferSelect;

export type TStatusCatalogInsert = typeof status_catalog.$inferInsert;
export type TStatusCatalogSelect = typeof status_catalog.$inferSelect;

export type TCommentInsert = typeof comment.$inferInsert;
export type TCommentSelect = typeof comment.$inferSelect;

export type TRestaurantOwnerInsert = typeof restaurant_owner.$inferInsert;
export type TRestaurantOwnerSelect = typeof restaurant_owner.$inferSelect;



export type TOrderMenuItemInsert = typeof order_menu_item.$inferInsert;
export type TOrderMenuItemSelect = typeof order_menu_item.$inferSelect;




// Relations

export const cityStateRelation = relations(city, ({ one }) => ({
  state: one(state, {
    fields: [city.state_id],
    references: [state.id],
  }),
}));

export const addressCityRelation = relations(address, ({ one }) => ({
  city: one(city, {
    fields: [address.city_id],
    references: [city.id],
  }),
}));

export const menuItemCategoryRelation = relations(menu_item, ({ one }) => ({
  category: one(category, {
    fields: [menu_item.category_id],
    references: [category.id],
  }),
}));

export const menuItemRestaurantRelation = relations(menu_item, ({ one }) => ({
  restaurant: one(restaurant, {
    fields: [menu_item.restaurant_id],
    references: [restaurant.id],
  }),
}));

export const restaurantCityRelation = relations(restaurant, ({ one }) => ({
  city: one(city, {
    fields: [restaurant.city_id],
    references: [city.id],
  }),
}));

export const restaurantOwnerUserRelation = relations(restaurant_owner, ({ one }) => ({
  owner: one(users, {
    fields: [restaurant_owner.owner_id],
    references: [users.id],
  }),
}));

export const restaurantOwnerRestaurantRelation = relations(restaurant_owner, ({ one }) => ({
  restaurant: one(restaurant, {
    fields: [restaurant_owner.restaurant_id],
    references: [restaurant.id],
  }),
}));

export const ordersUserRelation = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.user_id],
    references: [users.id],
  }),
}));

export const ordersDriverRelation = relations(orders, ({ one }) => ({
  driver: one(driver, {
    fields: [orders.driver_id],
    references: [driver.id],
  }),
}));

export const ordersRestaurantRelation = relations(orders, ({ one }) => ({
  restaurant: one(restaurant, {
    fields: [orders.restaurant_id],
    references: [restaurant.id],
  }),
}));

export const ordersDeliveryAddressRelation = relations(orders, ({ one }) => ({
  delivery_address: one(address, {
    fields: [orders.delivery_address_id],
    references: [address.id],
  }),
}));

export const commentOrderRelation = relations(comment, ({ one }) => ({
  order: one(orders, {
    fields: [comment.order_id],
    references: [orders.id],
  }),
}));

export const commentUserRelation = relations(comment, ({ one }) => ({
  user: one(users, {
    fields: [comment.user_id],
    references: [users.id],
  }),
}));

export const orderMenuItemMenuItemRelation = relations(order_menu_item, ({ one }) => ({
  menu_item: one(menu_item, {
    fields: [order_menu_item.menu_item_id],
    references: [menu_item.id],
  }),
}));

export const orderMenuItemOrderRelation = relations(order_menu_item, ({ one }) => ({
  order: one(orders, {
    fields: [order_menu_item.order_id],
    references: [orders.id],
  }),
}));

export const orderStatusOrderRelation = relations(order_status, ({ one }) => ({
  order: one(orders, {
    fields: [order_status.order_id],
    references: [orders.id],
  }),
}));

export const orderStatusStatusCatalogRelation = relations(order_status, ({ one }) => ({
  status_catalog: one(status_catalog, {
    fields: [order_status.status_catalog_id],
    references: [status_catalog.id],
  }),
}));