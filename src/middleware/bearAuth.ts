import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

type UserType = "admin" | "member" | "driver" | "owner" | string;

type DecodedToken = {
  userId: string;
  email: string;
  user_type: UserType;
  exp?: number;
};

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

export const verifyToken = (
  token: string,
  secret: string
): DecodedToken | null => {
  try {
    return jwt.verify(token, secret) as DecodedToken;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

// ✅ Improved factory: accepts one role or multiple
const authMiddlewareFactory = (allowedRoles: UserType | UserType[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      res.status(401).json({ error: "Authorization header is missing" });
      return;
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const decodedToken = verifyToken(token, process.env.JWT_SECRET as string);

    if (!decodedToken) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const { user_type } = decodedToken;

    const allowedArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const hasAccess = allowedArray.includes(user_type);

    if (!hasAccess) {
      res.status(403).json({
        error: "Forbidden: You do not have permission to access this resource",
      });
      return;
    }

    req.user = decodedToken;
    next();
  };
};

// ✅ Usage
export const adminRoleAuth = authMiddlewareFactory("admin");
export const userRoleAuth = authMiddlewareFactory("member");
export const driverRoleAuth = authMiddlewareFactory("driver");
export const ownerRoleAuth = authMiddlewareFactory("owner");
export const adminOrMemberAuth = authMiddlewareFactory(["admin", "member"]);
export const allRolesAuth = authMiddlewareFactory(["admin", "member", "driver", "owner"]);
