import authentication from "@/models/authentication";
import authorization from "@/models/authorization";
import { BaseError, InternalServerError } from "errors";
import { type NextRequest, NextResponse } from "next/server";

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

export function withAuthentication(handler: Handler): Handler {
  return async (request: NextRequest, context) => {
    const user = await authentication.getAuthenticatedUserFromRequest(request);

    context.user = user;

    return await handler(request, context);
  };
}

export function withAuthorization(handler: Handler, feature: string): Handler {
  return async (request: NextRequest, context) => {
    const userTryingToRequest = context.user;

    authorization.canRequest(userTryingToRequest, feature);

    return await handler(request, context);
  };
}
