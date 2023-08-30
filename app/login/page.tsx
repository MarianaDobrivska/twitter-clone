import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GitHubButton from "./login-buttons";

export const dynamic = "force-dynamic";

export default async function login() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex flex-1 justify-center items-center">
      <GitHubButton />
    </div>
  );
}
