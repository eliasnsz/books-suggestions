import { query } from "infra/database";

type User = {
  id: string;
  google_id: string;
  email: string;
  first_name: string;
  last_name: string;
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

async function findOrCreateFromGoogle(
  userObject: CreateUserParams,
): Promise<User> {
  const existingUser = await findOneByGoogleId(userObject.google_id);
  return existingUser ? existingUser : await createFromGoogle(userObject);

  async function findOneByGoogleId(googleId: string) {
    const result = await query<User>({
      text: `
        SELECT 
          id, google_id, first_name, last_name, email, profile_image_url, created_at
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
    const result = await query<User>({
      text: `
      INSERT INTO 
        users (google_id, email, first_name, last_name, profile_image_url) 
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        id, 
        google_id, 
        email, 
        first_name, 
        last_name,
        profile_image_url,
        created_at;
      `,
      values: [
        userObject.google_id,
        userObject.email,
        userObject.firstName,
        userObject.lastName,
        userObject.profileImageUrl,
      ],
    });

    return result.rows[0];
  }
}

export default Object.freeze({
  findOrCreateFromGoogle,
});
