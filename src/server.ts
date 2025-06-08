import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { logger } from "./middleware/logger";
import { RateLimiterMiddleware } from "./middleware/rateLimiter";

// Import Routers
import { userRouter } from "./users/user.route";
import { authRouter } from "./auth/auth.route";
import { stateRouter } from "./state/state.route";
import { cityRouter } from "./city/city.route";
import { restaurantRouter } from "./restaurant/restaurant.route";
import orderRouter from "./orders/orders.route";
import { menuItemRouter } from "./menu_item/menu_item.route";
import { orderMenuItemRouter } from "./order_menu_item/order_menu_item.route";
import { statusRouter } from "./status/statusCatalog.route";
import { categoryRouter } from "./category/category.route";
import { addressRouter } from "./address/address.route";
import { commentRouter } from "./comment/comment.route";
import { driverRouter } from "./driver/driver.route";
import { restaurantOwnerRouter } from "./restaurantOwner/restaurantOwner.route";

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
app.use("/api", cityRouter);
app.use("/api", restaurantRouter);
app.use("/api", orderRouter);
app.use("/api", menuItemRouter);
app.use("/api", orderMenuItemRouter);
app.use("/api", statusRouter);
app.use("/api", categoryRouter);
app.use("/api", addressRouter);
app.use("/api", commentRouter);
app.use("/api", driverRouter);
app.use("/api", restaurantOwnerRouter);

// Global Error Handler (Optional but recommended)
// This should be the last middleware
app.use(
  (err: Error, req: Request, res: Response, next: express.NextFunction) => {
    console.error("Global Error Handler:", err.stack);
    res.status(500).json({
      message: "Something went wrong on the server!",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
});
