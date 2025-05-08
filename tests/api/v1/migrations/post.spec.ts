import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
});

describe("POST api/v1/migrations", async () => {
  describe("Anonymous User", () => {
    test("Trying run pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
      });
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.length).toBeGreaterThan(0);
      expect(Array.isArray(responseBody)).toBe(true);
    });

    test("Trying run migrations migrated already", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
      });
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.length).toEqual(0);
      expect(Array.isArray(responseBody)).toBe(true);
    });
  });
});
