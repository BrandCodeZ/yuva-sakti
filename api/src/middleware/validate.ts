import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { toFieldErrors } from "../validators/schemas.js";

/**
 * Wraps an async handler so a rejected promise reaches the error middleware
 * instead of hanging the request. Express 5 does this for us, but being explicit
 * keeps the intent obvious at each route.
 */
export function asyncHandler<T extends Request = Request>(
  handler: (req: T, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req as T, res, next).catch(next);
  };
}

export function validateBody<T>(schema: {
  safeParse: (data: unknown) =>
    | { success: true; data: T }
    | { success: false; error: ZodError };
}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Please check the highlighted fields and try again.",
        errors: toFieldErrors(result.error),
      });
      return;
    }

    // Replace the raw body with the parsed, coerced and stripped value.
    res.locals.body = result.data;
    next();
  };
}

export function parsedBody<T>(res: Response): T {
  return res.locals.body as T;
}

export function clientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() ?? "";
  }
  return req.ip ?? "";
}
