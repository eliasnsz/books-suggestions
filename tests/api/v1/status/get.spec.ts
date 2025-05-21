import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET api/v1/status", async () => {
  describe("Anonymous User", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      const responseBody = await response.json();

      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(parsedUpdatedAt).toEqual(responseBody.updated_at);

      expect(response.status).toBe(200);
      expect(responseBody.dependencies.database).toMatchObject({
        status: "HEALTHY",
        active_connections: 1,
        max_connections: 100,
        postgres_version: expect.any(String),
      });

      expect(responseBody.dependencies.webserver).toEqual(
        expect.objectContaining({
          status: "HEALTHY",
          provider: "local",
          environment: "local",
        }),
      );
    });
  });
});
