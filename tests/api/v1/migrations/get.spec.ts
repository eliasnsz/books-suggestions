import { query } from "infra/database";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

describe("GET api/v1/migrations", async () => {
  describe("Anonymous User", () => {
    test("Retrieving pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.length).toBeGreaterThan(0);
      expect(Array.isArray(responseBody)).toBe(true);
    });
  });
});
