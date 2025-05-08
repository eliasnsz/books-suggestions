import { Client, QueryConfig, Submittable } from "pg";

export async function query(
  queryTextOrConfig: string | QueryConfig<any[]>,
  values?: any[],
) {
  let client: Client;

  try {
    client = await getDatabaseClient();
    return await client.query(queryTextOrConfig);
  } catch (error) {
    console.error("Database Error: ", JSON.stringify(error));
  } finally {
    await client.end();
  }
}

export async function getDatabaseClient() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    ssl: getSSLValue(),
  });

  await client.connect();

  return client;
}

function getSSLValue() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}
