import { BaseError, InternalServerError } from "errors";
import { NextResponse } from "next/server";

type Handler = (req: Request, ctx?: any) => Promise<NextResponse>;

export function withErrorHandler(handler: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      console.error(error);

      if (error instanceof BaseError) {
        return NextResponse.json(error.toJSON(), { status: error.statusCode });
      }

      const internalServerError = new InternalServerError(error);

      return NextResponse.json(internalServerError.toJSON(), {
        status: internalServerError.statusCode,
      });
    }
  };
}
