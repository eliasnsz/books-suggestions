import { query } from "infra/database";
import { NextResponse } from "next/server";

export async function GET() {
  let firstQueryLatencyInMs: number;
  let secondQueryLatencyInMs: number;
  let thirdQueryLatencyInMs: number;

  async function getPostgresVersion() {
    const t0 = performance.now();
    const postgresVersionQueryResult = await query("SHOW server_version;");
    const t1 = performance.now();
    firstQueryLatencyInMs = t1 - t0;

    return postgresVersionQueryResult.rows[0].server_version;
  }

  async function getActiveConnections() {
    const t0 = performance.now();
    const activeConnectionsQueryResult = await query({
      text: `
        SELECT COUNT(*) 
        FROM pg_stat_activity 
        WHERE datname = $1;
      `,
      values: [process.env.POSTGRES_DB],
    });
    const t1 = performance.now();
    secondQueryLatencyInMs = t1 - t0;

    return parseInt(activeConnectionsQueryResult.rows[0].count);
  }

  async function getMaxConnections() {
    const t0 = performance.now();
    const maxConnectionsQueryResult = await query(`
      SHOW max_connections;
    `);
    const t1 = performance.now();
    thirdQueryLatencyInMs = t1 - t0;

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
          first_query_duration_in_miliseconds: firstQueryLatencyInMs,
          second_query_duration_in_miliseconds: secondQueryLatencyInMs,
          third_query_duration_in_miliseconds: thirdQueryLatencyInMs,
        },
      },
    },
    { status: 200 },
  );
}
