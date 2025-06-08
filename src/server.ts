// src/server.ts
import express, { Application, Request, Response } from "express"; // Added Request for the default route
import dotenv from "dotenv";
import { logger } from "./middleware/logger"; // Assuming this path is correct
import { RateLimiterMiddleware } from "./middleware/rateLimiter"; // Assuming this path is correct

// Import Routers
import { userRouter } from "./users/user.route"; // Assuming this path is correct
import { authRouter } from "./auth/auth.route"; // Assuming this path is correct
import { stateRouter } from "./state/state.route"; // Assuming this path is correct
import { cityRouter } from "./city/city.route"; // Assuming this path is correct and you have this router
import { restaurantRouter } from "./restaurant/restaurant.route"; // Assuming this path is correct
import orderRouter from "./orders/orders.route"; // Assuming this path is correct
import { menuItemRouter } from "./menu_item/menu_item.route"; // Assuming this path is correct
import { orderMenuItemRouter } from "./order_menu_item/order_menu_item.route"; // Assuming this path is correct
import { statusRouter } from "./status/statusCatalog.route"; // Assuming this path is correct
import { categoryRouter } from "./category/category.route"; // Assuming this path is correct and you have this router
import { addressRouter } from "./address/address.route"; // Assuming this path is correct and you have this router
import { commentRouter } from "./comment/comment.route"; // Assuming this path is correct and you have this router
import { driverRouter } from "./driver/driver.route"; // Assuming this path is correct and you have this router
import { restaurantOwnerRouter } from "./restaurant_owner/restaurant_owner.route"; // Assuming this path is correct

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Basic Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger); // Apply logger to all requests
app.use(RateLimiterMiddleware); // Apply rate limiter to all requests

// Default API Welcome Route
app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({
    message:
      "Welcome to the Express API Backend with Drizzle ORM and PostgreSQL!",
    status: "success",
    data: {
      timestamp: new Date().toISOString(),
    },
  });
});

// Mount Routers under '/api' prefix
app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", stateRouter);
app.use("/api", cityRouter); // Make sure you have cityRouter defined and imported
app.use("/api", restaurantRouter); // Make sure you have restaurantRouter defined and imported
app.use("/api", orderRouter); // This will make order routes like /api/orders
app.use("/api", menuItemRouter);
app.use("/api", orderMenuItemRouter);
app.use("/api", statusRouter);
app.use("/api", categoryRouter); // Make sure you have categoryRouter defined and imported
app.use("/api", addressRouter); // Make sure you have addressRouter defined and imported
app.use("/api", commentRouter); // Make sure you have commentRouter defined and imported
app.use("/api", driverRouter); // Make sure you have driverRouter defined and imported
app.use("/api", restaurantOwnerRouter); // Make sure you have restaurantOwnerRouter defined and imported

// Global Error Handler (Optional but recommended)
// This should be the last middleware
app.use(
  (err: Error, req: Request, res: Response, next: express.NextFunction) => {
    console.error("Global Error Handler:", err.stack);
    res.status(500).json({
      message: "Something went wrong on the server!",
      error: process.env.NODE_ENV === "development" ? err.message : undefined, // Only show error details in dev
    });
  }
);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
});
