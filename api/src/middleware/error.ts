import type { NextFunction, Request, Response } from "express";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly errors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Never leak a stack trace or a database message to the browser. */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof ApiError) {
    res.status(error.status).json({
      message: error.message,
      ...(error.errors ? { errors: error.errors } : {}),
    });
    return;
  }

  // A duplicate key means the runner has already registered. That is not a 500.
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    res.status(409).json({
      message:
        "You have already registered for this distance with these details. Check your email for your registration ID, or contact us.",
    });
    return;
  }

  console.error("[api] unhandled error:", error);

  res.status(500).json({
    message:
      "Something went wrong on our side. Please try again, and if it keeps happening email us.",
  });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ message: "Not found." });
}
