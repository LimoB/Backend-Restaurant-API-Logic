import request from "supertest";
import app from "../app";
import db from "../drizzle/db";
import { users, unverified_users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Increase Jest timeout globally for this test suite
jest.setTimeout(15000); // 15 seconds

describe("🔐 Auth Flow", () => {
  const testUser = {
    name: "Boaz Test",
    email: "boaz@example.com",
    password: "Secure123!",
    contact_phone: "0712345678",
    user_type: "member",
  };

  // Clean both tables before each test to avoid data interference
  beforeEach(async () => {
    await db.delete(users).where(eq(users.email, testUser.email));
    await db.delete(unverified_users).where(eq(unverified_users.email, testUser.email));
  });

  it("0️⃣ Register endpoint exists", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.status).not.toBe(404);
  });

  it("1️⃣ Registers a new user and stores verification code", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    console.log("🧪 Register Response:", res.body);

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/verification/i);

    const [createdUser] = await db
      .select()
      .from(unverified_users)
      .where(eq(unverified_users.email, testUser.email));

    expect(createdUser).toBeDefined();
    expect(createdUser.verification_code).toBeTruthy();
  });

  it("2️⃣ Fails to login before verification", async () => {
    await request(app).post("/api/auth/register").send(testUser);

    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    console.log("Login before verification:", res.status, res.body);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/verify/i);
  });

  it("3️⃣ Verifies the user successfully", async () => {
    await request(app).post("/api/auth/register").send(testUser);

    const [unverifiedUser] = await db
      .select()
      .from(unverified_users)
      .where(eq(unverified_users.email, testUser.email));

    expect(unverifiedUser).toBeDefined();

    const res = await request(app).post("/api/auth/verify-email").send({
      email: testUser.email,
      code: unverifiedUser.verification_code!,
    });

    console.log("Verify email response:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/success/i);
    expect(res.body.user.email).toBe(testUser.email);

    const [verifiedUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, testUser.email));

    expect(verifiedUser).toBeDefined();
    expect(verifiedUser.email_verified).toBe(true);
  });

  it("4️⃣ Logs in successfully after verification", async () => {
    await request(app).post("/api/auth/register").send(testUser);

    const [unverifiedUser] = await db
      .select()
      .from(unverified_users)
      .where(eq(unverified_users.email, testUser.email));

    await request(app).post("/api/auth/verify-email").send({
      email: testUser.email,
      code: unverifiedUser.verification_code!,
    });

    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    console.log("Login after verification:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  // Clean up DB after all tests
  afterAll(async () => {
    await db.delete(users).where(eq(users.email, testUser.email));
    await db.delete(unverified_users).where(eq(unverified_users.email, testUser.email));
    // Uncomment if manual DB connection close needed
    // await db.$client.end?.();
  });
});

/**
 * Note: 
 * - Run tests serially to avoid race conditions with DB cleanup:
 *    jest --runInBand
 */
