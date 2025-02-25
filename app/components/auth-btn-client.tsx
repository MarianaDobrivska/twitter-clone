"use client";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || location.origin;

export default function AuthButtonClient({
  session,
}: {
  session: Session | null;
}) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${redirectUrl}/auth/callback` },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  return session ? (
    <button className="text-xs text-gray-400" onClick={handleSignOut}>
      Sign out
    </button>
  ) : (
    <button className="text-xs text-gray-400" onClick={handleSignIn}>
      Sign in
    </button>
  );
}
