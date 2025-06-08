import express, { Application, Response } from "express";
import dotenv from "dotenv"
import { logger } from "./middleware/logger";
import { userRouter } from "./users/user.route";
import { stateRouter } from "./state/state.route";
import { cityRouter } from "./city/city.route";
import { authRouter } from "./auth/auth.route";
import { RateLimiterMiddleware } from "./middleware/rateLimiter";
import  statusRouter  from "./status/statusCatalog.route";
import  orderRouter from "./orders/orders.route";














import { driverRouter } from "./driver/driver.route";
import { addressRouter } from "./address/address.route";
 
dotenv.config()
 
const app:Application = express()
 
const PORT = process.env.PORT || 3000
 
 
//Basic MIddleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(logger)
app.use(RateLimiterMiddleware)
 
//default route
app.get('/',(req,res:Response)=>{
    res.send("Welcome to Express API Backend WIth Drizzle ORM and PostgreSQL")
})
 
//import routes
app.use('/api', userRouter);
app.use('/api', stateRouter);
app.use('/api', cityRouter);
app.use("/", orderRouter);
app.use('/api', authRouter);
app.use('/api', statusRouter);
app.use('/api',driverRouter);
app.use('/api',addressRouter);


//Start server
 
app.listen(PORT,()=>{
    console.log(`🚀 Server running on http://localhost:${PORT}`);
})