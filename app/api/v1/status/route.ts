import { query } from "infra/database";
import { NextResponse } from "next/server";

export async function GET() {
  async function getPostgresVersion() {
    const postgresVersionQueryResult = await query("SHOW server_version;");
    return postgresVersionQueryResult.rows[0].server_version;
  }

  async function getActiveConnections() {
    const activeConnectionsQueryResult = await query({
      text: `
        SELECT COUNT(*) 
        FROM pg_stat_activity 
        WHERE datname = $1;
      `,
      values: [process.env.POSTGRES_DB],
    });

    return parseInt(activeConnectionsQueryResult.rows[0].count);
  }

  async function getMaxConnections() {
    const maxConnectionsQueryResult = await query(`
      SHOW max_connections;
    `);
    return parseInt(maxConnectionsQueryResult.rows[0].max_connections);
  }

  return NextResponse.json(
    {
      status: "HEALTHY",
      updated_at: new Date().toISOString(),
      dependencies: {
        database: {
          postgres_version: await getPostgresVersion(),
          active_connections: await getActiveConnections(),
          max_connections: await getMaxConnections(),
        },
      },
    },
    { status: 200 },
  );
}
