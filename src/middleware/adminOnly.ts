// src/middleware/adminOnly.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized access. No token." });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET not set");

        const decoded = jwt.verify(token, secret) as any;

        if (decoded.user_type !== "admin") {
            res.status(403).json({ error: "Access denied. Admins only." });
            return;
        }

        // Optionally attach user info to req for downstream handlers
        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token." });
    }
};
