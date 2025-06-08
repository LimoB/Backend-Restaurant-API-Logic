import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
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

dotenv.config();

const app: Application = express();

const PORT = process.env.PORT || 3000;

//Basic MIddleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(RateLimiterMiddleware);

//default route
app.get("/", (req, res: Response) => {
  res.send("Welcome to Express API Backend WIth Drizzle ORM and PostgreSQL");
});

//import routes
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

//Start server

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
