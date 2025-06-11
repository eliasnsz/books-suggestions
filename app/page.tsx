import { getAuthenticatedUser } from "@/http/get-authenticated-user";
import { redirect } from "next/navigation";

const UNAUTHENTICATED_REDIRECT_URL = "/api/v1/auth/google"

export default async function Page() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return redirect(UNAUTHENTICATED_REDIRECT_URL);
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="flex flex-col px-6 py-4 items-center gap-2 rounded-2xl">
        <h1 className="text-3xl font-bold tracking-tighter text-shadow-md">
          Bem-vindo {user.first_name}!
        </h1>
      </div>
    </div>
  );
}
