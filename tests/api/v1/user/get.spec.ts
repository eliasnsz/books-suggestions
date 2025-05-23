import type { User } from "@/models/user";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET api/v1/user", async () => {
  describe("Anonymous User", () => {
    test("Trying retrieve current authenticated user", async () => {
      const response = await fetch("http://localhost:3000/api/v1/user");
      const responseBody = await response.json();

      expect(response.status).toBe(401);
      expect(responseBody).toMatchObject({
        name: "UnauthorizedError",
        message: "Você deve estar autenticado para realizar esta ação.",
        action: "Faça login e tente novamente.",
        status_code: 401,
      });
    });
  });

  describe("Authenticated user but without 'read:session' feature", () => {
    let user: User;
    let token: string;

    beforeAll(async () => {
      user = await orchestrator.createNewUser();
      await orchestrator.removeFeatureFromUser(user, "read:session");
      token = await orchestrator.authenticateUser(user);
    });

    test("Trying retrieve current authenticated user", async () => {
      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `access_token=${token}`,
        },
      });

      const responseBody = await response.json();

      expect(response.status).toBe(403);
      expect(responseBody).toMatchObject({
        name: "ForbiddenError",
        message: "Usuário não pode executar esta ação.",
        action: 'Verifique se o usuário possui a feature "read:session".',
        status_code: 403,
      });
    });
  });

  describe("User with 'read:session: feature", () => {
    let user: User;
    let token: string;

    beforeAll(async () => {
      user = await orchestrator.createNewUser();
      token = await orchestrator.authenticateUser(user);
    });

    test("Trying retrieve current authenticated user", async () => {
      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `access_token=${token}`,
        },
      });

      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toMatchObject<User>({
        id: user.id,
        google_id: user.google_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        features: ["read:session"],
        profile_image_url: user.profile_image_url,
        created_at: new Date(user.created_at).toISOString(),
      });
    });
  });
});
