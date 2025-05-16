import { type NextRequest, NextResponse } from "next/server";

import authentication from "@/models/authentication";
import { withErrorHandler } from "infra/controller";
import migrator from "models/migrator";

async function getHandler(request: NextRequest) {
  await authentication.getAuthenticatedUserFromRequest(request);

  const pendingMigrations = await migrator.getPendingMigrations();
  return NextResponse.json(pendingMigrations, { status: 200 });
}

async function postHandler(request: NextRequest) {
  await authentication.getAuthenticatedUserFromRequest(request);

  const migratedMigrations = await migrator.runPendingMigrations();

  let status = 200;

  if (migratedMigrations.length > 0) {
    status = 201;
  }

  return NextResponse.json(migratedMigrations, { status });
}

export const GET = withErrorHandler(getHandler);
export const POST = withErrorHandler(postHandler);
