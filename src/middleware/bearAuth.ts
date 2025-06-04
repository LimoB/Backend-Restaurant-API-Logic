import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

type DecodedToken = {
  id: number;          // user id from token
  email: string;
  role: "admin" | "member" | string;  // adjust roles accordingly
  exp?: number;
};

// Verify JWT token function
export const verifyToken = async (token: string, secret: string): Promise<DecodedToken | null> => {
  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
};

// Authorization middleware
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
  requiredRole: "admin" | "member" | "both"
) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    res.status(401).json({ error: "Authorization header is missing" });
    return;
  }

  // Expect header like "Bearer <token>"
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  const decodedToken = await verifyToken(token, process.env.JWT_SECRET as string);

  if (!decodedToken) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  const { role } = decodedToken;

  if (requiredRole === "both") {
    if (role === "admin" || role === "member") {
      req.user = decodedToken;
      next();
      return;
    }
  } else if (role === requiredRole) {
    req.user = decodedToken;
    next();
    return;
  }

  res.status(403).json({ error: "Forbidden: You do not have permission to access this resource" });
};

// Role-based middleware exports
export const adminRoleAuth = (req: Request, res: Response, next: NextFunction) =>
  authMiddleware(req, res, next, "admin");

export const userRoleAuth = (req: Request, res: Response, next: NextFunction) =>
  authMiddleware(req, res, next, "member");

export const bothRolesAuth = (req: Request, res: Response, next: NextFunction) =>
  authMiddleware(req, res, next, "both");
