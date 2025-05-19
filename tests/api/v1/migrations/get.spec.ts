import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET api/v1/migrations", async () => {
  describe("Anonymous User", () => {
    test("Retrieving pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      const responseBody = await response.json();

      expect(response.status).toBe(401);
      expect(responseBody).toMatchObject({
        name: "UnauthorizedError",
        message: "Você deve estar autenticado para realizar esta ação.",
        status_code: 401,
        action: "Faça login e tente novamente.",
      });
    });
  });

  describe("Authenticated User", () => {
    test("Retrieving pending migrations", async () => {
      const user = await orchestrator.createNewUser();
      const token = await orchestrator.authenticateUser(user);

      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        headers: {
          Cookie: `access_token=${token}; HttpOnly; Max-Age=3600`,
        },
      });

      const responseBody = await response.json();

      expect(response.status).toBe(403);
      expect(responseBody).toMatchObject({
        name: "ForbiddenError",
        message: "Usuário não pode executar esta ação.",
        action: 'Verifique se o usuário possui a feature "read:migrations".',
        status_code: 403,
      });
    });
  });

  describe("User With Modified Token", () => {
    test("Retrieving pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        headers: {
          Cookie:
            "access_token=alterei-o-token-sou-hacker; HttpOnly; Max-Age=3600",
        },
      });

      const responseBody = await response.json();

      expect(response.status).toBe(401);
      expect(responseBody).toMatchObject({
        name: "UnauthorizedError",
        message: "Seu token de autenticação é inválido ou expirou.",
        action: "Faça login novamente para obter um novo token.",
        status_code: 401,
      });
    });
  });

  describe("User with 'read:migrations' feature", () => {
    test("Retrieving pending migrations", async () => {
      const user = await orchestrator.createNewUser();
      await orchestrator.addFeaturesToUser(user, ["read:migrations"]);
      const token = await orchestrator.authenticateUser(user);

      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        headers: {
          Cookie: `access_token=${token}; HttpOnly; Max-Age=3600`,
        },
      });

      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.length).toEqual(0);
      expect(Array.isArray(responseBody)).toBe(true);
    });
  });
});
