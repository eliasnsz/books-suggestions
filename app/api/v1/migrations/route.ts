import { NextResponse } from "next/server";

import migrator from "models/migrator";
import { withErrorHandler } from "infra/controller";

async function getHandler() {
  const pendingMigrations = await migrator.getPendingMigrations();
  return NextResponse.json(pendingMigrations, { status: 200 });
}

async function postHandler() {
  const migratedMigrations = await migrator.runPendingMigrations();

  let status = 200;

  if (migratedMigrations.length > 0) {
    status = 201;
  }

  return NextResponse.json(migratedMigrations, { status });
}

export const GET = withErrorHandler(getHandler);
export const POST = withErrorHandler(postHandler);
