import retry from "async-retry";
import { faker } from "@faker-js/faker/locale/pt_BR";

import { query } from "infra/database";
import type { User } from "@/models/user";
import jwt from "@/models/jwt";
import migrator from "@/models/migrator";
import user from "@/models/user";

if (process.env.NODE_ENV !== "test") {
  throw new Error(
    "Orquestrador deve ser utilizado somente em ambiente de testes.",
  );
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

async function cleanDatabase() {
  await query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createNewUser(userObject: Partial<User> = {}) {
  const userData = {
    id: faker.string.uuid(),
    googleId: faker.string.numeric({ length: 30 }),
    email: faker.internet.email({ provider: "gmail" }),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    profileImageUrl: faker.image.url(),
    ...userObject,
  };

  return await user.findOrCreateFromGoogle({
    google_id: userData.googleId,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    profileImageUrl: userData.profileImageUrl,
  });
}

async function addFeaturesToUser(userObject: User, features: string[]) {
  await user.addFeatures(userObject.id, features);
}

async function removeFeatureFromUser(userObject: User, feature: string) {
  await user.removeFeature(userObject.id, feature);
}

async function authenticateUser(userData: User) {
  const { id, ...userWithoutId } = userData;

  const token = jwt.generateJsonWebToken(userWithoutId, {
    subject: id,
  });

  return token;
}

export default Object.freeze({
  waitForAllServices,
  cleanDatabase,
  runPendingMigrations,
  createNewUser,
  authenticateUser,
  addFeaturesToUser,
  removeFeatureFromUser,
});
