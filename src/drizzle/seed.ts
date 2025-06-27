import { category, menu_item, restaurant } from "./schema";
import db from "./db";

export async function seed() {
  console.log("🌱 Starting seed...");

  // ✅ Clean existing data first
  await db.delete(menu_item);
  await db.delete(category);
  await db.delete(restaurant);

  // ✅ Insert restaurant
  const [restaurantRow] = await db.insert(restaurant).values({
    name: "Demo Diner",
    street_address: "123 Flavor Street",
    zip_code: "12345",
    city_id: 1, // ✅ Ensure city_id 1 exists in your cities table
    contact_phone: "123-456-7890",
    contact_email: "demo@example.com",
    image_url: "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
  }).returning();

  const restaurantId = restaurantRow.id;

  // ✅ Insert category
  const [mainCategory] = await db.insert(category).values({
    name: "Main Dishes",
  }).returning();

  const categoryId = mainCategory.id;

  // ✅ Menu Items to Seed
  const products = [
    {
      name: "Creamy Pasta",
      price: "8.99",
      image_url: "https://cdn.pixabay.com/photo/2017/05/07/08/56/pasta-2290813_1280.jpg",
      ingredients: "Delicious cheesy pasta with herbs.",
    },
    {
      name: "Chicken Nuggets",
      price: "6.50",
      image_url: "https://cdn.pixabay.com/photo/2018/06/18/16/05/fried-chicken-3481662_1280.jpg",
      ingredients: "Crispy, juicy bites loved by all ages.",
    },
    {
      name: "Veggie Omelette",
      price: "7.25",
      image_url: "https://cdn.pixabay.com/photo/2017/02/23/13/05/omelet-2096510_1280.jpg",
      ingredients: "Healthy mix of vegetables and eggs.",
    },
    {
      name: "Classic Burger",
      price: "9.75",
      image_url: "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
      ingredients: "Grilled beef patty with lettuce and cheese.",
    },
    {
      name: "Salmon Sushi",
      price: "12.00",
      image_url: "https://cdn.pixabay.com/photo/2022/11/04/21/50/sushi-7569806_1280.jpg",
      ingredients: "Fresh sushi rolls with premium salmon.",
    },
    {
      name: "Pepperoni Pizza",
      price: "11.50",
      image_url: "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
      ingredients: "Thin crust pizza loaded with pepperoni.",
    },
    {
      name: "French Fries",
      price: "4.50",
      image_url: "https://cdn.pixabay.com/photo/2017/04/23/20/36/fries-2258385_1280.jpg",
      ingredients: "Golden and crispy fries with ketchup.",
    },
    {
      name: "Caesar Salad",
      price: "6.75",
      image_url: "https://cdn.pixabay.com/photo/2018/08/30/10/41/salad-3648727_1280.jpg",
      ingredients: "Fresh greens with creamy Caesar dressing.",
    },
    {
      name: "Grilled Steak",
      price: "14.99",
      image_url: "https://cdn.pixabay.com/photo/2017/05/07/08/56/steak-2290812_1280.jpg",
      ingredients: "Juicy grilled steak with a smoky finish.",
    },
  ];

  // ✅ Insert menu items
  for (const product of products) {
    console.log(`🍽 Seeding: ${product.name} — ${product.ingredients}`);
    await db.insert(menu_item).values({
      name: product.name,
      price: product.price, // stored as string for decimal
      image_url: product.image_url,
      ingredients: product.ingredients,
      category_id: categoryId,
      restaurant_id: restaurantId,
    });
  }

  console.log("✅ Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
