import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      email: string;
      user_type: "member" | "admin" | "driver" | "owner";
      // add other fields as needed
    };
  }
}
