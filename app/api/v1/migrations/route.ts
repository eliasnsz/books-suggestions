import { getDatabaseClient } from "infra/database";
import { NextResponse } from "next/server";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import { Client as PgClient } from "pg";

const defaultMigratorOptions = {
  dryRun: true,
  direction: "up" as const,
  migrationsTable: "pgmigrations",
  dir: resolve("infra", "migrations"),
};

export async function GET() {
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

export async function POST() {
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
