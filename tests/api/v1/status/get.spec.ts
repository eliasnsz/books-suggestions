describe("GET api/v1/status", async () => {
  describe("Anonymous User", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      const responseBody = await response.json();

      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(parsedUpdatedAt).toEqual(responseBody.updated_at);

      expect(response.status).toBe(200);
      expect(responseBody.status).toBe("HEALTHY");
      expect(responseBody.dependencies.database.active_connections).toEqual(1);
      expect(responseBody.dependencies.database.max_connections).toEqual(100);
    });
  });
});
