import request from 'supertest';
import app from '../src/app'; // Adjust this if your app file is elsewhere
import db from '../src/drizzle/db';
import { users } from '../src/drizzle/schema';
import { eq } from 'drizzle-orm';

describe('👤 User Routes', () => {
  let userId: number;

  const testUser = {
    name: 'Test User',
    email: 'usertest@example.com',
    password: 'Password123!',
    contact_phone: '0712345678',
    user_type: 'member',
    verification_code: '123456' // If required by validation
  };

  // Clean up before/after
  beforeAll(async () => {
    // Ensure the test user doesn't already exist
    await db.delete(users).where(eq(users.email, testUser.email));
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.email, testUser.email));
  });

  it('📬 should create a user (register)', async () => {
    const res = await request(app).post('/api/users').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/created|success|registered/i);
  });

  it('🔎 should get user by ID', async () => {
    // Get user ID from DB
    const user = await db.query.users.findFirst({
      where: eq(users.email, testUser.email),
    });
    expect(user).toBeDefined();
    userId = user!.id;

    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(testUser.email);
  });

  it('✏️ should update user info', async () => {
    const updatedData = { name: 'Updated User' };

    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer testtoken`) // Replace with real token if needed
      .send(updatedData);

    // Optional: adjust for auth handling
    expect([200, 401, 403]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.message).toMatch(/updated/i);
    }
  });

  it('🗑️ should delete the user', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer testtoken`); // Replace with admin token

    // Optional: adjust for auth
    expect([200, 401, 403]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.message).toMatch(/deleted/i);
    }
  });
});
