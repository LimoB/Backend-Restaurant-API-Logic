import { category, menu_item, restaurant } from "./schema";
import db from "./db";

export async function seed() {
  console.log("🌱 Starting full seed...");

  // Insert a restaurant
  const [restaurantRow] = await db.insert(restaurant).values({
    name: "Demo Diner",
    street_address: "123 Flavor Street",
    zip_code: "12345",
    city_id: 1, // ⚠️ Ensure city with id = 1 exists in your DB
    contact_phone: "123-456-7890",
    contact_email: "demo@example.com",
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  }).returning();

  const restaurantId = restaurantRow.id;

  // Insert a category
  const [cat1] = await db.insert(category).values([{ name: "Main Dishes" }]).returning();

  // Products to seed
  const products = [
    {
      name: "Creamy Pasta",
      price: "8.99",
      image_url: "https://images.unsplash.com/photo-1589308078053-f3a37c92e2b4",
      desc: "Delicious cheesy pasta with herbs.",
    },
    {
      name: "Chicken Nuggets",
      price: "6.5",
      image_url: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f",
      desc: "Crispy, juicy bites loved by all ages.",
    },
    {
      name: "Veggie Eggs",
      price: "7.25",
      image_url: "https://images.unsplash.com/photo-1625944064000-745f9bcd1543",
      desc: "Healthy mix of vegetables and eggs.",
    },
    {
      name: "Classic Burger",
      price: "9.75",
      image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349",
      desc: "Grilled beef patty with lettuce and cheese.",
    },
    {
      name: "Salmon Sushi",
      price: "12.0",
      image_url: "https://images.unsplash.com/photo-1581404917879-49a2a57a2c00",
      desc: "Fresh sushi rolls with premium salmon.",
    },
    {
      name: "Pepperoni Pizza",
      price: "11.5",
      image_url: "https://images.unsplash.com/photo-1594007654729-407eedc4be1f",
      desc: "Thin crust pizza loaded with pepperoni.",
    },
    {
      name: "French Fries",
      price: "4.5",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      desc: "Golden and crispy fries with ketchup.",
    },
    {
      name: "Caesar Salad",
      price: "6.75",
      image_url: "https://images.unsplash.com/photo-1606788075761-1a53a0be0f27",
      desc: "Fresh greens with creamy Caesar dressing.",
    },
    {
      name: "Grilled Steak",
      price: "14.99",
      image_url: "https://images.unsplash.com/photo-1604908176896-1d0653f9aa37",
      desc: "Juicy grilled steak with a smoky finish.",
    },
  ];

  // Insert menu items
  for (const product of products) {
    console.log(`🍽 Seeding: ${product.name}`);
    await db.insert(menu_item).values({
      category_id: cat1.id,
      restaurant_id: restaurantId,
      name: product.name,
      ingredients: product.desc,
      price: product.price,
      image_url: product.image_url,
    });
  }

  console.log("✅ All menu items seeded successfully.");
}

// Call the seed function
seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
});
