import { NotFoundError } from "@/errors";
import { query } from "infra/database";

export type User = {
  id: string;
  google_id: string;
  email: string;
  first_name: string;
  last_name: string;
  features: string[];
  profile_image_url: string;
  created_at: string;
};

type CreateUserParams = {
  google_id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
};

async function findOneById(userId: string) {
  const result = await runSelectQuery(userId);

  if (result.rowCount === 0) {
    throw new NotFoundError({
      message: "Usuário não encontrado.",
      action: 'Verifique se o campo "id" foi informado corretamente.',
    });
  }

  return result.rows[0];

  async function runSelectQuery(userId: string) {
    const userQueryResult = await query<User>({
      text: `
        SELECT
          id, google_id, first_name, last_name, email, features, profile_image_url, created_at
        FROM
          users
        WHERE
          id = $1
        LIMIT
          1;
      `,
      values: [userId],
    });
    return userQueryResult;
  }
}

async function findOrCreateFromGoogle(
  userObject: CreateUserParams,
): Promise<User> {
  const existingUser = await findOneByGoogleId(userObject.google_id);
  return existingUser ? existingUser : await createFromGoogle(userObject);

  async function findOneByGoogleId(googleId: string) {
    const result = await query<User>({
      text: `
        SELECT 
          id, google_id, first_name, last_name, email, features, profile_image_url, created_at
        FROM
          users
        WHERE
          google_id = $1
        LIMIT
          1;
      `,
      values: [googleId],
    });

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  }

  async function createFromGoogle(userObject: CreateUserParams) {
    const defaultUserFeatures = [];

    const result = await query<User>({
      text: `
      INSERT INTO 
        users (google_id, email, first_name, last_name, features, profile_image_url) 
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING
        id, 
        google_id, 
        email, 
        first_name, 
        last_name,
        features,
        profile_image_url,
        created_at;
      `,
      values: [
        userObject.google_id,
        userObject.email,
        userObject.firstName,
        userObject.lastName,
        defaultUserFeatures,
        userObject.profileImageUrl,
      ],
    });

    return result.rows[0];
  }
}

async function addFeatures(userId: string, features: string[]) {
  await runUpdateQuery(userId, features);

  async function runUpdateQuery(userId: string, features: string[]) {
    await query({
      text: `
        UPDATE 
          users 
        SET 
          features = array_cat(features, $1) 
        WHERE 
          users.id = $2;
      `,
      values: [features, userId],
    });
  }
}

export default Object.freeze({
  findOneById,
  findOrCreateFromGoogle,
  addFeatures,
});
