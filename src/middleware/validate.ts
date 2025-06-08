import { ZodSchema } from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validate = (schema: ZodSchema<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
      return; // <---- Important: return here to stop execution and satisfy TS
    }

    req.body = result.data;
    next();
  };
};

export default validate;
