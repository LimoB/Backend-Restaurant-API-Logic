import db from './db'; // adjust to your actual path
import { users } from '../drizzle/schema'; // adjust to your actual schema path

const seed = async () => {
  console.log("Seeding users...");

  await db.insert(users).values([
    {
      name: "John Doe",
      contact_phone: "0712345678",
      phone_verified: true,
      email: "john@example.com",
      email_verified: true,
      password: "hashedpassword1",
      verification_code: "abc123",
      user_type: "member",
      address_id: 1, // replace with actual existing address_id or null if not needed
    },
    {
      name: "Jane Mwangi",
      contact_phone: "0722123456",
      phone_verified: true,
      email: "jane@example.com",
      email_verified: true,
      password: "hashedpassword2",
      verification_code: "xyz456",
      user_type: "admin",
      address_id: 2, // replace with actual existing address_id or null
    },
  ]);

  console.log("✅ Users seeded successfully!");
};

seed().catch((e) => {
  console.error("❌ Seeding users failed:", e);
});
