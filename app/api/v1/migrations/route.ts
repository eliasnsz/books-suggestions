import { createEdgeRouter } from "next-connect";
import { type NextRequest, NextResponse } from "next/server";

import migrator from "models/migrator";

const router = createEdgeRouter<NextRequest, { params?: unknown }>();

router.get(getHandler).post(postHandler);

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

async function handler(request: NextRequest, ctx: { params?: unknown }) {
  return router.run(request, ctx) as Promise<NextResponse<unknown>>;
}

export { handler as GET, handler as POST };
