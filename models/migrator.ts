import type { Client as PgClient } from "pg";
import { resolve } from "node:path";
import migrationRunner from "node-pg-migrate";

import { getDatabaseClient } from "infra/database";

const defaultMigratorOptions = {
  dryRun: true,
  direction: "up" as const,
  migrationsTable: "pgmigrations",
  dir: resolve("infra", "migrations"),
};

async function getPendingMigrations() {
  let dbClient: PgClient;

  try {
    dbClient = await getDatabaseClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigratorOptions,
      dbClient: dbClient,
    });

    return pendingMigrations;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

async function runPendingMigrations() {
  let dbClient: PgClient;

  try {
    dbClient = await getDatabaseClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigratorOptions,
      dryRun: false,
      dbClient: dbClient,
    });

    return migratedMigrations;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

export default Object.freeze({
  getPendingMigrations,
  runPendingMigrations,
});
