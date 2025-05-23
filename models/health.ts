import { ServiceError } from "@/errors";
import { query } from "@/infra/database";

async function getDependencies() {
  const dependencies = {
    database: await checkDatabaseHealth(),
    webserver: checkWebServerHealth(),
  };

  return dependencies;
}

async function checkDatabaseHealth() {
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

    return Number.parseInt(activeConnectionsQueryResult.rows[0].count);
  }

  async function getMaxConnections() {
    const t0 = performance.now();
    const maxConnectionsQueryResult = await query(`
      SHOW max_connections;
    `);
    const t1 = performance.now();
    thirdQueryLatencyInMs = t1 - t0;

    return Number.parseInt(maxConnectionsQueryResult.rows[0].max_connections);
  }

  try {
    return {
      status: "HEALTHY",
      postgres_version: await getPostgresVersion(),
      active_connections: await getActiveConnections(),
      max_connections: await getMaxConnections(),
      first_query_duration_in_miliseconds: firstQueryLatencyInMs,
      second_query_duration_in_miliseconds: secondQueryLatencyInMs,
      third_query_duration_in_miliseconds: thirdQueryLatencyInMs,
    };
  } catch (error) {
    if (error instanceof ServiceError) {
      return {
        status: "UNHEALTHY",
      };
    }

    throw error;
  }
}

function checkWebServerHealth() {
  return {
    status: "HEALTHY",
    provider: process.env.VERCEL ? "vercel" : "local",
    environment: process.env.VERCEL_ENV ?? "local",
    last_commit_author: process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN,
    last_commit_message: process.env.VERCEL_GIT_COMMIT_MESSAGE,
    last_commit_message_sha: process.env.VERCEL_GIT_COMMIT_SHA,
  };
}

export default Object.freeze({
  getDependencies,
});
