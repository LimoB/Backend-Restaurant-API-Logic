import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextFunction, Request, Response } from "express";

// Create a rate limiter instance
const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per 60 seconds
});

// Express middleware
export const RateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await rateLimiter.consume(req.ip || 'unknown');
    console.log(`Rate limit check passed for IP: ${req.ip}`);
    next();
  } catch (error) {
    res.status(429).json({ error: "Too many requests, Please try again later." });
  }
};
