// app.ts
import express, { Application, Request, Response } from "express";
// import dotenv from "dotenv";
import cors from "cors"; // ✅ Add this line
import { logger } from "./middleware/logger";
import { RateLimiterMiddleware } from "./middleware/rateLimiter";

// Import Routers
import { userRouter } from "./users/user.route";
import { authRouter } from "./auth/auth.route";
import { stateRouter } from "./state/state.route";
import { cityRouter } from "./city/city.route";
import { statusRouter } from "./status/statusCatalog.route";
import orderRouter from "./orders/orders.route";
import { driverRouter } from "./driver/driver.route";
import { restaurantRouter } from "./restaurant/restaurant.route";
import { orderMenuItemRouter } from "./order_menu_item/order_menu_item.route";
import { menuItemRouter } from "./menu_item/menu_item.route";
import { categoryRouter } from "./category/category.route";
import { commentRouter } from "./comment/comment.route";
import inviteRoutes from "./auth/invite.route";



const app: Application = express();

// ✅ CORS Middleware (must come before routes)
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend origin
  credentials: true, // Allow cookies or headers if needed
}));

// Basic Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(RateLimiterMiddleware);

// Default route
app.get("/", (req, res: Response) => {
  res.send("Welcome to Express API Backend With Drizzle ORM and PostgreSQL");
});

// Routes
app.use("/api", userRouter);
app.use("/api", stateRouter);
app.use("/api", cityRouter);
app.use("/api", orderRouter);
app.use("/api", authRouter);
app.use("/api", statusRouter);
app.use("/api", driverRouter);
app.use("/api", restaurantRouter);
app.use("/api", orderMenuItemRouter);
app.use("/api", menuItemRouter);
app.use("/api", categoryRouter);
app.use("/api", commentRouter);
app.use("/api", inviteRoutes);

export default app;
