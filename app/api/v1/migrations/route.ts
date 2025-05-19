import { type NextRequest, NextResponse } from "next/server";

import {
  withAuthentication,
  withAuthorization,
  withErrorHandler,
} from "infra/controller";
import migrator from "models/migrator";

async function getHandler(request: NextRequest, context) {
  const pendingMigrations = await migrator.getPendingMigrations();
  return NextResponse.json(pendingMigrations, { status: 200 });
}

async function postHandler(request: NextRequest) {
  const migratedMigrations = await migrator.runPendingMigrations();

  let status = 200;

  if (migratedMigrations.length > 0) {
    status = 201;
  }

  return NextResponse.json(migratedMigrations, { status });
}

export const GET = withErrorHandler(
  withAuthentication(withAuthorization(getHandler, "read:migrations")),
);
export const POST = withErrorHandler(
  withAuthentication(withAuthorization(postHandler, "create:migrations")),
);
