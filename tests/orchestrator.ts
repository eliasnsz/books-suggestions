import { query } from "infra/database";
import retry from "async-retry";

async function cleanDatabase() {
  await query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    await retry(fetchStatusPage, {
      maxTimeout: 1000 * 1, // one second
      retries: 100,
      onRetry: (_err, attempt) => {
        console.log(
          `⚠️\s Não foi possível se conectar ao Webserver. Tentando novamente... (${attempt}/100)`,
        );
      },
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw new Error();
      }
    }
  }
}

export default Object.freeze({
  cleanDatabase,
  waitForAllServices,
});
