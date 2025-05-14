import { resolve } from "node:path";
import migrationRunner from "node-pg-migrate";
import type { Client as PgClient } from "pg";
import { createEdgeRouter } from "next-connect";
import { type NextRequest, NextResponse } from "next/server";

import { getDatabaseClient } from "infra/database";

const defaultMigratorOptions = {
  dryRun: true,
  direction: "up" as const,
  migrationsTable: "pgmigrations",
  dir: resolve("infra", "migrations"),
};

const router = createEdgeRouter<NextRequest, { params?: unknown }>();

router.get(getHandler).post(postHandler);

async function getHandler() {
  let dbClient: PgClient;

  try {
    dbClient = await getDatabaseClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigratorOptions,
      dbClient: dbClient,
    });

    return NextResponse.json(pendingMigrations, { status: 200 });
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

async function postHandler() {
  let dbClient: PgClient;

  try {
    dbClient = await getDatabaseClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigratorOptions,
      dryRun: false,
      dbClient: dbClient,
    });

    let status = 200;

    if (migratedMigrations.length > 0) {
      status = 201;
    }

    return NextResponse.json(migratedMigrations, { status });
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

async function handler(request: NextRequest, ctx: { params?: unknown }) {
  return router.run(request, ctx) as Promise<NextResponse<unknown>>;
}

export { handler as GET, handler as POST };
