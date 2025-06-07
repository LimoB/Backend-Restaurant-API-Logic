import db from "./db"; // your Drizzle db instance
import {
  state,
  city,
  address,
  users,
  restaurant,
  category,
  menu_item,
  driver,
  orders,
  comment,
  order_menu_item,
  restaurant_owner,
  status_catalog,
  order_status,
} from "./schema";

export async function seed() {
  // Insert states
  const [california] = await db
    .insert(state)
    .values([{ name: "California", code: "CA" }])
    .returning();

  const [texas] = await db
    .insert(state)
    .values([{ name: "Texas", code: "TX" }])
    .returning();

  // Insert cities
  const [losAngeles] = await db
    .insert(city)
    .values([{ name: "Los Angeles", state_id: california.id, address: "City Hall" }])
    .returning();

  const [houston] = await db
    .insert(city)
    .values([{ name: "Houston", state_id: texas.id, address: "Downtown",  }])
    .returning();

  // Insert addresses
  const [addr1] = await db
    .insert(address)
    .values([
      {
        street_address_1: "123 Main St",
        zip_code: "90001",
        city_id: losAngeles.id,
        delivery_instructions: "Leave at door",
      },
    ])
    .returning();

  const [addr2] = await db
    .insert(address)
    .values([
      {
        street_address_1: "456 Elm St",
        zip_code: "77001",
        city_id: houston.id,
      },
    ])
    .returning();

  // Insert users
  const [user1] = await db
    .insert(users)
    .values([
      {
        name: "Alice Johnson",
        contact_phone: "123-456-7890",
        phone_verified: true,
        email: "alice@example.com",
        email_verified: true,
        password: "hashedpassword1",
        user_type: "member",
        address_id: addr1.id,
      },
    ])
    .returning();

  const [user2] = await db
    .insert(users)
    .values([
      {
        name: "Bob Smith",
        contact_phone: "987-654-3210",
        phone_verified: true,
        email: "bob@example.com",
        email_verified: true,
        password: "hashedpassword2",
        user_type: "owner",
        address_id: addr2.id,
      },
    ])
    .returning();

  // Insert restaurant
  const [rest1] = await db
    .insert(restaurant)
    .values([
      {
        name: "Good Eats",
        street_address: "789 Food Blvd",
        zip_code: "90002",
        city_id: losAngeles.id,
        contact_phone: "111-222-3333",
        contact_email: "contact@goodeats.com",
      },
    ])
    .returning();

  // Link restaurant owner
  await db.insert(restaurant_owner).values([
    {
      restaurant_id: rest1.id,
      owner_id: user2.id,
    },
  ]);

  // Insert categories
  const [cat1] = await db.insert(category).values([{ name: "Burgers" }]).returning();
  const [cat2] = await db.insert(category).values([{ name: "Drinks" }]).returning();

  // Insert menu items (price as strings)
  const [menu1] = await db.insert(menu_item).values([
    {
      category_id: cat1.id,
      restaurant_id: rest1.id,
      name: "Classic Burger",
      ingredients: "Beef patty, lettuce, tomato, cheese",
      price: "8.99",
    },
  ]).returning();

  const [menu2] = await db.insert(menu_item).values([
    {
      category_id: cat2.id,
      restaurant_id: rest1.id,
      name: "Cola",
      ingredients: "Carbonated water, sugar",
      price: "1.99",
    },
  ]).returning();

  // Insert driver (linked to user)
  const [drv1] = await db
    .insert(driver)
    .values([
      {
        user_id: user1.id,
        car_make: "Toyota",
        car_model: "Camry",
        car_year: "2020",
        license_plate: "XYZ123",
        active: true,
      },
    ])
    .returning();

  // Insert an order (price fields as strings)
  const [order1] = await db.insert(orders).values([
    {
      restaurant_id: rest1.id,
      delivery_address_id: addr1.id,
      user_id: user1.id,
      driver_id: drv1.id,
      price: "10.98",
      discount: "0",
      final_price: "10.98",
      comment: "Please be quick!",
      status: "pending",
    },
  ]).returning();

  // Insert order menu items
  await db.insert(order_menu_item).values([
    {
      order_id: order1.id,
      menu_item_id: menu1.id,
      quantity: 1,
      item_name: menu1.name,
      price: menu1.price,
    },
    {
      order_id: order1.id,
      menu_item_id: menu2.id,
      quantity: 1,
      item_name: menu2.name,
      price: menu2.price,
    },
  ]);

  // Insert comments
  await db.insert(comment).values([
    {
      order_id: order1.id,
      user_id: user1.id,
      comment_text: "Great service!",
      comment_type: "praise",
      rating: 5,
    },
  ]);

  // Insert status catalog entries
  const statuses = ["pending", "accepted", "rejected", "delivered"];
  const statusCatalogIds: number[] = [];
  for (const name of statuses) {
    const [statusRow] = await db.insert(status_catalog).values([{ name }]).returning();
    statusCatalogIds.push(statusRow.id);
  }

  // Insert order statuses
  await db.insert(order_status).values([
    {
      order_id: order1.id,
      status_catalog_id: statusCatalogIds[0], // pending
    },
  ]);

  console.log("Seeding complete!");
}

async function main() {
  try {
    await seed();
  } catch (e) {
    console.error("Seed failed:", e);
  } finally {
    // Type guard to safely close DB connection if possible
    if (
      db &&
      typeof db === "object" &&
      "client" in db &&
      db.client &&
      typeof (db.client as any).end === "function"
    ) {
      await (db.client as any).end();
    }
    process.exit(0);
  }
}


main();
