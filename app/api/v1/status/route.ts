import { type NextRequest, NextResponse } from "next/server";

import { withErrorHandler } from "infra/controller";
import health from "@/models/health";

async function getHandler(request: NextRequest) {
  const updatedAt = new Date();
  const dependencies = await health.getDependencies();

  return NextResponse.json({
    updated_at: updatedAt.toISOString(),
    dependencies: dependencies,
  });
}

export const GET = withErrorHandler(getHandler);
