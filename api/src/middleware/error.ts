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
  if (hasMongoCode(error, 11000)) {
    res.status(409).json({
      message:
        "You have already registered for this distance with these details. Check your email for your registration ID, or contact us.",
    });
    return;
  }

  // The database went away after the server started. The request is fine and
  // retrying will work, so this is a 503 rather than a 500: it tells a runner
  // "come back in a moment", not "we broke".
  if (isDatabaseUnavailable(error)) {
    console.error("[api] database unavailable:", error);
    res.status(503).json({
      message:
        "We could not reach our servers just now. Nothing was submitted — please try again in a minute.",
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

function hasMongoCode(error: unknown, code: number): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === code
  );
}

/**
 * Mongoose surfaces a dead connection in a few shapes: a buffering timeout, a
 * "connection closed" error, or a server selection failure. All of them mean the
 * same thing to the runner, and all of them are retryable.
 */
function isDatabaseUnavailable(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;

  const candidate = error as { name?: string; message?: string };
  const name = candidate.name ?? "";
  const message = candidate.message ?? "";

  return (
    name === "MongooseError" ||
    name === "MongoNetworkError" ||
    name === "MongoServerSelectionError" ||
    name === "MongoNotConnectedError" ||
    /buffering timed out|connection (?:closed|0)|topology (?:was destroyed|is closed)|server selection/i.test(
      message,
    )
  );
}
