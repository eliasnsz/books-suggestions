import { cookies } from "next/headers";
import type { User } from "@/models/user";
import { cache } from "react";

async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();

  if (!cookieStore.has("access_token")) {
    return null;
  }

  return cookieStore.get("access_token").value;
}

export const getAuthenticatedUser = cache(async () => {
  try {
    const token = await getAccessToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: {
        Cookie: `access_token=${token};`,
      },
    });

    if ([401, 403].includes(response.status)) {
      return null;
    }

    const data: User = await response.json();

    return data;
  } catch (error) {
    // Maybe display message on toast?
    console.log({ error: error.message });

    return null;
  }
});
